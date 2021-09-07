/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'
import TestHarness from '../helpers/TestHarness.svelte'
import thankyou from '$routes/thank-you.svelte'

describe('routes/thankyou.svelte', () => {
  it.only('should render in test harness', async () => {
    const { getByText } = render(TestHarness, { Component: thankyou })
    expect(getByText('Thanks!')).toBeInTheDocument()
  })
})
