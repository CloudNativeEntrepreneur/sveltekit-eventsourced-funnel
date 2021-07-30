export const steps = [
  {
    url: '/',
    name: 'Lead Magnet'
    // onSubmit: (data) =>
    //   new Promise((resolve, reject) => {
    //     const { email } = data
    //     if (!email) reject(false)
    //     funnel.user = { email }

    //     resolve(funnel)
    //   })
  },
  {
    url: '/oto',
    name: 'One Time Offer'
    // onSubmit: (data) =>
    //   new Promise((resolve, reject) => {
    //     const { oto } = data
    //     funnel.oto = oto

    //     if (!oto) funnel.skipToEnd = true
    //     resolve(funnel)
    //   })
  },
  {
    url: '/checkout',
    name: 'Checkout'
    // onSubmit: (data) =>
    //   new Promise((resolve, reject) => {
    //     const { creditCard, orderBump } = data
    //     funnel.creditCard = creditCard
    //     funnel.orderBump = orderBump
    //     resolve(funnel)
    //   })
  },
  {
    url: '/upsell',
    name: 'Upsell'
    // onSubmit: (data) =>
    //   new Promise((resolve, reject) => {
    //     const { upsell } = data
    //     funnel.upsell = upsell

    //     // skip downsell
    //     if (funnel.upsell) funnel.skipNextStep = true
    //     resolve(funnel)
    //   })
  },
  {
    url: '/downsell',
    name: 'Downsell'
    // onSubmit: (data) =>
    //   new Promise((resolve, reject) => {
    //     const { downsell } = data
    //     funnel.downsell = downsell

    //     // skip checkout if they didnt buy
    //     if (!funnel.downsell) funnel.skipNextStep = true
    //     resolve(funnel)
    //   })
  },
  {
    url: '/thank-you',
    name: 'Thank You'
    // onSubmit: () =>
    //   new Promise((resolve, reject) => {
    //     resolve(funnel)
    //   })
  }
]
