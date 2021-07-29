import { writable } from 'svelte/store'
import { browser } from '$app/env'

const funnelLocalStorageKey = 'funnelState'

let initialSubscribe = true
export const funnelState = writable({})

if (browser) {
  funnelState.subscribe((value) => {
    if (initialSubscribe) {
      console.log('funnelState subscription started')
      initialSubscribe = false
    } else {
      console.log('funnel state changed', value)
      if (typeof localStorage !== 'undefined') {
        console.log(
          'updating local storage',
          funnelLocalStorageKey,
          JSON.stringify(value)
        )
        localStorage.setItem(funnelLocalStorageKey, JSON.stringify(value))
      }
    }
  })
}
