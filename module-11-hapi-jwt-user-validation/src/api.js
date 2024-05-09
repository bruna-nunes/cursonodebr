// npm i hapi
// npm i vision inert hapi-swagger
// http://localhost:5000/documentation
// npm i hapi-auth-jwt2

// npm i bcrypt

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesRoutes = require('./routes/heroesRoutes')
const AuthRoutes = require('./routes/authRoutes')

const PostgresDB = require('./db/strategies/postgres/postgres')
const UsuariosSchema = require('./db/strategies/postgres/schemas/usuariosSchema')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'CHAVE_SECRETA_321'

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main(){
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroisSchema))
    
    const connectionPostgres = await PostgresDB.connect()
    const model = await PostgresDB.defineModel(connectionPostgres, UsuariosSchema)
    const contextPostgres = new Context(new PostgresDB(connectionPostgres, model))

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
        validate: async (dado, request) => {
            // verifica no banco se usuario continua ativo ou outras regras

            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase(),
                id: dado.id
            })

            if(!result) {
                return {
                    isValid: false
                }
            }

            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')

    // [list(), create(), ...]
    app.route([
        ...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
    
    return app
}

module.exports = main()


// node api.js
// http://localhost:5000/herois