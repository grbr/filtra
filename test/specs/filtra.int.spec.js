let chai = require('chai')
should = chai.should()

const Filtra = require('../../')

describe('.int', () => {
  describe('.int(key)', () => {
    it('throws error for not existing', () => {
      ;(() => {
        Filtra({}).int('x')
      }).should.throw(Error)
    })
    it('throws error for undefined', () => {
      ;(() => {
        Filtra({x: undefined}).int('x')
      }).should.throw(Error)
    })
    it('throws error for null', () => {
      ;(() => {
        Filtra({x: null}).int('x')
      }).should.throw(Error)
    })
    it('writes int for int', () => {
      Filtra({x: 0}).int('x').filter().x.should.equal(0)
      Filtra({x: -10}).int('x').filter().x.should.equal(-10)
      Filtra({x: 20}).int('x').filter().x.should.equal(20)
    })
    it('converts strings if possible', () => {
      Filtra({x: '0'}).int('x').filter().x.should.equal(0)
      Filtra({x: '-10'}).int('x').filter().x.should.equal(-10)
      Filtra({x: '20'}).int('x').filter().x.should.equal(20)
    })
    it('not accepts float', () => {
      ;(() => {
        Filtra({x: 1.1}).int('x')
      }).should.throw(Error)
    })
    it('not accepts objects', () => {
      ;(() => {
        Filtra({x: {}}).int('x')
      }).should.throw(Error)
    })
    it('not accepts arrays', () => {
      ;(() => {
        Filtra({x: [1, 2, 3]}).int('x')
      }).should.throw(Error)
    })
  })
  describe('.int(key, default)', () => {
    it('writes default for not existing', () => {
      should.equal(Filtra({}).int('x', 777).filter().x, 777)
    })
    it('writes default for undefined', () => {
      should.equal(Filtra({x: undefined}).int('x', 777).filter().x, 777)
    })
    it('writes default for null', () => {
      should.equal(Filtra({x: null}).int('x', 777).filter().x, 777)
    })
    it('writes int for valid', () => {
      should.equal(Filtra({x: 888}).int('x', 777).filter().x, 888)
    })
    it('writes int for int', () => {
      Filtra({x: 0}).int('x', 777).filter().x.should.equal(0)
      Filtra({x: -10}).int('x', 777).filter().x.should.equal(-10)
      Filtra({x: 20}).int('x', 777).filter().x.should.equal(20)
    })
    it('converts strings if possible', () => {
      Filtra({x: '0'}).int('x', 777).filter().x.should.equal(0)
      Filtra({x: '-10'}).int('x', 777).filter().x.should.equal(-10)
      Filtra({x: '20'}).int('x', 777).filter().x.should.equal(20)
    })
    it('not accepts float', () => {
      ;(() => {
        Filtra({x: 1.1}).int('x', 777)
      }).should.throw(Error)
    })
    it('not accepts objects', () => {
      ;(() => {
        Filtra({x: {}}).int('x', 777)
      }).should.throw(Error)
    })
    it('not accepts arrays', () => {
      ;(() => {
        Filtra({x: [1, 2, 3]}).int('x', 777)
      }).should.throw(Error)
    })
  })
  describe('.min(min)', () => {
    it('writes int for proper int', () => {
      should.equal(Filtra({x: 5}).int('x').min(5).filter().x, 5)
      should.equal(Filtra({x: 6}).int('x').min(5).filter().x, 6)
      should.equal(Filtra({x: -1}).int('x').min(-5).filter().x, -1)
      should.equal(Filtra({x: 0}).int('x').min(-5).filter().x, 0)
      should.equal(Filtra({x: 1}).int('x').min(-5).filter().x, 1)
    })
    it('or throws error for length < min', () => {
      ;(() => {
        Filtra({x: 4}).int('x').min(5)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -1}).int('x').min(0)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -6}).int('x').min(99)
      }).should.throw(Error)
    })
  })
  describe('.max(max)', () => {
    it('writes int for proper int', () => {
      should.equal(Filtra({x: 5}).int('x').max(5).filter().x, 5)
      should.equal(Filtra({x: 6}).int('x').max(7).filter().x, 6)
      should.equal(Filtra({x: -3}).int('x').max(-2).filter().x, -3)
      should.equal(Filtra({x: 0}).int('x').max(1).filter().x, 0)
      should.equal(Filtra({x: -1}).int('x').max(0).filter().x, -1)
    })
    it('or throws error for length < max', () => {
      ;(() => {
        Filtra({x: 6}).int('x').max(5)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: 1}).int('x').max(0)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -4}).int('x').max(-5)
      }).should.throw(Error)
    })
  })
  describe('.range(min, max)', () => {
    it('writes int for proper int with length in range', () => {
      should.equal(Filtra({x: 4}).int('x').range(4, 7).filter().x, 4)
      should.equal(Filtra({x: 5}).int('x').range(4, 7).filter().x, 5)
      should.equal(Filtra({x: 7}).int('x').range(4, 7).filter().x, 7)
    })
    it('or throws error', () => {
      ;(() => {
        Filtra({x: 8}).int('x').range(4, 7)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -99999}).int('x').range(4, 7)
      }).should.throw(Error)
    })
  })
  describe('.in (=.any)', () => {
    it('writes int for int in array of allowable values', () => {
      should.equal(Filtra({x: 4}).int('x').in([4, 8]).filter().x, 4)
      should.equal(Filtra({x: 8}).int('x').in([4, 8]).filter().x, 8)
      should.equal(Filtra({x: 4}).int('x').any([4, 8]).filter().x, 4)
      should.equal(Filtra({x: 8}).int('x').any([4, 8]).filter().x, 8)
    })
    it('or throws error', () => {
      ;(() => {
        Filtra({x: 'realybad'}).int('x').in([4, 8])
      }).should.throw(Error)
    })
  })
})
