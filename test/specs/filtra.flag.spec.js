let chai = require('chai')
should = chai.should()

const Filtra = require('../../')

describe('.flag', () => {
  describe('.flag(key)', () => {
    it('throws error for not existing', () => {
      ;(() => {
        Filtra({}).flag('x').filter()
      }).should.throw(Error)
    })
    it('throws error for undefined', () => {
      ;(() => {
        Filtra({x: undefined}).flag('x').filter()
      }).should.throw(Error)
    })
    it('throws error for null', () => {
      ;(() => {
        Filtra({x: null}).flag('x').filter()
      }).should.throw(Error)
    })
    it('writes flag', () => {
      should.equal(Filtra({x: true}).flag('x').filter().x, true)
      should.equal(Filtra({x: 'true'}).flag('x').filter().x, true)
      should.equal(Filtra({x: 't'}).flag('x').filter().x, true)
      should.equal(Filtra({x: false}).flag('x').filter().x, false)
      should.equal(Filtra({x: 'false'}).flag('x').filter().x, false)
      should.equal(Filtra({x: 'f'}).flag('x').filter().x, false)
    })
    it('throws for anything else', () => {
      ;(() => {
        Filtra({x: 'bla'}).flag('x')
      }).should.throw(Error)
      ;(() => {
        Filtra({x: {}}).flag('x')
      }).should.throw(Error)
      ;(() => {
        Filtra({x: 0}).flag('x')
      }).should.throw(Error)
    })
  })
  describe('.flagOpt(key)', () => {
    it('writes null for null', () => {
      should.equal(Filtra({x: null}).flagOpt('x').filter().x, null)
    })
    it('writes null for undefined', () => {
      should.equal(Filtra({x: undefined}).flagOpt('x').filter().x, null)
      should.equal(Filtra({}).flagOpt('x').filter().x, null)
    })
    it('throws for anything else', () => {
      ;(() => {
        Filtra({x: 'bla'}).flagOpt('x')
      }).should.throw(Error)
      ;(() => {
        Filtra({x: {}}).flagOpt('x')
      }).should.throw(Error)
      ;(() => {
        Filtra({x: 0}).flagOpt('x')
      }).should.throw(Error)
    })
  })
  describe('.flag(key, default)', () => {
    it('writes flag', () => {
      should.equal(Filtra({}).flag('x', true).filter().x, true)
      should.equal(Filtra({}).flag('x', false).filter().x, false)
      should.equal(Filtra({}).flag('x', 'f').filter().x, false)
    })
    it('throws for wrong default', () => {
      ;(() => {
        Filtra({x: null}).flag('x', 'wrong')
      }).should.throw(Error)
    })
  })
  describe('.apply(f)', () => {
    it('apply function on flag', () => {
      should.equal(Filtra({x: true}).flag('x').apply(x => !x).filter().x, false)
      should.equal(Filtra({x: false}).flag('x').apply(() => true).filter().x, true)
    })
  })
})
