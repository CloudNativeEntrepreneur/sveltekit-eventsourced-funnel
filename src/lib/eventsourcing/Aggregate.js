import cloneDeep from 'lodash.clonedeep'
import { EventEmitter } from 'eventemitter3'
import debug from 'debug'

const log = debug('event-sourcing')

/**
 * Extending native Error.
 *
 * @class {Function} AggregateError
 * @param {String} msg The error message.
 */
class AggregateError extends Error {
  constructor (...args) {
    super(...args)
    log('Aggregate Error: ', this)
    Error.captureStackTrace(this, AggregateError)
  }
}

/**
 * Creates an event-sourced Aggregate.
 *
 * @class {Function} Aggregate
 * @param {Object} [snapshot] A previously saved snapshot of an Aggregate.
 * @param {Array} [events] An array of events to apply on instantiation.
 * @requires events
 * @requires debug
 * @requires util
 * @requires lodash
 * @license MIT
 */

export class Aggregate extends EventEmitter {
  constructor () {
    super()

    /**
     * [Description]
     * @member {Array} eventsToEmit
     * @todo discuss the use of this so it can be documented better.
     */
    this.eventsToEmit = []

    /**
     * [Description]
     * @member {Array} newEvents
     * @todo discuss the use of this so it can be documented better.
     */
    this.newEvents = []

    /**
     * Boolean to prevent emit, enqueue and digest from running during replay.
     * @member {Boolean} replaying
     */
    this.replaying = false

    /**
     * Holds the version of the latest snapshot for the Aggregate.
     * @member {Number} snapshotVersion
     */
    this.snapshotVersion = 0

    /**
     * Holds the event's timestamp in the Aggregate.
     * @member {Number} timestamp
     */
    this.timestamp = Date.now()

    /**
     * Holds the current version of the Aggregate.
     * @member {Number} version
     */
    this.version = 0
  }

  /**
   * Rehydrates by merging a snapshot, and replaying events on top.
   */
  rehydrate (snapshot, events) {
    log('rehydrating', this)
    /**
     * If a snapshot is provided, merge it.
     */
    if (snapshot) {
      this.merge(snapshot)
    }

    /**
     * If events are also provided, replay them
     */
    if (events) {
      this.replay(events)
    }
  }

  /**
   * Wrapper around the EventEmitter.emit method that adds a condition so events
   * are not fired during replay.
   */
  emit () {
    if (!this.replaying) {
      EventEmitter.prototype.emit.apply(this, arguments)
    }
  }

  /**
   * Add events to the queue of events to emit. If called during replay, this
   * method does nothing.
   */
  enqueue () {
    if (!this.replaying) {
      this.eventsToEmit.push(arguments)
    }
  }

  /**
   * Digest a command with given data.This is called whenever you want to record
   * a command into the events for the Aggregate. If called during replay, this
   * method does nothing.
   *
   * @param  {String} method  the name of the method/command you want to digest.
   * @param  {Object} data    the data that should be passed to the replay.
   */
  digest (method, data) {
    if (!this.replaying) {
      this.timestamp = Date.now()
      this.version = this.version + 1
      log(`digesting event ${method} w/ data`, { method, data })
      this.newEvents.push({
        method: method,
        data: data,
        timestamp: this.timestamp,
        version: this.version
      })
    }
  }

  /**
   * Merge a snapshot onto the Aggregate.
   *
   * For every property passed in the snapshot, the value is deep-cloned and then
   * merged into the instance through mergeProperty. See mergeProperty for details.
   *
   * @param  {Object} snapshot  snapshot object.
   * @see Aggregate.mergeProperty
   */
  merge (snapshot) {
    log('merging snapshot', { snapshot })
    for (const property in snapshot) {
      const val = cloneDeep(snapshot[property])
      this.mergeProperty(property, val)
    }
    return this
  }

  /**
   * Merge a property onto the instance.
   *
   * Given a name and a value, mergeProperty checks first attempt to find the
   * property in the mergeProperties map using the constructor name as key. If it
   * is found and it is a function, the function is called. If it is NOT found
   * we check if the property is an object. If so, we merge. If not, we simply
   * assign the passed value to the instance.
   *
   * @param  {String} name   the name of the property being merged.
   * @param  {Object} value  the value of the property being merged.
   * @see mergeProperties
   * @see Aggregate.mergeProperty
   */
  mergeProperty (name, value) {
    if (typeof value === 'object' && typeof this[name] === 'object') {
      Object.assign(this, {
        [name]: value
      })
    }
    else {
      this[name] = value
    }
  }

  /**
   * Replay an array of events onto the instance.
   *
   * The goal here is to allow application of events without emitting, enqueueing
   * nor digesting the replayed events. This is done by setting this.replaying to
   * true which emit, enqueue and digest check for.
   *
   * If the method in the event being replayed exists in the instance, we call
   * the mathod with the data in the event and set the version of the instance to
   * the version of the event. If the method is not found, we attempt to parse the
   * constructor to give a more descriptive error.
   *
   * @param  {Array} events  an array of events to be replayed.
   */
  replay (events) {
    const self = this

    this.replaying = true

    log('replaying events', { events })

    events.forEach(function (event) {
      if (self[event.method]) {
        self[event.method](event.data)
        self.version = event.version
      } else {
        const classNameRegexes = [/function\s+(\w+)\s?\(/, /class\s+(\w+)\s+extends?/]
        const match = classNameRegexes.find((regex) => regex.test(self.constructor))
        const className = match.exec(self.constructor)[1]
        const errorMessage = `method "${event.method}" does not exist on model "${className.trim()}"`
        throw new AggregateError(errorMessage)
      }
    })

    this.replaying = false
  }

  /**
   * Create a snapshot of the current state of the Aggregate instance.
   *
   * Here the instance's snapshotVersion property is set to the current version,
   * then the instance is deep-cloned and the clone is trimmed of the internal
   * event-sourcing attributes using trimSnapshot and returned.
   *
   * @returns  {Object}
   */
  snapshot () {
    this.snapshotVersion = this.version
    const snap = cloneDeep(this, true)
    return this.trimSnapshot(snap)
  }

  /**
   * Remove the internal event-sourcing properties from the passed snapshot.
   *
   * Snapshots are to contain only Aggregate data properties. This trims all other
   * properties from the snapshot.
   *
   * @param  {Object} snapshot  the snapshot to be trimmed.
   * @see Aggregate.prototype.snapshot
   */
  trimSnapshot (snapshot) {
    delete snapshot.eventsToEmit
    delete snapshot.newEvents
    delete snapshot.replaying
    delete snapshot._events
    delete snapshot._maxListeners
    return snapshot
  }
}
