const assert = require('assert')
const api = require('../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgres/postgres')
const UsuariosSchema = require('./../db/strategies/postgres/schemas/usuariosSchema')

let app = {}

const USER = { 
    username: 'bruna',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: ' $2b$04$yfGb/AJuhoFDszfhnoRU9uCPui..FgXHQfG6Lem1YNPla4BYwsJ1S'
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJydW5hIiwiaWQiOjEsImlhdCI6MTcxNTEyMzExMn0.CFAk5o78AaMFccGpi0XHKA1q517aUW8L9jbe4rdWrw4'

describe('Auth test suite', function() {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UsuariosSchema)
        const postgresContext = new Context(new Postgres(connectionPostgres, model))
        await postgresContext.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)

    })

    it('deve retornar nao autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'usuarioinvalido',
                password: '1234'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })
})