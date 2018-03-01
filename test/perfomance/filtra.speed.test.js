let chai = require('chai')
should = chai.should()

const Filtra = require('../../')


describe('speed rate test es6 version', () => {
  for (let i of '12345') {
    it(i + ': 10K requests with 6 keys and 29 filters must be faster than 500ms (on my pc)', () => {
      const start = new Date()
      for (let i = 0; i < 10000; i++) {
        should.equal(
          Filtra({
            x0: 'good',
            x1: null,
            x2: 1231245,
            x3: -.543,
            x4: 1231245,
            x5: -.543
          })
          .strOpt('x0').match(/^good$/).notEmpty().min(4).max(5).range(4, 5).in(['good', 'good too'])
          .str('x1', 'good').match(/^good$/).notEmpty().min(4).max(5).range(4, 5).in(['good', 'good too'])
          .int('x2').min(4).max(9999999).range(4, 9999999999).in([1231245, 3, 2, 4, 5 ,90, -1])
          .num('x3').min(-1).max(9999999).range(-1, 9999999999).in([1231245, 3, 2, 4, 5 ,90, -1, -0.543])
          .int('x4').min(4).max(9999999).range(4, 9999999999).in([1231245, 3, 2, 4, 5 ,90, -1])
          .num('x5').min(-1).max(9999999).range(-1, 9999999999).in([1231245, 3, 2, 4, 5 ,90, -1, -0.543])
          .filter()
          .x1,
          'good'
        )
      }
      (new Date() - start).should.be.below(500)
    })
  }
})
