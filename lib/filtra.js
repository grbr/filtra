const moment = require('moment')

function Filtra (src) {
  if (!src) throw new FiltraError('empty body')
  return new FiltraChainLink(Object.assign({}, src), {})
}

function FiltraError (message) {
  this.name = 'FiltraError'
  this.message = (message || '')
  const error = new Error(this.message)
  error.name = this.name
  this.stack = error.stack
}
FiltraError.prototype = Object.create(Error.prototype)
Filtra.FiltraError = FiltraError

class FiltraChainLink {
  constructor (src, dst) {
    this.src = src
    this.dst = dst
  }
  filter () {
    return this.dst
  }
  require (key) {
    if (typeof this.src[key] === 'undefined' || this.src[key] === null) throw new FiltraError(`${key} required`)
    return this
  }
  delete (key) {
    delete this.dst[key]
    return this
  }
  prop (key, defaultValue) {
    return new Option(this.src, this.dst, key, defaultValue)
  }
  flag (key, defaultValue) {
    return new Flag(this.src, this.dst, key, defaultValue)
  }
  flagOpt (key, defaultValue) {
    return new FlagOption(this.src, this.dst, key, defaultValue)
  }
  str (key, defaultValue) {
    return new Str(this.src, this.dst, key, defaultValue)
  }
  strOpt (key, defaultValue) {
    return new StrOption(this.src, this.dst, key, defaultValue)
  }
  int (key, defaultValue) {
    return new Int(this.src, this.dst, key, defaultValue)
  }
  intOpt (key, defaultValue) {
    return new IntOption(this.src, this.dst, key, defaultValue)
  }
  num (key, defaultValue) {
    return new Num(this.src, this.dst, key, defaultValue)
  }
  numOpt (key, defaultValue) {
    return new NumOption(this.src, this.dst, key, defaultValue)
  }
  uuidV4 (key, defaultValue) {
    return new UuidV4(this.src, this.dst, key, defaultValue)
  }
  uuidV4Opt (key, defaultValue) {
    return new UuidV4Option(this.src, this.dst, key, defaultValue)
  }
  date (key, defaultValue) {
    return new FormattedDate(this.src, this.dst, key, defaultValue)
  }
  dateOpt (key, defaultValue) {
    return new FormattedDateOption(this.src, this.dst, key, defaultValue)
  }
}

class Option extends FiltraChainLink {
  constructor (src, dst, key, defaultValue) {
    super(src, dst)
    this.key = key
    // undefined => null
    this.defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue
    if (!this.src.hasOwnProperty(key) || typeof this.src[key] === 'undefined') {
      this.src[key] = null
    }
    this.dst[key] = this.src[key] === null ? this.defaultValue : this.src[key]
  }
  set (val) {
    this.dst[this.key] = val
    return this
  }
  get (val) {
    return this.dst[this.key]
  }
  apply (f) {
    const x = this.dst[this.key]
    if (x === null) return this
    this.dst[this.key] = f(x, this.dst)
    return this
  }
  check (predicate, message) {
    if (!predicate(this.get())) {
      const m = `${this.key} is incorrect` + message ? `: ${message}` : ''
      throw new FiltraError(m)
    }
    return this
  }
  any (allowable) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (!allowable.includes(x)) throw new FiltraError(`${this.key} not allowed`)
    return this
  }
  in (allowable) { return this.any(allowable) }
  require () {
    if (this.dst[this.key] === null) throw new FiltraError(`${this.key} required`)
    return this
  }
  rename (newKey) {
    if (!newKey || typeof newKey !== 'string') {
      throw new Error(`${this.key} can not rename to ${newKey}`)
    }
    const val = this.get()
    delete this.dst[this.key]
    this.key = newKey
    this.set(val)
    return this
  }
}

class FlagOption extends Option {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    switch (this.get()) {
    case null:
      break
    case true:
    case 'true':
    case 't':
    case 'yes':
      this.set(true)
      break
    case false:
    case 'false':
    case 'f':
    case 'no':
      this.set(false)
      break
    default:
      throw new FiltraError(`${key} is not a boolean`)
    }
  }
}

class Flag extends FlagOption {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.require()
  }
}

class StrOption extends Option {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    if (this.get() !== null) {
      if (typeof this.get() !== 'string') {
        throw new FiltraError(`${key} is not a string`)
      }
    }
  }
  notEmpty () {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x.length <= 0) throw new FiltraError(`${this.key} is empty`)
    return this
  }
  match (regExp) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (!regExp.test(x)) throw new FiltraError(`${this.key} is not match ${regExp.toString()}`)
    return this
  }
  min (minLength) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x.length < minLength) throw new FiltraError(`${this.key} length can't be less than ${minLength}`)
    return this
  }
  max (maxLength) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x.length > maxLength) throw new FiltraError(`${this.key} length can't be more than ${maxLength}`)
    return this
  }
  range (min, max) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x.length < min || x.length > max) {
      throw new FiltraError(`${this.key} length is not in the range[${min}, ${max}]`)
    }
    return this
  }
  toUpperCase () {
    const x = this.dst[this.key]
    if (x === null) return this
    this.dst[this.key] = x.toUpperCase()
    return this
  }
  toLowerCase () {
    const x = this.dst[this.key]
    if (x === null) return this
    this.dst[this.key] = x.toLowerCase()
    return this
  }
  trim () {
    const x = this.dst[this.key]
    if (x === null) return this
    this.dst[this.key] = x.trim()
    return this
  }
  trimDeep () {
    const x = this.dst[this.key]
    if (x === null) return this
    this.dst[this.key] = x.trim().replace(/\s+/g, ' ')
    return this
  }
}
class Str extends StrOption {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.require()
  }
}

const NUMBER_REGEX = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/
class NumOption extends Option {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    if (this.get() !== null) {
      if (typeof this.get() === 'string') {
        if (!NUMBER_REGEX.test(this.get())) {
          this.set(NaN)
        } else {
          this.set(Number(this.get()))
        }
      }
      if (typeof this.get() !== 'number' || Number.isNaN(this.get())) {
        throw new Error(`${key} is not a number`)
      }
    }
  }
  min (min) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x < min) throw new FiltraError(`${this.key} can't be less than ${min}`)
    return this
  }
  max (max) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x > max) throw new FiltraError(`${this.key} can't be more than ${max}`)
    return this
  }
  range (min, max) {
    const x = this.dst[this.key]
    if (x === null) return this
    if (x < min || x > max) {
      throw new FiltraError(`${this.key} is not in the range[${min}, ${max}]`)
    }
    return this
  }
  integer () {
    if (this.get() !== null) {
      if (!Number.isInteger(this.get())) {
        throw new Error(`${this.key} is not an integer`)
      }
    }
    return this
  }
}
class Num extends NumOption {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.require()
  }
}

class IntOption extends NumOption {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.integer()
  }
}
class Int extends IntOption {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.require()
  }
}

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
class UuidV4Option extends Option {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    if (this.get() !== null) {
      if (typeof this.get() !== 'string' || !UUID_V4_REGEX.test(this.get().toLowerCase())) {
        throw new Error(`${key} is not a valid uuidV4`)
      }
    }
    this.set(this.get().toLowerCase())
  }
}
class UuidV4 extends UuidV4Option {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.require()
  }
}

class FormattedDateOption extends Option {
  format (format) {
    let x = this.dst[this.key]
    if (x === null) return this
    this.format = format
    x = this.dst[this.key] = moment(x, format, true)
    if (!x.isValid()) throw new FiltraError(`${this.key} is not match ${format}`)
    return this
  }
  min (min) {
    if (typeof min === 'string') {
      min = moment(min, this.format)
    }
    const x = this.dst[this.key]
    if (x === null) return this
    if (min.isAfter(x)) throw new FiltraError(`${this.key} can't be earlier than ${min}`)
    return this
  }
  max (max) {
    if (typeof max === 'string') {
      max = moment(max, this.format)
    }
    const x = this.dst[this.key]
    if (x === null) return this
    if (x.isAfter(max)) throw new FiltraError(`${this.key} can't be later than ${max}`)
    return this
  }
  range (min, max) {
    if (typeof min === 'string') {
      min = moment(min, this.format)
    }
    if (typeof max === 'string') {
      max = moment(max, this.format)
    }
    const x = this.dst[this.key]
    if (x === null) return this
    if (min.isAfter(x) || x.isAfter(max)) {
      throw new FiltraError(`${this.key} is not in the range[${min}, ${max}]`)
    }
    return this
  }
  toString (FORMAT) {
    if (this.dst[this.key] === null) return this
    if (FORMAT) {
      this.dst[this.key] = this.dst[this.key].format(FORMAT)
    } else {
      this.dst[this.key] = this.dst[this.key].format(this.format)
    }
    return this
  }
}
class FormattedDate extends FormattedDateOption {
  constructor (src, dst, key, defaultValue) {
    super(src, dst, key, defaultValue)
    this.require()
  }
}

module.exports = Filtra
