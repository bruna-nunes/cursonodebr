const assert = require('assert')
const api = require('./../api')

let app = {}
const TOKEN = ' $2b$04$yfGb/AJuhoFDszfhnoRU9uCPui..FgXHQfG6Lem1YNPla4BYwsJ1S'

const headers = {
    Authorization: TOKEN
}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta biônica'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Flechas'
}

let MOCK_ID = ''

describe('Suite de testes da API Heroes', function() {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL),
            headers
        })
        const dados = JSON.parse(result.payload)

        MOCK_ID = dados._id
    })

    it('listar /herois api', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10',
            headers
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - deve retornar somente 10 registros', async () => {
        const TAMANHO_LIMITE = 10
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'stringaqui'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })
        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
              "source": "query",
              "keys": [
                "limit"
              ]
            }
          }
        
        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('listar /herois - deve filtrar um item', async () => {
        const NAME = MOCK_HEROI_INICIAL.nome

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=${NAME}`,
            headers
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome === NAME)
    })

    it('cadastrar POST - /herois api', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR),
            headers
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi cadastrado com sucesso!')

    })
    
    it('atualizar PATCH - /herois/:id api', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected),
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')

    })

    it('atualizar PATCH - /herois/:id api - nao deve atualizar com ID incorreto', async () => {
        const _id = '662c076cee038e6f767218b8'
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected),
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expectedError = {
            "statusCode": 412,
            "error":"Precondition Failed",
            "message":"ID não encontrado no banco"
        }

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expectedError)

    })

    it('remover DELETE - /herois/:id', async () => {
        const _id = MOCK_ID

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi removido com sucesso!')
        
    })
})