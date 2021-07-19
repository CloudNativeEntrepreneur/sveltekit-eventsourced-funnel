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
  }

  addStep (step) {
    this.steps.push(step)
    this.digest('addStep', step)
    this.emit('step.added', this, step)
  }

  async completeStep (data) {
    await this.steps[this.currentStep].action(data)
    this.currentStep += 1
    this.digest('completeStep', data)
    this.emit('step.completed', this)
  }

  enter () {
    this.entered = true
    this.session = uuid()
    this.digest('enter')
    this.emit('entered', this)
  }
}