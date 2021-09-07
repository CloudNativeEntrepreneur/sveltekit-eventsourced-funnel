/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom/extend-expect'
 import { render } from '@testing-library/svelte'
 import TestHarness from '../helpers/TestHarness.svelte'
 import upsell from '$routes/upsell.svelte'
 
 describe('routes/upsell.svelte', () => {
 
   it.only('should render in test harness', async () => {
     const { getByText } = render(TestHarness, { Component: upsell })
     expect(getByText('Upsell')).toBeInTheDocument()
   })
 })
 