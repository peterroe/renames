import debug from 'debug'

const tLog = debug('compiler:tokenize') // compiler:tokenize
const pLog = debug('compiler:parse') // compiler:parse
const fLog = debug('compiler:fixGap') // compiler:fixGap
const sLog = debug('compiler:synthesize') // compiler:synthesize

interface MiddleType {
  i: number
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
    this.syntaxArray = this.synthesize()
  }

  tokenize({ i, str }: MiddleType): Array<Array<string> | string> {
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
      else if (/^\[\w-\w\]/.test(str.slice(i))) { // [a-z] [A-Z]
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

  /**
   * @description: Keep the same type of beforeToken[i] and afterToken[i]
   */
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

  /**
   * @description: syntax parse from beforeTokens
   */
  synthesize(): Array<string> {
    sLog('--- synthesize start ---')
    const { beforeTokens, afterTokens, targetStr } = this

    sLog({ beforeTokens, afterTokens })
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

  /**
   * @description: syntax parse from afterTokens
   */
  parse(): string {
    const syntaxArray: Array<string> = this.syntaxArray
    if (!syntaxArray) // no match
      return
    const beforeTokens: Array<string> = this.beforeTokens
    const afterTokens: Array<string> = this.afterTokens
    pLog('--- parse start ---')
    pLog({ syntaxArray, beforeTokens, afterTokens })
    const afterSyntaxArray = new Array(syntaxArray.length)
    for (let i = 0; i < syntaxArray.length; i++) {
      const itemToken = afterTokens[i]
      if (Array.isArray(itemToken)) { // plain
        const mode = itemToken[0] as string | undefined
        if (/[A-Z]-[A-Z]/.test(mode))
          afterSyntaxArray[i] = syntaxArray[i].toUpperCase()

        else if (/[a-z]-[a-z]/.test(mode))
          afterSyntaxArray[i] = syntaxArray[i].toLowerCase()

        else if (!mode)
          afterSyntaxArray[i] = ''
      }
      else { // expression
        afterSyntaxArray[i] = itemToken
      }
    }
    this.afterSyntaxArray = afterSyntaxArray
    pLog({ afterSyntaxArray })
    pLog('--- parse end ---')
    return afterSyntaxArray.join('')
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

console.log(
  new Compiler('([a-z]?)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'cHelloword.js').parse(),
)

// ([a-z]*)(_)test.js
// [['a-z', '*'], ['_'], 'test.js']

// [a-z]*)(_)([a-z]*)_test.js', '([a-z]*)(.)([a-z]*)_test.js
// [['a-z', '*'], ['_'], ['a-z', '*'], '_test.js']
// [['a-z', '*'], ['.'], ['a-z', '*'], '_test.js']
