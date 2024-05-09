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

    create() {
      return {
        path: '/herois',
        method: 'POST',
        config: {
            validate: {
                failAction: (request, headers, erro) => {
                    throw erro
                },
                payload: {
                    nome: Joi.string().required().min(2).max(200),
                    poder: Joi.string().required().min(2).max(100)
                }
            }
        },
        handler: async (request) => {
            try {
                const { nome, poder } = request.payload
                const result = await this.db.create({nome, poder})
                return {
                    message: 'Heroi cadastrado com sucesso!',
                    _id: result._id
                }
            } catch(error) {
                console.log('Erro em create', error)
                    return "Internal Error!"
            }
        }
      }  
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(2).max(200),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params

                    const { payload } = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)

                    if(result.modifiedCount !== 1) {
                        return 'Não foi possível atualizar!'
                    }
                    return {
                        message: 'Heroi atualizado com sucesso!',
                    }
                } catch(error) {
                    console.log('Erro em update', error)
                        return "Internal Error!"
                }
            }
          } 
    }
}

module.exports = HeroesRoutes