const {
    readFile,
    writeFile
} = require('fs')

const { promisify } = require('util')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

// // outra forma d eobter dados do json
// const dadosJson = require('./herois.json')
// //mas fazendo com fs pra simular e tbm deixar aberto pra outros formatos de arquivo
class Database {
    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDadosArquivo() {
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8')
        return JSON.parse(arquivo.toString())
    }

    async escreverArquivos(dados) {
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados))
        return true
    }

    async cadastrar(heroi) {
        const dados = await this.obterDadosArquivo()
        const id = heroi.id <= 2 ? heroi.id : Date.now()

        /*
            {
                nome: Flash,
                poder: Velocidade
            }

            {
                id: 12345,
            }

            {
                id: 12345,
                nome: Flash,
                poder: Velocidade
            }
        */
       const heroiComId = {
            id,
            ...heroi
       }

       const dadosFinal = [
        ...dados,
        heroiComId
       ]

       const resultado = await this.escreverArquivos(dadosFinal)
       return resultado
    }

    async listar(id) {
        const dados = await this.obterDadosArquivo()
        const dadosFiltrados = dados.filter(item => id ? item.id === id : true)
        return dadosFiltrados
    }

    async remover(id) {
        if(!id) {
            await this.escreverArquivos([])
            return true
        }
        const dados = await this.obterDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))

        if(indice === -1) {
            throw Error('O heroi informado nao existe')
        }

        dados.splice(indice, 1)

        return await this.escreverArquivos(dados)
    }

    async atualizar(id, modificacoes) {
        const dados = await this.obterDadosArquivo()

        const indice = dados.findIndex(item => item.id === parseInt(id))

        if(indice === -1) {
            throw Error('O heroi informado nao existe')
        }

        const atual = dados[indice]
        const objetoAtualizar = {
            ...atual,
            ...modificacoes
        }

        dados.splice(indice, 1)

        return await this.escreverArquivos([
            ...dados,
            objetoAtualizar
        ])
    }
}

module.exports = new Database()