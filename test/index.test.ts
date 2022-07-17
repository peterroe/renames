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
})
