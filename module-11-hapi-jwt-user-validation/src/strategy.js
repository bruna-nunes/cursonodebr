class NotImplementedException extends Error {
    constructor() {
        super("Not implemented Exception")
    }
}

class ICrud {
    create(item) {
        throw new NotImplementedException()
    }

    read(query) {
        throw new NotImplementedException()
    }

    update(id, item) {
        throw new NotImplementedException()
    }

    delete(id) {
        throw new NotImplementedException()
    }
}

class MongoDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log('O item foi salvo em MONGODB')
    }
}

class Postgres extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log('O item foi salvo em POSTGRES')
    }
}

class ContextStrategy {
    constructor(strategy) {
        this._database = strategy
    }

    create(item) {
        return this._database.create(item)
    }

    read(query) {
        return this._database.read(query)
    }

    update(id, item) {
        return this._database.update(id, item)
    }

    delete(id) {
        return this._database.delete(id)
    }
}

const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create({})

const contextPostgress = new ContextStrategy(new Postgres())
contextPostgress.create({})

contextMongo.read()