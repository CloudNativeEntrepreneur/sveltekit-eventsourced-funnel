/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'
import upsell from '$routes/upsell.svelte'

jest.mock('$app/env.js', () => ({
  amp: false,
  browser: true,
  dev: true,
  mode: 'test'
}))

jest.mock('$app/navigation.js', () => ({
  goto: jest.fn()
}))

jest.mock('svelte', () => {
  const { writable } = require('svelte/store')
  const actualSvelte = jest.requireActual('svelte')
  const fakeGetContext = jest.fn((name) => {
    if (name === '__svelte__') {
      return fakeSvelteKitContext
    }
  })
  const fakeSvelteKitContext = {
    page: writable({
      path: '/upsell'
    }),
    navigating: writable(false)
  }

  const mockedSvelteKit = {
    ...actualSvelte,
    getContext: fakeGetContext
  }
  return mockedSvelteKit
})

describe('routes/upsell.svelte', () => {
  it('should compile', async () => {
    const { getByText } = render(upsell)
    expect(getByText('Upsell')).toBeInTheDocument()
  })
})
