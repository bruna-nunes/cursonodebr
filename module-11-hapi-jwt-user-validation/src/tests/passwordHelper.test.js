const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Bruna@123'
const HASH = '$2b$04$3g3Q.5.WRI5hchcufEkOw.TAIIxF9T18Tse.uIox5WjQ1FMw0wO8C'

describe('UserHelper teste suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })
})