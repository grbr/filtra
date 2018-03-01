let chai = require('chai')
should = chai.should()

const Filtra = require('../../')

describe('.prop', () => {
  describe('.prop(key)', () => {
    it('writes prop for prop', () => {
      should.equal(Filtra({x: 0}).prop('x').filter().x, 0)
    })
    it('writes null for null', () => {
      should.equal(Filtra({x: null}).prop('x').filter().x, null)
    })
    it('writes null for undefined', () => {
      should.equal(Filtra({x: undefined}).prop('x').filter().x, null)
      should.equal(Filtra({}).prop('x').filter().x, null)
    })
    it('writes object for Object', () => {
      const obj = {a: 1}
      should.equal(Filtra({x: obj}).prop('x').filter().x, obj)
    })
    it('writes prop for prop', () => {
      should.equal(Filtra({x: 0}).prop('x').filter().x, 0)
    })
  })
  describe('.prop(key, default)', () => {
    it('writes prop for prop', () => {
      should.equal(Filtra({x: 0}).prop('x', 777).filter().x, 0)
    })
  })
  describe('.apply(f)', () => {
    it('apply function on prop', () => {
      should.equal(Filtra({x: 0}).prop('x').apply(x => x + 1).filter().x, 1)
      should.equal(Filtra({x: 0}).prop('x').apply(() => 'constant').filter().x, 'constant')
    })
  })
  describe('.in (=.any)', () => {
    it('writes prop for prop in array of allowable values', () => {
      should.equal(Filtra({x: 4}).prop('x').in([4, 8]).filter().x, 4)
      should.equal(Filtra({x: 8}).prop('x').any([4, 8]).filter().x, 8)
    })
    it('or throws error', () => {
      ;(() => {
        Filtra({x: 'realybad'}).prop('x').in([4, 8])
      }).should.throw(Error)
    })
  })
  describe('.prop(key).require', () => {
    it('writes prop', () => {
      should.equal(Filtra({x: 4}).prop('x').require().filter().x, 4)
      should.equal(Filtra({}).prop('x', 4).require().filter().x, 4)
    })
    it('or throws error for undefined', () => {
      ;(() => {
        Filtra({}).prop('x').require().filter()
      }).should.throw(Error)
    })
    it('or throws error for defined undefined', () => {
      ;(() => {
        Filtra({x: undefined}).prop('x').require().filter()
      }).should.throw(Error)
    })
    it('or throws error for null', () => {
      ;(() => {
        Filtra({x: null}).prop('x').require().filter()
      }).should.throw(Error)
    })
  })
  describe('.require', () => {
    it('require value', () => {
      Filtra({x: 4}).require('x')
    })
    it('or throws error for undefined', () => {
      ;(() => {
        Filtra({}).require('x')
      }).should.throw(Error)
    })
    it('or throws error for defined undefined', () => {
      ;(() => {
        Filtra({x: undefined}).require('x')
      }).should.throw(Error)
    })
    it('or throws error for null', () => {
      ;(() => {
        Filtra({x: null}).require('x')
      }).should.throw(Error)
    })
  })
  describe('.rename(key)', () => {
    it('change property name', () => {
      should.equal(Filtra({x: 4}).prop('x').rename('y').filter().y, 4)
    })
    it('or throws for wrong new key', () => {
      ;(() => {
        Filtra({x: 4}).prop('x').rename(1)
      }).should.throw(Error)
      ;(() => {
        Filtra({x: 4}).prop('x').rename()
      }).should.throw(Error)
    })
  })
})
