import { browser } from '$app/env'
import { goto } from '$app/navigation'
import { Funnel } from '$lib/aggregates/Funnel'
import { funnelState } from '$lib/stores/funnelState'

const funnelLocalStorageKey = 'funnelState'
let localFunnelState

if (typeof localStorage !== 'undefined') {
  localFunnelState = JSON.parse(localStorage.getItem(funnelLocalStorageKey))
  console.log('Found local funnel state:', localFunnelState)
}
const funnel = new Funnel(localFunnelState)

let started = false

const steps = [
  {
    url: '/',
    name: 'Lead Magnet',
    onSubmit: (data) =>
      new Promise((resolve, reject) => {
        const { email } = data
        if (!email) reject(false)
        funnel.user = { email }

        resolve(funnel)
      })
  },
  {
    url: '/oto',
    name: 'One Time Offer',
    onSubmit: (data) =>
      new Promise((resolve, reject) => {
        const { oto } = data
        funnel.oto = oto

        if (!oto) funnel.skipToEnd = true
        resolve(funnel)
      })
  },
  {
    url: '/checkout',
    name: 'Checkout',
    onSubmit: (data) =>
      new Promise((resolve, reject) => {
        const { creditCard, orderBump } = data
        funnel.creditCard = creditCard
        funnel.orderBump = orderBump
        resolve(funnel)
      })
  },
  {
    url: '/upsell',
    name: 'Upsell',
    onSubmit: (data) =>
      new Promise((resolve, reject) => {
        const { upsell } = data
        funnel.upsell = upsell

        // skip downsell
        if (funnel.upsell) funnel.skipNextStep = true
        resolve(funnel)
      })
  },
  {
    url: '/downsell',
    name: 'Downsell',
    onSubmit: (data) =>
      new Promise((resolve, reject) => {
        const { downsell } = data
        funnel.downsell = downsell

        // skip checkout if they didnt buy
        if (!funnel.downsell) funnel.skipNextStep = true
        resolve(funnel)
      })
  },
  {
    url: '/thank-you',
    name: 'Thank You',
    onSubmit: () =>
      new Promise((resolve, reject) => {
        resolve(funnel)
      })
  }
]

const trimForLocalState = (funnel) => {
  const clone = Object.assign({}, funnel.snapshot())
  // steps have functions and will get recreated when funnel loads
  delete clone.steps
  // store functions
  delete clone.set
  delete clone.subscribe
  delete clone.update
  // frequently changing things that dont add much value, especially with hot code reloading
  // if there's a use case, feel free to enable!
  delete clone._eventsCount
  delete clone.snapshotVersion
  delete clone.timestamp
  delete clone.version

  return clone
}

const storeLocalState = (funnel) => {
  let snapshot = trimForLocalState(funnel)
  funnelState.set(snapshot)
}

const start = async () => {
  console.log('Starting!')
  started = true
  
  console.log('new funnel', funnel)

  await funnel.configureSteps(steps)

  // more granular events for analytics can all bubble up to this
  // more generic handler
  funnel.on('funnel.state.changed', (funnel) => {
    storeLocalState(funnel)
  })

  funnel.once('entered', async (funnel) => {
    console.log('Entered Funnel', funnel)
    funnel.emit('funnel.state.changed', funnel)
    
    const usersCurrentStepUrl = funnel.steps[funnel.currentStep].url
    const currentUrl = document.location.pathname
    if (usersCurrentStepUrl != currentUrl) {
      console.log(`The user's last completed step was ${usersCurrentStepUrl}. Redirecting...`)
      return await goto(funnel.steps[funnel.lastCompletedStep].url)
    }
    console.log('No redirect required.')
  })

  funnel.on('step.entered', (funnel) => {
    console.log(`Entered Funnel Step ${funnel.currentStep} - ${funnel.steps[funnel.currentStep].name}`, { funnel })
    funnel.emit('funnel.state.changed', funnel)
  })

  funnel.on('step.completed', async (funnel) => {
    console.log(`Completed Funnel Step ${funnel.lastCompletedStep}`, {
      funnel
    })
    funnel.emit('funnel.state.changed', funnel)
    await goto(funnel.steps[funnel.nextStep].url)
  })

  funnel.on('step.skipped', (funnel, step) => {
    console.log(`Skipped Funnel Step ${funnel.skippedStep}`, { step })
    storeLocalState(funnel)
  })

  funnel.on('exited', (funnel, step) => {
    console.log(`Exited Funnel at ${funnel.lastCompletedStep}`, { step })
    storeLocalState(funnel)
  })
}

if (browser) {
  start()
}

export { funnel }
