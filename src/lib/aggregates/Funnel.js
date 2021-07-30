import { Aggregate } from '$lib/eventsourcing'
import { v4 as uuid } from 'uuid'
import { FunnelStep } from './FunnelStep'

export class Funnel extends Aggregate {
  constructor(snapshot, events) {
    super()

    // analytics
    this.session = ''

    // data to collect
    this.email = ''
    this.creditCard = ''
    this.orderBump = false
    this.upsell = false
    this.downsell = false

    // steps
    this.steps = []

    // funnel state
    this.entered = false
    this.currentStep = null

    this.lastCompletedStep = null
    this.skipNextStep = false
    this.skipToEnd = false

    this.rehydrate(snapshot, events)
  }

  initialize(id) {
    this.id = id
    this.digest('initialize', id)
    this.enqueue('initialized', this)
  }

  configureSteps(steps) {
    const funnelSteps = steps.map((step) => new FunnelStep(step))
    this.steps = funnelSteps
    this.digest('configureSteps', steps)
    this.enqueue('steps.configured', this, funnelSteps)
  }

  addStep(step) {
    step = new FunnelStep(step)
    this.steps.push(step)
    this.digest('addStep', step)
    this.enqueue('step.added', this, step)
  }

  setCurrentStep(stepUrl) {
    if (this.currentStep === stepUrl) return
    this.currentStep = stepUrl
    this.digest('setCurrentStep', stepUrl)
    this.enqueue('currentStep.set', this, stepUrl)
  }

  enter() {
    if (this.entered) {
      // user is returning
      // did user have a previousSession? If so, store so we can link them in analytics.
      this.previousSession = this.session
      console.log('Welcome back to the funnel!')
    } else {
      console.log('Welcome to the funnel!')
      this.entered = true
    }
    this.session = uuid()

    this.digest('enter')
    this.enqueue('entered', this)
  }

  exit() {
    this.complete = true
    this.digest('exit')
    this.enqueue('exited', this)
  }

  setEmail(email) {
    this.email = email
    this.digest('setEmail', email)
    this.enqueue('email.set', this)
  }
}
