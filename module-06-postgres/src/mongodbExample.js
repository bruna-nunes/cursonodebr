// npm install mongoose
const Mongoose = require('mongoose')
Mongoose.connect(
    'mongodb://bruna:minhasenhasecreta@localhost:27017/herois'
).catch(error => {
    if(!error) {
        return
    }
    console.log('Falha na conexao!', error)
})

const connection = Mongoose.connection
connection.once('open', () => console.log('database rodando'))

// setTimeout(() => {
//     const state = connection.readyState
//     console.log('state', state)
// }, 1000)

/*
STATES
0 - desconectado
1 - conectado
2 - conectando
3 - desconectando
*/

// CRIANDO SCHEMA MONGOOSE
const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

const model = Mongoose.model('herois', heroiSchema)

async function main(){
    const resultCadastrar = await model.create({
        nome: 'Batman 2',
        poder: 'Dinheiro 2'
    })
    console.log('result cadastrar', resultCadastrar)

    const listItens = await model.find()
    console.log('items', listItens)
}

main()