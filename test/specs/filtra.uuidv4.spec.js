let chai = require('chai')
should = chai.should()

const Filtra = require('../../')
const genUuidv4 = require('uuid/v4')

describe('.uuidV4', () => {
  describe('.uuidV4(key, uuidV4())', () => {
    it('writes generated UUIDs', () => {
      for (let i = 0; i < 10; i++) {
        const uuid = genUuidv4()
        let generated = Filtra({}).uuidV4('x', genUuidv4()).filter().x
        should.equal(Filtra({x: generated}).uuidV4('x').filter().x, generated)
        generated = Filtra({}).uuidV4('x', genUuidv4()).filter().x
        should.equal(Filtra({x: generated}).uuidV4('x').filter().x, generated)
        generated = Filtra({}).uuidV4('x', genUuidv4()).filter().x
        should.equal(Filtra({x: generated}).uuidV4('x').filter().x, generated)
      }
    })
  })
})
