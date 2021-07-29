import { Aggregate } from '$lib/eventsourcing'
import { v4 as uuid } from 'uuid'

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

  configureSteps(steps) {
    this.steps = steps
    this.digest('configureSteps', steps)
    this.emit('steps.configured', this)
  }

  addStep(step) {
    this.steps.push(step)
    this.digest('addStep', step)
    this.emit('step.added', this, step)
  }

  async completeStep(data) {
    await this.steps[this.currentStep].onSubmit(data)
    this.lastCompletedStep = this.currentStep

    const originalNextStep = this.currentStep + 1
    this.nextStep = originalNextStep

    if (this.skipNextStep) {
      this.skippedStep = originalNextStep
      this.nextStep = originalNextStep + 1
      this.skipNextStep = false
    }

    if (this.skipToEnd) {
      console.log('skipping to end')
      this.nextStep = this.steps.length - 1
    }

    this.digest('completeStep', data)
    this.emit('step.completed', this)

    if (this.nextStep !== originalNextStep) {
      this.emit('step.skipped', this)
    }
  }

  enter() {
    if (this.entered) {
      // user is returning
      // did user have a previousSession? If so, store so we can link them in analytics.
      this.previousSession = this.session
      console.log('Welcome back!')

    } else {
      console.log('Welcome!')
      this.entered = true
      this.currentStep = this.initialStep
      this.nextStep = this.currentStep + 1
    }
    this.session = uuid()

    this.digest('enter')
    this.emit('entered', this)
  }

  enterStep() {
    // this.session = uuid()
    this.currentStep = this.nextStep
    this.digest('enter')
    this.emit('step.entered', this)
  }

  exit() {
    this.complete = true
    this.digest('exit')
    this.digest('exited')
  }
}
