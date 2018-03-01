let chai = require('chai')
should = chai.should()

const Filtra = require('../../')

describe('.num', () => {
  describe('.num(key)', () => {
    it('throws error for not existing', () => {
      ;(() => {
        Filtra({}).num('x').filter()
      }).should.throw(Error)
    })
    it('throws error for undefined', () => {
      ;(() => {
        Filtra({x: undefined}).num('x').filter()
      }).should.throw(Error)
    })
    it('throws error for null', () => {
      ;(() => {
        Filtra({x: null}).num('x').filter()
      }).should.throw(Error)
    })
    it('writes num for num', () => {
      Filtra({x: 0.}).num('x').filter().x.should.equal(0)
      Filtra({x: -.5}).num('x').filter().x.should.equal(-0.5)
      Filtra({x: 11.9999}).num('x').filter().x.should.equal(11.9999)
    })
    it('converts strings if possible', () => {
      Filtra({x: '0'}).num('x').filter().x.should.equal(0)
      Filtra({x: '-.5'}).num('x').filter().x.should.equal(-0.5)
      Filtra({x: '11.9999'}).num('x').filter().x.should.equal(11.9999)
    })
    it('not accepts objects', () => {
      ;(() => {
        Filtra({x: {}}).num('x')
      }).should.throw(Error)
    })
    it('not accepts arrays', () => {
      ;(() => {
        Filtra({x: [1, 2, 3]}).num('x')
      }).should.throw(Error)
    })
  })
  describe('.num(key, default)', () => {
    it('writes default for not existing', () => {
      should.equal(Filtra({}).num('x', 777).filter().x, 777)
    })
    it('writes default for undefined', () => {
      should.equal(Filtra({x: undefined}).num('x', 777).filter().x, 777)
    })
    it('writes default for null', () => {
      should.equal(Filtra({x: null}).num('x', 777).filter().x, 777)
    })
    it('writes num for valid', () => {
      should.equal(Filtra({x: 888}).num('x', 777).filter().x, 888)
    })
    it('writes num for num', () => {
      Filtra({x: 0}).num('x', 777).filter().x.should.equal(0)
      Filtra({x: -10}).num('x', 777).filter().x.should.equal(-10)
      Filtra({x: 20}).num('x', 777).filter().x.should.equal(20)
    })
    it('converts strings if possible', () => {
      Filtra({x: '0'}).num('x', 777).filter().x.should.equal(0)
      Filtra({x: '-10'}).num('x', 777).filter().x.should.equal(-10)
      Filtra({x: '20'}).num('x', 777).filter().x.should.equal(20)
    })
    it('not accepts objects', () => {
      ;(() => {
        Filtra({x: {}}).num('x', 777)
      }).should.throw(Error)
    })
    it('not accepts arrays', () => {
      ;(() => {
        Filtra({x: [1, 2, 3]}).num('x', 777)
      }).should.throw(Error)
    })
  })
  describe('.min(min)', () => {
    it('writes num for proper num', () => {
      should.equal(Filtra({x: 5}).num('x').min(5).filter().x, 5)
      should.equal(Filtra({x: 6}).num('x').min(5).filter().x, 6)
      should.equal(Filtra({x: -1}).num('x').min(-5).filter().x, -1)
      should.equal(Filtra({x: 0}).num('x').min(-5).filter().x, 0)
      should.equal(Filtra({x: 1}).num('x').min(-5).filter().x, 1)
    })
    it('or throws error for length < min', () => {
      ;(() => {
        Filtra({x: 4}).num('x').min(5)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -1}).num('x').min(0)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -6}).num('x').min(99)
      }).should.throw(Error)
    })
  })
  describe('.max(max)', () => {
    it('writes num for proper num', () => {
      should.equal(Filtra({x: 5}).num('x').max(5).filter().x, 5)
      should.equal(Filtra({x: 6}).num('x').max(7).filter().x, 6)
      should.equal(Filtra({x: -3}).num('x').max(-2).filter().x, -3)
      should.equal(Filtra({x: 0}).num('x').max(1).filter().x, 0)
      should.equal(Filtra({x: -1}).num('x').max(0).filter().x, -1)
    })
    it('or throws error for length < max', () => {
      ;(() => {
        Filtra({x: 6}).num('x').max(5)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: 1}).num('x').max(0)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -4}).num('x').max(-5)
      }).should.throw(Error)
    })
  })
  describe('.range(min, max)', () => {
    it('writes num for proper num with length in range', () => {
      should.equal(Filtra({x: 4}).num('x').range(4, 7).filter().x, 4)
      should.equal(Filtra({x: 5}).num('x').range(4, 7).filter().x, 5)
      should.equal(Filtra({x: 7}).num('x').range(4, 7).filter().x, 7)
    })
    it('or throws error', () => {
      ;(() => {
        Filtra({x: 8}).num('x').range(4, 7)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: -99999}).num('x').range(4, 7)
      }).should.throw(Error)
    })
  })
  describe('.in (=.any)', () => {
    it('writes num for num in array of allowable values', () => {
      should.equal(Filtra({x: 4}).num('x').in([4, 8]).filter().x, 4)
      should.equal(Filtra({x: 8}).num('x').in([4, 8]).filter().x, 8)
      should.equal(Filtra({x: 4}).num('x').any([4, 8]).filter().x, 4)
      should.equal(Filtra({x: 8}).num('x').any([4, 8]).filter().x, 8)
    })
    it('or throws error', () => {
      ;(() => {
        Filtra({x: 'realybad'}).num('x').in([4, 8])
      }).should.throw(Error)
    })
  })
})
