import { EventEmitter } from 'eventemitter3'
import { v4 as uuid } from 'uuid'

export class FunnelStep extends EventEmitter {
  constructor(snapshot) {
    super()

    this.entered = false
    this.url = ''
    this.name = ''
    this.submitted = false
    this.submittedData = {}

    Object.assign(this, snapshot)
  }

  initialize({ id, url, name, onSubmit }) {
    this.id = id
    this.url = url
    this.name = name
    this.onSubmit = onSubmit

    this.emit('initialized', this)
  }

  submit(data) {
    this.submitted = true
    this.submittedData = data

    this.emit('submitted', this)
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

    this.emit('entered', this)
  }
}
