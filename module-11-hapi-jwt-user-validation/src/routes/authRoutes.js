const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')

// npm i jsonwebtoken
const JWT = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')

const USER = {
    username: 'bruna',
    password: '123'
}
class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'faz login com user e senha do banco',
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload

                // if(username.toLowerCase() !== USER.username || password !== USER.password) {
                //     return Boom.unauthorized
                // }
                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })

                if(!usuario) {
                    return Boom.unauthorized('O usuario informado não existe!')
                }

                const match = await PasswordHelper.comparePassword(password, usuario.password)

                if(!match) {
                    return Boom.unauthorized('Usuario ou senha inválidos!')
                }


                const token = JWT.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)

                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes