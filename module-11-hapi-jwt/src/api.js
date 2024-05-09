// npm i hapi
// npm i vision inert hapi-swagger
// http://localhost:5000/documentation
// npm i hapi-auth-jwt2

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesRoutes = require('./routes/heroesRoutes')
const AuthRoutes = require('./routes/authRoutes')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'CHAVE_SECRETA_321'

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
    
    const swaggerOptions = {
        info: {
            title: 'API Herois - CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (dado, request) => {
            // verifica no banco se usuario continua ativo

            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')

    // [list(), create(), ...]
    app.route([
        ...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
    
    return app
}

module.exports = main()


// node api.js
// http://localhost:5000/herois