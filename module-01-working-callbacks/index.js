/*
0 - Obter um usuario
1 - Obter o numero de telefone de um usuario a partir de seu ID
2 - Obter o endereco do usuario pelo ID
*/

// Importamos um modulo interno do node js
const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    // quando der problema -> reject(error)
    // quando sucesso -> resolve
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                telefone: '1199002',
                ddd: 11
            })
        }, 2000)
    })

}

function obterEndereco(idUsuario, callback) {
        setTimeout(() => {
            return callback(null, {
                rua: 'dos bobos',
                numero: 0
            })
        }, 2000)
}

const usuarioPromise = obterUsuario()

// para manipular com sucesso usamos .then
//para manipular erros, usamos .catch
usuarioPromise
    .then(function(usuario) {
        return obterTelefone(usuario.id)
            .then(function resolverTelefone(result) {
                return {
                    usuario: {
                        nome: usuario.nome,
                        id: usuario.id,
                    },
                    telefone:  result
                }
            })
    })
    .then(function(resultado) {
        const endereco = obterEnderecoAsync(resultado.usuario.id)
        return endereco.then(function resolverEndereco(result) {
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: result
            }
        })
    })
    .then(function(resultado) {
        console.log('resultado', resultado)
    })
    .catch(function(error) {
        console.error('Erro em usuario: ', error)
    })


// COM ASYNC AWAIT
// 1 passo adicionar a palavra async -> automaticamente retorna uma promise
async function main() {
    try {
        console.time('medida')
        const usuario = await obterUsuario()
        
        // const telefone = await obterTelefone(usuario.id)
        // const endereco = await obterEnderecoAsync(usuario.id)

        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEnderecoAsync(usuario.id)
        ])
        const endereco = resultado[1]
        const telefone = resultado[0]

        console.log(`
            Nome: ${usuario.nome}
            Telefone: (${telefone.ddd}) ${telefone.telefone}
            Endereço: ${endereco.rua}, ${endereco.numero}
        `)
        console.timeEnd('medida')
    } catch (error) {
        console.error('Erro na main', error)
    }
}

main()

// Sem promises, encadeamento e callbacks
// obterUsuario(function resolverUsuario(erro, usuario) {
//     // null || "" || 0 == false
//     if(erro) {
//         console.error('Erro em usuario', erro)
//         return
//     }
//     obterTelefone(usuario.id, function resolverTelefone(erro1, telefone) {
//         if(erro1) {
//             console.error('Erro em telefone', erro1)
//             return
//         }
//         obterEndereco(usuario.id, function resolverEndereco(erro2, endereco) {
//             if(erro2) {
//                 console.error('Erro em endereco', erro2)
//                 return
//             }
//             console.log(`
//                 Nome: ${usuario.nome}
//                 Endereço: ${endereco.rua}, ${endereco.numero}
//                 Telefone: (${telefone.ddd}) ${telefone.telefone}
//             `)
//         })
//     })
// })


