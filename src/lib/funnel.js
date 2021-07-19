import { goto } from '$app/navigation'
import { Funnel } from "$lib/aggregates/Funnel"
import { funnelState } from "$lib/stores/funnelState"

const funnel = new Funnel()
console.log('new funnel', funnel)

funnel.addStep({
  url: '/',
  action: (data) => new Promise((resolve, reject) => {
    const { email } = data
    console.log('step one', email)
    funnel.user = { email }
    resolve(funnel)
  })
})

funnel.addStep({
  url: '/upsell',
  action: (data) => new Promise((resolve, reject) => {
    const { upsell } = data
    funnel.upsell = upsell

    // skip downsell
    if (funnel.upsell) funnel.skipNextStep = true
    resolve(funnel)
  })
})

funnel.addStep({
  url: '/downsell',
  action: (data) => new Promise((resolve, reject) => {
    const { downsell } = data
    funnel.downsell = downsell

    // skip checkout if they didnt buy
    if (! funnel.downsell) funnel.skipNextStep = true
    resolve(funnel)
  })
})

funnel.addStep({
  url: '/checkout',
  action: (data) => new Promise((resolve, reject) => {
    const { creditCard, orderBump } = data
    funnel.creditCard = creditCard
    funnel.orderBump = orderBump
    resolve(funnel)
  })
})

funnel.addStep({
  url: '/thank-you',
  action: () => new Promise((resolve, reject) => {
    resolve(funnel)
  })
})

funnel.on('entered', (funnel) => {
  console.log(`Entered Funnel Step ${funnel.currentStep}`, { funnel })
})

funnel.on('step.completed', (funnel) => {
  console.log(`Completed Funnel Step ${funnel.lastCompletedStep}`, { funnel })
  funnelState.set(funnel)
  goto(funnel.steps[funnel.nextStep].url)
})

funnel.on('step.skipped', (funnel, step) => {
  console.log(`Skipped Funnel Step ${funnel.skippedStep}`, { step })
})

export {
  funnel
}