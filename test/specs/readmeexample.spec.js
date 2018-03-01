let chai = require('chai')
should = chai.should()
const Filtra = require('../..')
const moment = require('moment')
describe('readme example', () => {
  it ('executes', () => {

    const request = {
      ownerid: 1,
      name: '  Gizmo ',
      weight: '.72',
      commentary: '  Don’t get him wet, \n\r  keep him out of bright light,   and\t never feed him after midnight   ',
      registered: '3/1/18',
      externalid: '416ac246-e7ac-49ff-93b4-f7e94d997e6b',
      price: '9.99',
      priceunit: 'USD',
      garbageProperty1: 'dq2dq2da2dre2e',
      garbageProperty2: {
        a: 'dasd'
      }
    }

    try {
      const data =
      Filtra(request)
      .int('ownerid').min(1).rename('owner_id')
      .str('name').trim().range(3, 100).toLowerCase().match(/^[a-z]+$/).rename('pet_name')
      .num('weight').min(0)
      .str('weightunit', 'kg').toLowerCase().any(['kg', 'g', 'oz', 'lb', 'cwt']).rename('weight_unit')
      .strOpt('commentary').trimDeep()
      .date('registered', '1/1/18').format('M/D/YY').range('1/1/18', moment()).toString('YYYY-MM-DD')
      .uuidV4('externalid').rename('external_id')
      .str('priceunit').any(['USD', 'CENT']).rename('price_unit')
      .num('price').min(0).apply((price, props) => {
        if (props.price_unit === 'USD') {
          props.price_unit = 'CENT'
          return price * 100
        }
      }).integer().rename('price_cents')
      .delete('price_unit')
      .flag('iscat', false).rename('is_cat')
      .filter()

      console.log(data)
      /* prints
      { owner_id: 1,
        pet_name: 'gizmo',
        weight: 0.72,
        weight_unit: 'kg',
        commentary: 'Don’t get him wet, keep him out of bright light, and never feed him after midnight',
        registered: '2018-03-01',
        external_id: '416ac246-e7ac-49ff-93b4-f7e94d997e6b',
        price_cents: 999,
        is_cat: false }
      */

    } catch (error) {
      console.log('what\'s wrong:', error.message)
      throw error
    }

    try {
      Filtra(request)
      .int('ownerid').min(100)
    } catch (error) {
      console.log('what\'s wrong:', error.message)
      /* prints
        what's wrong: ownerid can't be less than 100
      */
    }
  })
})
