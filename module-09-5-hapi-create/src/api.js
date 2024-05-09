// npm i hapi

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesRoutes = require('./routes/heroesRoutes')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    console.log('methods', methods)
    return methods.map(method => instance[method]())
}

async function main(){
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroisSchema))

    // [list(), create(), ...]
    app.route([
        ...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
    
    return app
}

module.exports = main()


// node api.js
// http://localhost:5000/herois