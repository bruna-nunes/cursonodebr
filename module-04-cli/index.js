const { Command } = require('commander')
const Database = require('./database')
const Heroi = require('./heroi')

async function main() {
    const program = new Command()

    program
        .version('v1')
        .option('-n, --nome [value]', "Nome do heroi")
        .option('-p, --poder [value]', "Poder do heroi")
        .option('-i, --id [value]', "Id do heroi")


        .option('-c, --cadastrar', "Cadastrar um heroi")

        .option('-l, --listar', "Listar um heroi")
        
        .option('-rm, --remover', "Remove um heroi pelo id")

        .option('-a, --atualizar [value]', "Atualizar um heroi pelo id")
        
    program.parse(process.argv)

    const options = program.opts()
    const heroi = new Heroi(options)

    try {
        if(options.cadastrar) {
            delete heroi.id
            const resultado = await Database.cadastrar(heroi)
            
            if(!resultado) {
                console.error('Heroi nao foi cadastrado')
                return
            }
            console.log('Heroi cadastrado com sucesso')
        }

        if(options.listar) {
            const resultado = await Database.listar()
            console.log(resultado)
            return
        }

        if(options.remover) {
            const resultado = await Database.remover(heroi.id)
            if(!resultado) {
                console.error('Nao foi possivel remover o heroi')
                return
            }

            console.log('Heroi removido com sucesso')
        }

        if(options.atualizar) {
            const idParaAtualizar = parseInt(options.atualizar)
            delete heroi.id

            // remover todas as chaves que tiverem com undefined / null
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)

            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)
            if(!resultado) {
                console.error('Nao foi possivel atualizar o heroi')
                return
            }
            console.log('Heroi atualizado com sucesso')


        }

    } catch(erro) {
        console.log('Erro ', erro)
    }
}

main()

// Rodar
// node index.js --help
// node index.js -c -n Flash -p Speed -i 2
// node index.js -l
// node index.js -rm -i  1713485733131
// node index.js -a 1713486075991 -n Chapolin