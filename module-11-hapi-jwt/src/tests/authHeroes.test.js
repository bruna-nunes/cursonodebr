const assert = require('assert')
const api = require('../api')
let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJydW5hIiwiaWQiOjEsImlhdCI6MTcxNTEyMzExMn0.CFAk5o78AaMFccGpi0XHKA1q517aUW8L9jbe4rdWrw4'
describe('Auth test suite', function() {
    this.beforeAll(async () => {
        app = await api
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'bruna',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)

    })
})