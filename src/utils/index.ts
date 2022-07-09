function removeSameSuffix(a, b) {
  while (1) {
    if (a[a.length - 1] === ')' || b[b.length - 1] === ')')
      break
    if (a[a.length - 1] === b[b.length - 1]) {
      a = a.slice(0, -1)
      b = b.slice(0, -1)
    }
  }
  return [
    a, b,
  ]
}

export function rename(before, after, path, args) {
  const [a, b] = removeSameSuffix(before, after)
  const reg = new RegExp(a)
  const mode = b.split(/[(|)]/).filter(it => it.length).reduce((pre, cur, i) => {
    if (cur.includes('[a-z]'))
      return `${pre}$${i + 1}`
    else
      return `${pre}${cur}`
  }, '')
  console.log(reg, mode)
  // '([a-z]*)(.)'.split(/[(|)]/) => ['', '[a-z]*', '', '.', '']
  args.forEach((file) => {
    // if (file.includes('_test.js')) {
    const newFile = file.replace(reg, mode)
    console.log(newFile)
    // fs.renameSync(path.join(__dirname, file), path.join(__dirname, newFile))
    // }
  })
}

rename('([a-z]*)(_)test.js', '([a-z]*)(.)test.js', 'src', ['hello_test.js', 'tuck_test.js'])
rename('([a-z]*)(_)([a-z]*)(_)test.js', '([a-z]*)(.)([a-z]*)(.)test.js', 'src', ['hello_test_sdf.js', 'gf_tuck_test.js'])

// renames "([a-z]*)(_)test.js" to "([a-z]*)(.)test.js" --dir ./src/
// hello_test.js => hello.test.js

// renames "([a-z]*)(_)test.js" to "([a-z]*)test.js" --dir ./src/
// hello_test.js => hello.test.js

// renames "([a-z]*).js" "([A-Z]*).js" --dir ./src/
// HelloWord.js => helloWord.js

// renames "([A-Z]*)([A-Z]*).js" "([A-Z]*)([A-Z]*).js" --dir ./src/
// HelloWorld.js => helloworld.js
