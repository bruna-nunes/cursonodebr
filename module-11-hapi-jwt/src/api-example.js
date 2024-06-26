// npm i hapi

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const app = new Hapi.Server({
    port: 5000
})

async function main(){
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroisSchema))

    app.route([
        {
            path: '/herois',
            method: 'GET',
            handler: (request, head) => {
                return context.read()
            }
        }
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)
}

main()


// node api-example.js
// http://localhost:5000/herois