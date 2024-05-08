const ICrud = require('./interfaces/interfaceCrud')

class MongoDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log('O item foi salvo em MONGODB')
    }
}

module.exports = MongoDB