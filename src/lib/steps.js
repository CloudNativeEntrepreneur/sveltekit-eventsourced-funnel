// declared backwards so they can reference eachother
const thankyou = {
  url: '/thank-you',
  name: 'Thank You'
}

const downsell = {
  url: '/downsell',
  name: 'Downsell',
  nextStepYes: thankyou.url,
  nextStepNo: thankyou.url
}

const upsell = {
  url: '/upsell',
  name: 'Upsell',
  nextStepYes: thankyou.url,
  nextStepNo: downsell.url
}

const checkout = {
  url: '/checkout',
  name: 'Checkout',
  nextStep: upsell.url
}

const oto = {
  url: '/oto',
  name: 'One Time Offer',
  nextStepYes: checkout.url,
  nextStepNo: thankyou.url
}

const leadMagnet = {
  url: '/',
  name: 'Lead Magnet',
  nextStep: oto.url
}

export const steps = [leadMagnet, oto, checkout, upsell, downsell, thankyou]
