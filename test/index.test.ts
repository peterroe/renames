import { describe, expect, it } from 'vitest'
import { rename } from '../src/utils/index'
describe('test', () => {
  it('should workd', () => {
    expect(rename)
})

// renames "(a*)_test.js" to "(a*).test.js" --dir ./src/
// hello_test.js => hello.test.js