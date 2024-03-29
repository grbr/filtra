// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'prod' ? 2 : 0,
    // allow throw an object
    'no-throw-literal': 0,
    'indent': ['error', 2, {
      'MemberExpression': 0
    }]
  }
}
