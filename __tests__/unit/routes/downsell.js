/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom/extend-expect'
 import { render } from '@testing-library/svelte'
 import TestHarness from '../helpers/TestHarness.svelte'
 import downsell from '$routes/downsell.svelte'
 
 describe('routes/downsell.svelte', () => {
 
   it.only('should render in test harness', async () => {
     const { getByText } = render(TestHarness, { Component: downsell })
     expect(getByText('Downsell')).toBeInTheDocument()
   })
 })
 