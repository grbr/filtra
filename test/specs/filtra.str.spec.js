let chai = require('chai')
should = chai.should()

const Filtra = require('../../')

describe('.str', () => {
  describe('.str(key)', () => {
    it('throws error for not existing', () => {
      ;(() => {
        Filtra({}).str('x')
      }).should.throw(Error)
    })
    it('throws error for undefined', () => {
      ;(() => {
        Filtra({x: undefined}).str('x')
      }).should.throw(Error)
    })
    it('throws error for null', () => {
      ;(() => {
        Filtra({x: null}).str('x')
      }).should.throw(Error)
    })
    it('returns string for valid', () => {
      Filtra({x: 'some'}).str('x').filter().x.should.equal('some')
    })
    it('returns empty string for empty string', () => {
      Filtra({x: ''}).str('x').filter().x.should.equal('')
    })
    it('not accepts objects', () => {
      ;(() => {
        Filtra({x: {}}).str('x')
      }).should.throw(Error)
    })
    it('not accepts numbers', () => {
      ;(() => {
        Filtra({x: 0}).str('x')
      }).should.throw(Error)
    })
    it('not accepts arrays', () => {
      ;(() => {
        Filtra({x: [1, 2, 3]}).str('x')
      }).should.throw(Error)
    })
  })
  describe('.str(key, default)', () => {
    it('writes default for not existing', () => {
      should.equal(Filtra({}).str('x', 'default').filter().x, 'default')
    })
    it('throws error for default null', () => {
      ;(() => {
        Filtra({}).str('x', null)
      }).should.throw(Error)
    })
    it('writes default for undefined', () => {
      should.equal(Filtra({x: undefined}).str('x', 'default').filter().x, 'default')
    })
    it('writes default for null', () => {
      should.equal(Filtra({x: null}).str('x', 'default').filter().x, 'default')
    })
    it('writes string for valid', () => {
      should.equal(Filtra({x: 'some'}).str('x', 'default').filter().x, 'some')
    })
    it('writes empty string for empty string', () => {
      should.equal(Filtra({x: ''}).str('x', 'default').filter().x, '')
    })
  })
  describe('.notEmpty()', () => {
    it('writes string for proper string', () => {
      should.equal(Filtra({x: 'good'}).str('x').notEmpty().filter().x, 'good')
    })
    it('throws error for empty srting', () => {
      ;(() => {
        Filtra({x: ''}).str('x').notEmpty()
      }).should.throw(Error)
    })
  })
  describe('.match(regex)', () => {
    it('writes string for proper string', () => {
      should.equal(Filtra({x: 'good'}).str('x').match(/^good$/).filter().x, 'good')
    })
    it('throws error for bad srting', () => {
      ;(() => {
        Filtra({x: 'bad'}).str('x').match(/^good$/).filter().x
      }).should.throw(Error)
    })
  })
  describe('.min(minLength)', () => {
    it('writes string for proper string', () => {
      should.equal(Filtra({x: 'good'}).str('x').min(4).filter().x, 'good')
      should.equal(Filtra({x: 'goodtoo'}).str('x').min(4).filter().x, 'goodtoo')
    })
    it('or throws error for length < min', () => {
      ;(() => {
        Filtra({x: 'bad'}).str('x').min(4)
      }).should.throw(Error)
    })
  })
  describe('.max(maxLength)', () => {
    it('writes string for proper string', () => {
      should.equal(Filtra({x: 'good'}).str('x').max(7).filter().x, 'good')
      should.equal(Filtra({x: 'goodtoo'}).str('x').max(7).filter().x, 'goodtoo')
    })
    it('or throws error for length > max', () => {
      ;(() => {
        Filtra({x: 'realybad'}).str('x').max(7)
      }).should.throw(Error)
    })
  })
  describe('.range(min, max)', () => {
    it('writes string for proper string with length in range', () => {
      should.equal(Filtra({x: 'good'}).str('x').range(4, 7).filter().x, 'good')
      should.equal(Filtra({x: 'goodtoo'}).str('x').range(4, 7).filter().x, 'goodtoo')
    })
    it('or throws error', () => {
      ;(() => {
        Filtra({x: 'realybad'}).str('x').range(4, 7)
      }).should.throw(Error)
    })
  })
  describe('.toUpperCase()', () => {
    it('writes string as STRING', () => {
      should.equal(Filtra({x: 'good'}).str('x').toUpperCase().filter().x, 'GOOD')
    })
  })
  describe('.toLowerCase()', () => {
    it('writes StrING as string', () => {
      should.equal(Filtra({x: 'GOOD'}).str('x').toLowerCase().filter().x, 'good')
    })
  })
  describe('.trim()', () => {
    it('writes trimmed string', () => {
      should.equal(Filtra({x: '  trim me   '}).str('x').trim().filter().x, 'trim me')
    })
  })
  describe('.trimDeep()', () => {
    it('writes trimmed string', () => {
      should.equal(Filtra({x: '  trim  \n me\tplease!\r'}).str('x').trimDeep().filter().x, 'trim me please!')
    })
  })
})
