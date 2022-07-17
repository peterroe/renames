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

interface optionType {
  dir: string
  write: boolean
}

function getParams() {
  const { args, options } = cli.parse()
  // get beforePatten and afterPatten
  const [beforePatten, afterPatten]: Array<string> = args
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
// tests.forEach((file) => {
//   if (file.includes('_test.js')) {
//     const newFile = file.replace('_test.js', '.test.js')
//     fs.renameSync(path.join(__dirname, file), path.join(__dirname, newFile))
//   }
// })

// renames "([a-z]*)(_)test.js" to "([a-z]*)(.)test.js" --dir ./src/
// hello_test.js => hello.test.js

// renames "([a-z]*).js" "([A-Z]*).js" --dir ./src/
// HelloWord.js => helloWord.js

// renames "([A-Z]*)([A-Z]*).js" "([A-Z]*)([A-Z]*).js" --dir ./src/
// HelloWorld.js => helloworld.js

// rename "(b*)(_a).js" "(B*)(A).js" --dir ./src/
// hello_word.js => helloWord.js
