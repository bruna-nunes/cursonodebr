const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroesRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    // payload -> body
                    // headers => header
                    // params -> na URL :id
                    // query -> skip=10&limit=10
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(200)
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query

                    const query = {
                        nome: {$regex: `.*${nome}*.`}
                    }

                    return this.db.read(
                       nome ? query : {},
                        skip,
                        limit
                    )
                } catch(error) {
                    console.log('Erro em list', error)
                    return "Erro interno no servidor"
                }
                
            }
        }
    }
}

module.exports = HeroesRoutes