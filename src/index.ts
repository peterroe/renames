import fs from 'fs'
import { cac } from 'cac'
import pkg from '../package.json'
import { logDiff, rename, renameFile } from './utils/index'
const cli = cac()

cli.option('--dir <dir>', 'target dir', {
  default: 'node',
})

cli.help()

cli.version(pkg.version)

interface optionType { [k: string]: any }

function getParams() {
  const { args, options } = cli.parse()
  // get beforePatten and afterPatten
  const [beforePatten, afterPatten] = args
  // get target dir
  const { dir, write }: optionType = options

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
  const nameMap = rename(beforePatten, afterPatten, files)
  if (!write)
    logDiff(nameMap)

  else
    renameFile(nameMap, dir)
}

main()
