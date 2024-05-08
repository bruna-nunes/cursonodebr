const {obterPessoas } = require('./service')

// CRIANDO O PROPRIO FILTER
Array.prototype.meuFilter = function (callback) {
    const lista = []
    for(index in this) {
        const item = this[index]
        const result = callback(item, index, this)
        if (!result) continue
        lista.push(item)
    }
    return lista
}

async function main() {
    try {
        const { results } = await obterPessoas('a')

        // const familiaLars = results.filter(function(item) {
        //     // por padrao precisa retornar boleano para informar se deve manter ou remover da lista
        //     // false = remove, true = mantem
        //     const result = item.name.toLowerCase().indexOf('lars') !== -1
        //     return result
        // })
        const familiaLars = results.meuFilter((item, index, lista) => {
            return item.name.toLowerCase().indexOf('lars') !== -1
        })

        const names = familiaLars.map(pessoa => pessoa.name)
        console.log(names)
    } catch(error) {
        console.error('Erro', error)
    }
}

main()