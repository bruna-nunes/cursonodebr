const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const HeroisSchema = require('./../db/strategies/postgres/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'Flechas'}
const MOCK_HEROI_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro'}

let context = {}

describe('Postgres Strategy', function() {
    this.timeout(Infinity) // se o banco demorar pra carregar
    this.beforeAll(async function(){
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroisSchema)
        context = new Context(new Postgres(connection, model))

        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
    })
    it('PostgresSQL Connection', async function() {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('cadastro de heroi postgres', async function() {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('listar herois postgres', async function(){
        const [result] =  await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        delete result.id
        // pegar a primeira posicao
        // const posicaoZero = result[0]
        // const [posicao1, posicao2] = await

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar herois postgres', async function() {
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({id: itemAtualizar.id})

        assert.deepEqual(result, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
        /*
            No JS temos uma tecnica chamada rest/spread que é um metodo usado
            para mergear objetos ou separa-los
            {
                nome: 'Batman'
                poder: 'Dinheiro'
            }
            {
                data: '1991-01-01'
            }
            //final
            {
                nome: 'Batman'
                poder: 'Dinheiro'
                data: '1991-01-01'
            }
        */
    })

    it('remover heroi por id postgres', async function(){
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepEqual(result, 1)
    })
})

// executar `npm run test` na pasta