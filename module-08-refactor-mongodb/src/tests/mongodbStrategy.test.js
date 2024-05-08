const assert = require('assert')
const MongoDB = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}

const MOCK_HEROI_DEFAULT = {
    nome: `Homem aranha-${Date.now()}`,
    poder: 'Super teia'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Velocidade'
}

let MOCK_HEROI_ID = ''

let context = {}

describe('MongoDB Suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroiSchema))
        
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })
    it('verificar conexao mongodb', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })

    it('cadastro de herois mongodb', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)

        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('listar herois mongodb', async () => {
        const [{nome, poder}] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })

        const result = {
            nome, poder
        }

        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })

    it('atualizar herois mongodb', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })

        assert.deepEqual(result.modifiedCount, 1)
    })

    it('remover herois mongodb', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.deletedCount, 1)
    })
})

//npm run test