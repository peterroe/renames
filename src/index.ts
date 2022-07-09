import { cac } from 'cac'
import pkg from '../package.json'
const cli = cac()

cli.option('--dir <dir>', 'target dir', {
  default: 'node',
})

cli.help()

cli.version(pkg.version)

const { args, options } = cli.parse()

const [before, after] = args
const { dir } = options

console.log(before, after, dir)

// renames "(a*)_test.js" to "(a*).test.js" --dir ./src/
// hello_test.js => hello.test.js

// renames "(A*).js" "(a*).js" --dir ./src/
// HelloWord.js => helloWord.js

// renames "(A*)(B*).js" "(a*)(B*).js" --dir ./src/
// HelloWorld.js => helloworld.js

// rename "(b*)(_a).js" "(B*)(A).js" --dir ./src/
// hello_word.js => helloWord.js
