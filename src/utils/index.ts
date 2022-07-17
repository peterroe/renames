import fs from 'fs'
import path from 'path'

/**
 * @description: get Prefix
 * @param {*} a
 * @param {*} b
 * @example: removeSameSuffix('hello.js', 'ko.js') => ['hell', 'k']
 */
function removeSameSuffix(a, b) {
  while (a.length > 0 && b.length > 0) {
    if (a[a.length - 1] === ')' || b[b.length - 1] === ')')
      break
    if (a[a.length - 1] === b[b.length - 1]) {
      a = a.slice(0, -1)
      b = b.slice(0, -1)
    }
    else {
      break
    }
  }
  return [
    a, b,
  ]
}

/**
 * @description: get Suffix
 * @param {string} str target string
 * @example: getSuffix('([a-z])c.sd.js') => 'c.sd.js'
 */
function getSuffix(str: string): string {
  const i = str.lastIndexOf(')')
  if (i === -1)
    return ''
  return str.slice(i + 1)
}

const patten = ['[a-z]', '[A-Z]']

/**
 * @description: rename core
 * @param {string} before before pattern
 * @param {string} after after pattern
 * @param {Array} args files list
 */

let restSuffix: string

export function rename(before: string, after: string, args: Array<string>): Array<Array<string>> {
  const [a, b] = removeSameSuffix(before, after)
  const reg = new RegExp(a)

  const arrayA = a.split(/[()]/).filter(it => it.length)
  const arrayB = b.split(/[()]/).filter(it => it.length) // [ '', '[a-z]*', '', '[a-z]', '', '[a-z]*', '.j' ]
  console.log({ arrayB, arrayA })
  restSuffix = arrayB[arrayB.length - 1]

  const mode = arrayB.reduce((pre, cur, i) => {
    if (patten.some(it => cur.includes(it)))
      return `${pre}$${i + 1}`
    else
      return `${pre}${cur}`
  }, '')
  // '([a-z]*)(.)'.split(/[(|)]/) =>['', '[a-z]*', '', '.', '']
  const suffix = getSuffix(before)
  console.log({ reg, mode, suffix })
  // return
  const res = []
  args.forEach((file) => {
    if (file.includes(suffix)) {
      console.log(reg, mode)
      const newFile = file.replace(reg, mode)
      console.log({ newFile })
      console.log(file.replace(reg, (match, ...rest) => {
        console.log({ match, rest, restSuffix })
        return rest.slice(0, -2).join('') + restSuffix
      }))

      if (newFile !== file) // if names are different
        res.push([file, newFile])
      // fs.renameSync(path.join(dir, file), path.join(dir, newFile))
    }
  })
  return res
}

/**
 * @description: rename file
 * @param {*} nameMap
 * @param {*} dir
 */
export function renameFile(nameMap, dir) {
  nameMap.forEach(([oldFileName, newFileName]) => {
    fs.renameSync(path.join(dir, oldFileName), path.join(dir, newFileName))
  })
}

export * from './log'
export * from './v2'
// rename('([a-z]*)(_)test.js', '([a-z]*)(.)test.js', ['hello_test.js', 'tuck_test.js'])
// rename('([a-z]*)(_)([a-z]*)(_)test.js', '([a-z]*)(.)([a-z]*)(.)test.js', ['hello_test_sdf.js', 'gf_tuck_test.js'])

// renames "([a-z]*)(_)test.js" to "([a-z]*)(.)test.js" --dir ./src/
// hello_test.js => hello.test.js

// renames "([a-z]*)(_)test.js" to "([a-z]*)test.js" --dir ./src/
// hello_test.js => hello.test.js

// renames "([a-z]*).js" "([A-Z]*).js" --dir ./src/
// HelloWord.js => helloWord.js

// renames "([A-Z]*)([A-Z]*).js" "([A-Z]*)([A-Z]*).js" --dir ./src/
// HelloWorld.js => helloworld.js
