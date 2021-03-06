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

  it('Test Compiler with ?', () => {
    expect(
      new Compiler('([a-z]?)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'cHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('"Helloword.js"')
    expect(
      new Compiler('([a-z]?)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'Helloword.js')
        .parse(),
    ).toMatchInlineSnapshot('"Helloword.js"')
  })

  it('Test Compiler with +', () => {
    expect(
      new Compiler('([a-z]+)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'abHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('"Helloword.js"')
    expect(
      new Compiler('([a-z]+)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'aHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('"Helloword.js"')
  })

  it('Test Compiler with letter', () => {
    expect(
      new Compiler('([e-g]+)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'aHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('undefined')
    expect(
      new Compiler('([e-g]+)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'fHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('"Helloword.js"')
  })

  it('Test Compiler with []', () => {
    expect(
      new Compiler('([wI]+)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'qHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('undefined')
  })

  it('Test Compiler with []', () => {
    expect(
      new Compiler('([wI]+)([A-Z])([a-z]*).js', '()([A-Z])([a-z]*).js', 'IHelloword.js')
        .parse(),
    ).toMatchInlineSnapshot('"Helloword.js"')
  })
})
