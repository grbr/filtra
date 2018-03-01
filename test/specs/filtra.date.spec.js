let chai = require('chai')
should = chai.should()

const Filtra = require('../../')
const moment = require('moment')
const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'
const FORMAT2 = 'DD.MM.YY'

describe('.date', () => {
  describe('.date(key).format(FORMAT)', () => {
    it('writes moment date', () => {
      const dateF = moment().format(FORMAT)
      should.equal(Filtra({x: dateF}).date('x').format(FORMAT).filter().x.constructor.name, 'Moment')
    })
  })
  describe('.format(FORMAT).toString()', () => {
    it('writes formatted date', () => {
      const dateF = moment().format(FORMAT)
      should.equal(Filtra({x: dateF}).date('x').format(FORMAT).toString().filter().x, dateF)
    })
  })
  describe('.format(FORMAT).toString(FORMAT2)', () => {
    it('writes converted to FORMAT2 date', () => {
      const date = moment()
      const dateF = date.format(FORMAT)
      const dateF2 = date.format(FORMAT2)
      should.equal(Filtra({x: dateF}).date('x').format(FORMAT).toString(FORMAT2).filter().x, dateF2)
    })
  })

  const earlier = moment('2018-02-01').format(FORMAT)
  const min = moment('2018-02-26')
  const good = moment('2018-02-27').format(FORMAT)
  const max = moment('2018-02-28')
  const after = moment('2018-03-01').format(FORMAT)
  describe('.min(momentDate)', () => {
    it('writes date', () => {
      should.equal(Filtra({x: good}).date('x').format(FORMAT).min(min).toString().filter().x, good)
    })
    it('or throws error if earlier', () => {
      ;(() => {
        Filtra({x: earlier}).date('x').format(FORMAT).min(min)
      }).should.throw(Error)
    })
  })
  describe('.max(momentDate)', () => {
    it('writes date', () => {
      should.equal(Filtra({x: good}).date('x').format(FORMAT).max(max).toString().filter().x, good)
    })
    it('or throws error if later', () => {
      ;(() => {
        Filtra({x: later}).date('x').format(FORMAT).max(max)
      }).should.throw(Error)
    })
  })
  describe('.range(momentDate)', () => {
    it('writes date', () => {
      should.equal(Filtra({x: good}).date('x').format(FORMAT).range(min, max).toString().filter().x, good)
    })
    it('or throws error if earlier', () => {
      ;(() => {
        Filtra({x: earlier}).date('x').format(FORMAT).range(min, max)
      }).should.throw(Error)
    })
    it('or throws error if later', () => {
      ;(() => {
        Filtra({x: later}).date('x').format(FORMAT).range(min, max)
      }).should.throw(Error)
    })
  })
})
