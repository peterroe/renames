import debug from 'debug'

const tLog = debug('compiler:tokenize') // compiler:tokenize
const gLog = debug('compiler:generatetokenArrayMap') // compiler:generatetokenArrayMap
const pLog = debug('compiler:parse') // compiler:parse
const fLog = debug('compiler:fixGap') // compiler:fixGap
const sLog = debug('compiler:synthesize') // compiler:synthesize

interface MiddleType {
  index: number
  str: string
}

export class Compiler {
  constructor(beforePatten: string, afterPatten: string, targetStr: string) {
    this.beforePatten = beforePatten
    this.afterPatten = afterPatten
    this.targetStr = targetStr
    tLog('--- bofore tokenize start ---')
    this.beforeTokens = this.tokenize({ i: 0, str: beforePatten })
    tLog({ beforeTokens: this.beforeTokens })
    this.afterTokens = this.tokenize({ i: 0, str: afterPatten })
    tLog({ afterTokens: this.afterTokens })
    tLog('--- after tokenize end ---')
    this.fixGap()
    // this.tokenArrayMap = this.generatetokenArrayMap()
    this.syntaxArray = this.synthesize()
  }

  tokenize({ i, str }: MiddleType): array {
    const tokens = []
    const len = str.length
    while (i < len) {
      if (str[i] === '(') {
        const nextI = str.indexOf(')', i)
        const t = this.tokenize({
          i: 0,
          str: str.substring(i + 1, nextI),
        })
        tokens.push(t)
        i = nextI + 1
      }
      else if (/^\[\w-\w\]/.test(str.slice(i))) { // [a-z]
        const t = /^\[(\w-\w)\]/.exec(str)[1]
        tokens.push(t)
        i += 5
      }
      // else if (str[i] === '.') {
      //   tokens.push('.')
      //   i++
      // }
      else if (str[i] === '?') {
        tokens.push('?')
        i++
      }
      else if (str[i] === '*') {
        tokens.push('*')
        i++
      }
      else if (str[i] === '+') {
        tokens.push('+')
        i++
      }
      else if (str.slice(i).includes('(')) {
        const index = str.indexOf('(', i)
        tokens.push(str.substring(i, index))
        i = index
      }
      else {
        tokens.push(str.slice(i))
        break
      }
    }
    return tokens
  }

  generatetokenArrayMap() {
    const beforeTokens = this.beforeTokens
    const afterTokens = this.afterTokens
    const tokenArrayMap = []
    for (let i = 0; i < beforeTokens.length; i++) {
      const beforeToken = beforeTokens[i]
      const afterToken = afterTokens[i]
      gLog({ i, beforeToken, afterToken })
      if (Array.isArray(beforeToken)) {
        const map = []
        for (let j = 0; j < beforeToken.length; j++) {
          const b = beforeToken[j]
          const a = afterToken[j]
          map.push([b, a])
        }
        tokenArrayMap.push(map)
      }
      else { // string
        tokenArrayMap.push(new Map([[beforeToken, afterToken]]))
      }
    }
    return tokenArrayMap
  }

  fixGap() {
    fLog('--- fixGap start ---')
    const { beforeTokens, afterTokens } = this
    fLog({ beforeTokens, afterTokens })
    let i = 0
    while (i < beforeTokens.length) {
      const b = beforeTokens[i]
      const a = afterTokens[i]
      if (Array.isArray(a) && typeof b === 'string')
        afterTokens.splice(i, 0, '')

      else if (Array.isArray(b) && typeof a === 'string')
        beforeTokens.splice(i, 0, '')

      i++
    }
    this.beforeTokens = beforeTokens
    this.afterTokens = afterTokens
    fLog({ beforeTokens, afterTokens })
    fLog('--- fixGap end ---')
  }

  synthesize() {
    sLog('--- synthesize start ---')
    const targetStr = this.targetStr
    const beforeTokens = this.beforeTokens
    sLog({ beforeTokens: this.beforeTokens, afterTokens: this.afterTokens })
    const regStrArr = []
    for (let i = 0; i < beforeTokens.length; i++) {
      const beforeToken = beforeTokens[i]
      if (Array.isArray(beforeToken)) {
        const regStr = `([${beforeToken[0]}]${beforeToken[1] ? beforeToken[1] : ''})`
        regStrArr.push(regStr)
      }
      else {
        regStrArr.push(`(${beforeToken})`)
      }
    }
    const reg = new RegExp(regStrArr.join(''))
    const syntaxArray = reg.exec(targetStr)?.slice(1)
    sLog({ reg, syntaxArray, targetStr })
    sLog('--- synthesize end ---')
    return syntaxArray
  }

  parse() {
    const syntaxArray: Array<string> = this.syntaxArray
    if (!syntaxArray) // no match
      return
    const beforeTokens = this.beforeTokens
    const afterTokens: Array<string> = this.afterTokens
    pLog('--- parse start ---')
    pLog({ syntaxArray, beforeTokens, afterTokens })
    for (let i = 0; i < syntaxArray.length; i++) {
      const itemSyntax = syntaxArray[i]
      const itemToken = afterTokens[i]
      if (Array.isArray(itemToken)) { // plain
        const mode = itemToken[0]
        if (/[A-Z]-[A-Z]/.test(mode))
          syntaxArray[i] = syntaxArray[i].toUpperCase()

        else
          syntaxArray[i] = syntaxArray[i].toLowerCase()
      }
      else { // expression
        syntaxArray[i] = itemToken
      }
    }
    pLog({ syntaxArray })
    pLog('--- parse end ---')
    return syntaxArray.join('')
  }
}
// console.log(
//   new Compiler('([a-z]*)(_)test.js', '([A-Z]*)(.)test.js', 'hello_test.js'),
// )

// console.log(
//   new Compiler('([a-z]*)([A-Z])([a-z]*).js', '([a-z]*)-([a-z])([a-z]*).js', 'helloWord.js').parse(),
// )

// console.log(
//   new Compiler('([a-z]*)-([A-Z])([a-z]*).js', '([a-z]*)([a-z])([a-z]*).js', 'hello-Word.js').parse(),
// )

// ([a-z]*)(_)test.js
// [['a-z', '*'], ['_'], 'test.js']

// [a-z]*)(_)([a-z]*)_test.js', '([a-z]*)(.)([a-z]*)_test.js
// [['a-z', '*'], ['_'], ['a-z', '*'], '_test.js']
// [['a-z', '*'], ['.'], ['a-z', '*'], '_test.js']
