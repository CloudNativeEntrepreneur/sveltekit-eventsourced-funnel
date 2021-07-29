import { Aggregate } from '$lib/eventsourcing'
import { v4 as uuid } from 'uuid'
import { FunnelStep } from './FunnelStep'

export class Funnel extends Aggregate {
  constructor(snapshot, events) {
    super()

    this.session = ''
    this.user = ''
    this.creditCard = ''
    this.steps = []
    this.initialStep = 0
    this.entered = false
    this.currentStep = null
    this.orderBump = false
    this.upsell = false
    this.downsell = false
    this.lastCompletedStep = null
    this.currentStep = null
    this.nextStep = null
    this.skipNextStep = false
    this.skipToEnd = false

    this.rehydrate(snapshot, events)
  }

  initialize(id) {
    this.id = id
    this.digest('initialize', id)
    this.emit('initialized', this)
  }

  configureSteps(steps) {
    console.log('configuring steps')
    let funnelSteps = steps.map(step => new FunnelStep(step))
    console.log(funnelSteps)
    this.steps = funnelSteps
    this.digest('configureSteps', steps)
    this.emit('steps.configured', this)
  }

  addStep(step) {
    step = new FunnelStep(step)
    this.steps.push(step)
    this.digest('addStep', step)
    this.emit('step.added', this, step)
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
      this.currentStep = this.initialStep
      this.nextStep = this.currentStep + 1
    }
    this.session = uuid()

    this.digest('enter')
    this.emit('entered', this)
  }

  exit() {
    this.complete = true
    this.digest('exit')
    this.digest('exited')
  }
}
