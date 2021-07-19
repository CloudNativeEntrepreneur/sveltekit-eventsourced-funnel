import { Aggregate } from '$lib/eventsourcing';
import { v4 as uuid } from 'uuid'

export class Funnel extends Aggregate {
  constructor(snapshot, events) {
    super()

    this.session = ""
    this.user = ""
    this.creditCard = ""
    this.steps = []
    this.currentStep = 0
    this.orderBump = false
    this.upsell = false
    this.downsell = false
    this.lastCompletedStep = 0
    this.currentStep = 0
    this.nextStep = 0
  }

  addStep (step) {
    this.steps.push(step)
    this.digest('addStep', step)
    this.emit('step.added', this, step)
  }

  async completeStep (data) {
    await this.steps[this.currentStep].action(data)
    this.lastCompletedStep = this.currentStep

    const originalNextStep = this.currentStep + 1
    this.nextStep = originalNextStep

    if (this.skipNextStep) {
      this.skippedStep = originalNextStep
      this.nextStep = originalNextStep + 1
      this.skipNextStep = false
    }

    this.digest('completeStep', data)
    this.emit('step.completed', this)

    if (this.nextStep != originalNextStep) {
      this.emit('step.skipped', this)
    }
  }

  enter () {
    this.currentStep = this.nextStep
    this.session = uuid()
    this.digest('enter')
    this.emit('entered', this)
  }
}