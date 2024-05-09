const assert = require('assert')
const api = require('./../api')

let app = {}

describe('Suite de testes da API Heroes', function() {
    this.beforeAll(async () => {
        app = await api
    })

    it('listar /herois api', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
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
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
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
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
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
        const NAME = 'Homem aranha-1714437295556'

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome === NAME)
    })
})