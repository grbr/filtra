let chai = require('chai')
should = chai.should()

const Filtra = require('../../')
const genUuidv4 = require('uuid/v4')

describe('.uuidV4', () => {
  describe('.uuidV4(key, uuidV4())', () => {
    it('writes generated UUIDs', () => {
      for (let i = 0; i < 30; i++) {
        const uuid = genUuidv4()
        let generated = Filtra({}).uuidV4('x', genUuidv4()).filter().x
        should.equal(Filtra({x: generated}).uuidV4('x').filter().x, generated)
      }
    })
  })
  describe('.uuidV4Opt(key)', () => {
    it('handles empty value', () => {
        const nullval = Filtra({}).uuidV4Opt('x').filter().x
        should.equal(nullval, null)
    })
  })
  describe('.uuidV4Opt(key)', () => {
    it('handles not empty value', () => {
      const uuid = genUuidv4()
      should.equal(Filtra({x: uuid}).uuidV4('x').filter().x, uuid)
    })
  })
})
