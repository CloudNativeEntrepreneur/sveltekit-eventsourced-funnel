/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'
import TestHarness from '../helpers/TestHarness.svelte'
import index from '$routes/index.svelte'

describe('routes/index.svelte', () => {

  it.only('should render in test harness', async () => {
    const { getByText } = render(TestHarness, { Component: index })
    expect(getByText('Lead magnet')).toBeInTheDocument()
  })
})
