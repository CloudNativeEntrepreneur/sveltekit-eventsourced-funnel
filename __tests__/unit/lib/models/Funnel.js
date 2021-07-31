import { expect, it, describe, beforeEach, jest } from '@jest/globals'
import { Funnel } from '$lib/models/Funnel'

// const steps defined below tests - looked too messy at the top

describe('Funnel model', () => {
  let funnel
  beforeEach(() => {
    jest.clearAllMocks()
    funnel = new Funnel()
  })

  it('should go through the happy path - buying everything', () => {
    funnel.initialize('test-id')
    expect(funnel.id).toEqual('test-id')

    funnel.configureSteps(steps)
    expect(funnel.steps).toEqual(steps)

    funnel.setCurrentStep('/')

    const currentStep = funnel.steps
      .find(step => step.url === funnel.currentStep)

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1

    const nextStep = funnel.steps[nextStepIndex]

    expect(currentStep.name).toBe('Lead Magnet')
    expect(nextStep.name).toBe('One Time Offer')

    funnel.enter()
    expect(funnel.entered).toEqual(true)

    const email = 'test@cloudnativeentrepreneur.com'
    funnel.setEmail(email)
    expect(funnel.email).toEqual(email)

    funnel.acceptOTO()
    expect(funnel.oto).toEqual(true)

    const creditCard = '4242424242424242'
    funnel.checkout({ creditCard })
    expect(funnel.creditCard).toEqual(creditCard)

    funnel.acceptUpsell()
    expect(funnel.upsell).toEqual(true)

    funnel.complete()
    expect(funnel.completed).toEqual(true)
  })

  it('should initialize a new funnel with an id', () => {
    funnel.initialize('test-id')
    expect(funnel.id).toEqual('test-id')
  })

  it('should configure steps', () => {
    funnel.configureSteps(steps)
    expect(funnel.steps).toEqual(steps)
  })

  it('should throw an error if trying to set current step and steps have not been configured', () => {
    try {
      funnel.setCurrentStep('/')
    } catch (err) {
      expect(err).toEqual(
        new Error('Cannot set current step when steps are not configured')
      )
    }
  })

  it('should set the current step by path', () => {
    funnel.configureSteps(steps)
    funnel.setCurrentStep('/')

    const currentStep = funnel.steps
      .find(step => step.url === funnel.currentStep)

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1

    const nextStep = funnel.steps[nextStepIndex]

    expect(currentStep.name).toBe('Lead Magnet')
    expect(nextStep.name).toBe('One Time Offer')
  })

  it('should dedupe setting current path', () => {
    funnel.configureSteps(steps)
    funnel.setCurrentStep('/')
    expect(funnel.eventsToEmit.length).toEqual(2)

    funnel.setCurrentStep('/')
    funnel.setCurrentStep('/')
    funnel.setCurrentStep('/')
    funnel.setCurrentStep('/')
    funnel.setCurrentStep('/')
    funnel.setCurrentStep('/')
    expect(funnel.eventsToEmit.length).toEqual(2)
  })

  it('should enter funnel', () => {
    funnel.enter()
    expect(funnel.entered).toEqual(true)
    expect(funnel.session).toEqual(expect.any(String))
  })

  it('should reenter funnel', () => {
    funnel.enter()
    expect(funnel.entered).toEqual(true)
    expect(funnel.session).toEqual(expect.any(String))
    const firstSession = funnel.session

    funnel.enter()
    expect(funnel.previousSession).toEqual(firstSession)
    expect(funnel.session).toEqual(expect.any(String))
    expect(funnel.session).not.toEqual(firstSession)
  })

  it('should set email', () => {
    const email = 'test@cloudnativeentrepreneur.com'
    funnel.setEmail(email)
    expect(funnel.email).toEqual(email)
  })

  it('should accept OTO', () => {
    funnel.acceptOTO()
    expect(funnel.oto).toEqual(true)
  })

  it('should decline OTO', () => {
    funnel.declineOTO()
    expect(funnel.oto).toEqual(false)
  })

  it('should checkout with credit card', () => {
    const creditCard = '4242424242424242'
    funnel.checkout({ creditCard })
    expect(funnel.creditCard).toEqual(creditCard)
  })

  it('should accept the upsell', () => {
    funnel.acceptUpsell()
    expect(funnel.upsell).toEqual(true)
  })

  it('should decline the upsell', () => {
    funnel.declineUpsell()
    expect(funnel.upsell).toEqual(false)
  })

  it('should accept the downsell', () => {
    funnel.acceptDownsell()
    expect(funnel.downsell).toEqual(true)
  })

  it('should accept the downsell', () => {
    funnel.declineDownsell()
    expect(funnel.downsell).toEqual(false)
  })

  it('should complete the funnel', () => {
    funnel.complete()
    expect(funnel.completed).toEqual(true)
  })

  it('should dedupe completed', () => {
    funnel.complete()
    expect(funnel.completed).toEqual(true)
    expect(funnel.eventsToEmit.length).toEqual(1)

    funnel.complete()
    funnel.complete()
    funnel.complete()
    funnel.complete()
    expect(funnel.eventsToEmit.length).toEqual(1)
  })
})

export const steps = [
  {
    url: '/',
    name: 'Lead Magnet'
  },
  {
    url: '/oto',
    name: 'One Time Offer'
  },
  {
    url: '/checkout',
    name: 'Checkout'
  },
  {
    url: '/upsell',
    name: 'Upsell'
  },
  {
    url: '/downsell',
    name: 'Downsell'
  },
  {
    url: '/thank-you',
    name: 'Thank You'
  }
]
