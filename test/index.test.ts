import { describe, expect, it } from 'vitest'
import { Compiler } from '../src/utils/compiler'
describe('Test', () => {
  it('Test Compiler', () => {
    expect(
      new Compiler('([a-z]*)_test.js', '([a-z]*).test.js', 'hello_test.js')
        .parse(),
    ).toMatchInlineSnapshot('"hello.test.js"')
    expect(
      new Compiler('([a-z]*)_([a-z]*)_test.js', '([a-z]*).([a-z]*)_test.js', 'hello_test_test.js')
        .parse(),
    ).toMatchInlineSnapshot('"hello.test_test.js"')
    expect(
      new Compiler('([a-z]*).test.js', '([A-Z]*)_test.js', 'hello.test.js')
        .parse(),
    ).toMatchInlineSnapshot('"HELLO_test.js"')
    expect(
      new Compiler('([a-z])([a-z]*).test.js', '([A-Z])([a-z]*)_test.js', 'hello.test.js')
        .parse(),
    ).toMatchInlineSnapshot('"Hello_test.js"')
    expect(
      new Compiler('([a-z]*)([A-Z])([a-z]*).js', '([a-z]*)-([a-z])([a-z]*).js', 'helloWord.js')
        .parse(),
    ).toMatchInlineSnapshot('"hello-word.js"')
  })
  //   expect(rename('([a-z]*)(_)([a-z]*)_test.js', '([a-z]*)(.)([a-z]*)_test.js', ['hello_test_sdf.js', 'gf_tuck_test.js'])).toMatchInlineSnapshot(`
  //     [
  //       [
  //         "gf_tuck_test.js",
  //         "gf.tuck_test.js",
  //       ],
  //     ]
  //   `)
  //   expect(rename('(\w*)(_)([a-z]*)_test.js', '([a-z]*)(.)([a-z]*)_test.js', ['hello_test_sdf.js', 'gf_tuck_test.js'])).toMatchInlineSnapshot(`
  //     [
  //       [
  //         "gf_tuck_test.js",
  //         "gf.tuck_test.js",
  //       ],
  //     ]
  //   `)
  // })

  // it('. to _', () => {
  //   expect(rename('([a-z]*)(.)test.js', '([a-z]*)(_)test.js', ['hello.test.js'])).toMatchInlineSnapshot(`
  //     [
  //       [
  //         "hello.test.js",
  //         "hello_test.js",
  //       ],
  //     ]
  //   `)
  // })

  // it('mutiple: _ to .', () => {
  //   expect(rename('([a-z]*)(_)([a-z]*)(_)test.js', '([a-z]*)(.)([a-z]*)(.)test.js', ['hello_test_sdf.js', 'gf_tuck_test.js'])).toMatchInlineSnapshot(`
  //     [
  //       [
  //         "gf_tuck_test.js",
  //         "gf.tuck.test.js",
  //       ],
  //     ]
  //   `)
  // })
})

// renames "([a-z])_test.js" to "(a*).test.js" --dir ./src/
// hello_test.js => hello.test.js

// describe('plain', () => {
//   it('should work', () => {
//     expect(rename('(hello_test.js', 'test.js', ['hello_test.js'])).toMatchInlineSnapshot()
//   })
// })

