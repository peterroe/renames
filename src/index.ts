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

const { args, options } = cli.parse()

// get raw, target, dir
const [raw, target] = args
const { dir, write } = options

console.log(raw, target, dir, write)

// get files list
const files = fs.readdirSync(dir)

const nameMap = rename(raw, target, files)

if (!write)
  logDiff(nameMap)

else
  renameFile(nameMap, dir)

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
