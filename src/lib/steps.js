import { Value } from 'sourced'

// declared backwards so they can reference eachother
const thankyou = Value({
  url: '/thank-you',
  name: 'Thank You'
})

const downsell = Value({
  url: '/downsell',
  name: 'Downsell',
  nextStepYes: thankyou.url,
  nextStepNo: thankyou.url
})

const upsell = Value({
  url: '/upsell',
  name: 'Upsell',
  nextStepYes: thankyou.url,
  nextStepNo: downsell.url
})

const checkout = Value({
  url: '/checkout',
  name: 'Checkout',
  nextStep: upsell.url
})

const oto = Value({
  url: '/oto',
  name: 'One Time Offer',
  nextStepYes: checkout.url,
  nextStepNo: thankyou.url
})

const leadMagnet = Value({
  url: '/',
  name: 'Lead Magnet',
  nextStep: oto.url
})

export const steps = [leadMagnet, oto, checkout, upsell, downsell, thankyou]
