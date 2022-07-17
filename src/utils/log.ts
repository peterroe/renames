import chalk from 'chalk'

/**
 * @description: pading space
 * @param {number} len
 * @param {string} str
 */
function format(len: number, str: string) {
  return `${str}${' '.repeat(len - str.length)}`
}

/**
 * @description: log the change of file name
 * @param {Array} nameMap
 */
export function logDiff(nameMap: Array<[string, string]>) {
  // get max length of before name
  const maxNameLen = nameMap.reduce((pre, cur) => {
    return Math.max(pre, cur[0].length)
  }, 0)

  nameMap.forEach(([before, after]) => {
    before = format(maxNameLen, before)

    console.log(`${chalk.red(before)} => ${chalk.green(after)}`)
  })
}
