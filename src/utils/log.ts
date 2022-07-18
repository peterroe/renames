import chalk from 'chalk'

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
    before = before.padEnd(maxNameLen, ' ')
    console.log(`${chalk.red(before)} => ${chalk.green(after)}`)
  })
}
