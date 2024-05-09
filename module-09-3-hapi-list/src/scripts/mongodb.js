/* 
> docker ps
- pegar o id do mongo db

> docker exec -it 475305abcfb1 mongo -u bruna -p minhasenhasecreta --authenticationDatabase herois

mostra todos os databases que pode usar
> show dbs

nosso contexto eh o database especifico herois
> use herois

pra visualizar as colecoes (se assemelha a tabelas)
> show collections

//create

> db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

> db.herois.find()
> db.herois.find().pretty()

> db.herois.count()

> db.herois.findOne()

- procura na collection, limita em 20 resultados e ordena pelo nome em ordem ascendente
> db.herois.find().limit(10).sort({nome: -1})

- faz a procura, e exibe a coluna poder mas nao o id
> db.herois.find({}, { poder: 1, _id: 0})


// read
> db.herois.find()

// update
> db.herois.find({nome: 'Flash'})

//update, mas somem as outras informacoes como poder
> db.herois.update({ _id: ObjectId("662c076cee038e6f767218b8")}, {nome: 'Flash 2'})

//update, mas mantem outras informacoes como poder. altera SO o nome
> db.herois.update({ _id: ObjectId("662c076cee038e6f767218b8")}, { $set: {nome: 'Flash 3'}})


//delete

//delete todos, where vazio
> db.herois.remove({})

// remove todos com nome flash
> db.herois.remove({nome: 'Flash'})
*/

db.herois.insert({nome: 'Flash', poder: 'Velocidade',dataNascimento: '1998-01-01'})