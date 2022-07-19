import { Compiler } from './compiler'

export function rename(beforePatten: string, afterPatten: string, files: Array<string>): Array<[string, string]> {
  const result = []
  files.forEach((file) => {
    const afterName: string = new Compiler(beforePatten, afterPatten, file).parse()
    if (afterName)
      result.push([file, afterName])
  })
  return result
}
