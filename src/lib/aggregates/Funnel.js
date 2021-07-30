import { Aggregate } from '$lib/eventsourcing'
import { v4 as uuid } from 'uuid'

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

    this.rehydrate(snapshot, events)
  }

  initialize(id) {
    this.id = id
    this.digest('initialize', id)
    this.enqueue('initialized', this)
  }

  configureSteps(steps) {
    this.steps = steps
    this.digest('configureSteps', steps)
    this.enqueue('steps.configured', this, steps)
  }

  addStep(step) {
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

  complete() {
    if (this.completed) return
    this.completed = true
    this.digest('complete')
    this.enqueue('completed', this)
  }

  setEmail(email) {
    this.email = email
    this.digest('setEmail', email)
    this.enqueue('email.set', this)
  }

  acceptOTO() {
    this.oto = true
    this.digest('acceptOTO')
    this.enqueue('oto.accepted', this)
  }

  declineOTO() {
    this.oto = false
    this.digest('declineOTO')
    this.enqueue('oto.declined', this)
  }

  // this is obviously bad and just an example
  // but you could create a stripe charge here and
  // store the token, for example
  checkout({ creditCard }) {
    this.creditCard = creditCard
    this.digest('checkout', { creditCard })
    this.enqueue('checkout.completed', this)
  }

  acceptUpsell() {
    this.upsell = true
    this.digest('acceptUpsell')
    this.enqueue('upsell.accepted', this)
  }

  declineUpsell() {
    this.upsell = false
    this.digest('declineUpsell')
    this.enqueue('upsell.declined', this)
  }

  acceptDownsell() {
    this.downsell = true
    this.digest('acceptDownsell')
    this.enqueue('downsell.accepted', this)
  }

  declineDownsell() {
    this.downsell = false
    this.digest('declineDownsell')
    this.enqueue('downsell.declined', this)
  }
}
