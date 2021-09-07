/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom/extend-expect'
 import { render } from '@testing-library/svelte'
 import TestHarness from '../helpers/TestHarness.svelte'
 import checkout from '$routes/checkout.svelte'
 
 describe('routes/checkout.svelte', () => {
 
   it.only('should render in test harness', async () => {
     const { getByText } = render(TestHarness, { Component: checkout })
     expect(getByText('Checkout')).toBeInTheDocument()
   })
 })
 