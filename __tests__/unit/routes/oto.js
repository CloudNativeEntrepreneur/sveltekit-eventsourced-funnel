/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom/extend-expect'
 import { render } from '@testing-library/svelte'
 import TestHarness from '../helpers/TestHarness.svelte'
 import oto from '$routes/oto.svelte'
 
 describe('routes/oto.svelte', () => {
 
   it.only('should render in test harness', async () => {
     const { getByText } = render(TestHarness, { Component: oto })
     expect(getByText('One time offer!')).toBeInTheDocument()
   })
 })
 