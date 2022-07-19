import fs from 'fs'
import { cac } from 'cac'
import pkg from '../package.json'
import { logDiff, rename, renameFile } from './utils/index'
const cli = cac()

cli.option('--dir <dir>', 'target dir', {
  default: './',
})

cli.option('--write', 'write to file')

cli.help()

cli.usage('<beforePatten> <afterPatten> --dir <dir>')

cli.version(pkg.version)

interface optionType { [k: string]: any }

function getParams() {
  const { args, options } = cli.parse()
  // get beforePatten and afterPatten
  const [beforePatten, afterPatten] = args as [string, string]
  // get target dir
  const { dir, write }: optionType = options
  if (!dir || !beforePatten || !afterPatten)
    process.exit(1)

  // get all files list
  const files: Array<string> = fs.readdirSync(dir)

  return {
    beforePatten,
    afterPatten,
    files,
    dir,
    write,
  }
}

function main() {
  const {
    beforePatten,
    afterPatten,
    files,
    dir,
    write,
  } = getParams()
  const nameMap: Array<[string, string]> = rename(beforePatten, afterPatten, files)
  if (!write as boolean)
    logDiff(nameMap)

  else
    renameFile(nameMap, dir)
}

main()
