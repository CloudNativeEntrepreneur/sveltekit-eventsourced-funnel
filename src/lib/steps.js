import { ValueObject } from "./eventsourcing/sourced"

// declared backwards so they can reference eachother
const thankyou = ValueObject({
  url: '/thank-you',
  name: 'Thank You'
})

const downsell = ValueObject({
  url: '/downsell',
  name: 'Downsell',
  nextStepYes: thankyou.url,
  nextStepNo: thankyou.url
})

const upsell = ValueObject({
  url: '/upsell',
  name: 'Upsell',
  nextStepYes: thankyou.url,
  nextStepNo: downsell.url
})

const checkout = ValueObject({
  url: '/checkout',
  name: 'Checkout',
  nextStep: upsell.url
})

const oto = ValueObject({
  url: '/oto',
  name: 'One Time Offer',
  nextStepYes: checkout.url,
  nextStepNo: thankyou.url
})

const leadMagnet = ValueObject({
  url: '/',
  name: 'Lead Magnet',
  nextStep: oto.url
})

export const steps = [leadMagnet, oto, checkout, upsell, downsell, thankyou]
