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
export * from './rename'
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
