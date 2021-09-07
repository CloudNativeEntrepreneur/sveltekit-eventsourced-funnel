import { expect, it, describe, beforeEach, jest } from '@jest/globals'
import { funnelRepository } from '$lib/repositories/funnelRepository.js'

// const steps defined below tests - looked too messy at the top

describe('Funnel Repository', () => {
  it('should be a singleton of initialized repo', () => {
    expect(funnelRepository.get).toBeDefined()
    expect(funnelRepository.commit).toBeDefined()
  })
})
