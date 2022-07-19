import { Compiler } from './compiler'

/**
 * @description: core of remane function
 * @param {string} beforePatten before pattern
 * @param {string} afterPatten after pattern
 * @param {Array} files files list
 */
export function rename(beforePatten: string, afterPatten: string, files: Array<string>): Array<[string, string]> {
  const result = []
  files.forEach((file) => {
    const afterName: string = new Compiler(beforePatten, afterPatten, file).parse()
    if (afterName)
      result.push([file, afterName])
  })
  return result
}
