import { Aggregate } from '$lib/eventsourcing'
import { v4 as uuid } from 'uuid'

export class FunnelStep extends Aggregate {
  constructor(snapshot, events) {
    super()

    this.entered = false
    this.url = ''
    this.name = ''
    this.submittedData = {}

    this.rehydrate(snapshot, events)
  }

  initialize({ id, url, name, onSubmit }) {
    this.id = id
    this.url = url
    this.name = name
    this.onSubmit = onSubmit
    this.digest('initialize', id)
    this.enqueue('initialized', this)
  }

  submit(data) {
    this.submittedData = data
    this.digest('submit', data)
    this.enqueue('submitted', this)
  }

  enter() {
    if (this.entered) {
      // user is returning
      // did user have a previousSession? If so, store so we can link them in analytics.
      this.previousSession = this.session
      console.log(`Welcome back to step ${this.name}!`)
    } else {
      console.log(`Welcome to step ${this.name}!`)
      this.entered = true
    }
    this.session = uuid()

    this.digest('enter')
    this.emit('entered', this)
  }
}
