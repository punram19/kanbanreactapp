import { describe, it, expect } from 'vitest'

describe('sample tests', () => {
  it('adds numbers', () => {
    expect(1 + 1).toBe(2)
  })

  it('string contains substring', () => {
    expect('kanban').toContain('ban')
  })
})
