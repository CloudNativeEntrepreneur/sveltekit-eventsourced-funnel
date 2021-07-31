import events from 'eventemitter3'
import { get } from 'svelte/store'
import { writable as writeableWithLocalStorage } from 'svelte-local-storage-store'

const { EventEmitter } = events
const log = console.log

export class Repository extends EventEmitter {
  constructor(
    EntityType,
    options = {
      indices: [],
      forceSnapshot: false
    }
  ) {
    super()

    const indices = [...new Set([...options.indices, ...['id']])]

    this.EntityType = EntityType
    this.indices = indices
    this.snapshotFrequency = options.snapshotFrequency || 10
    this.forceSnapshot = options.forceSnapshot

    // snapshot store setup
    const snapshotsKey = `${EntityType.name}.snapshots`
    const snapshots = writeableWithLocalStorage(snapshotsKey, [])
    this.snapshots = snapshots

    // event store setup
    const eventsKey = `${EntityType.name}.events`
    const events = writeableWithLocalStorage(eventsKey, [])
    this.events = events

    log(`initialized ${this.EntityType.name} entity store`)

    this.emit('ready')
  }

  async commit(entity) {
    return new Promise(async (resolve, reject) => {
      log(`committing ${this.EntityType.name} for id ${entity.id}`)

      try {
        await this._commitEvents(entity)
      } catch (err) {
        console.error(err)
        return reject(err)
      }

      try {
        await this._commitSnapshots(entity)
      } catch (err) {
        console.error(err)
        return reject(err)
      }

      this._emitEvents(entity)
      return resolve(this)
    })
  }

  get(id, cb) {
    return this._getByIndex('id', id, cb)
  }

  _getByIndex(index, value, cb) {
    const self = this

    return new Promise((resolve, reject) => {
      if (this.indices.indexOf(index) === -1)
        throw new Error(
          'Cannot get sourced entity type [%s] by index [%s]',
          this.EntityType,
          index
        )

      log(`getting ${this.EntityType.name} where "${index}" is "${value}"`)

      const allSnapshots = get(this.snapshots)
      const snapshots = allSnapshots.filter(
        (snapshot) => snapshot[index] === value
      )
      const snapshot = snapshots[0]

      const allEvents = get(this.events)
      const events = allEvents
        .filter((event) => event[index] === value)
        .filter((event) => (snapshot ? event.version > snapshot.version : true))

      log({ snapshots, snapshot, events })

      // if (snapshot && snapshot._id) delete snapshot._id
      if (!snapshot && !events.length) {
        return resolve(null)
      }

      const id = index === 'id' ? value : snapshot ? snapshot.id : events[0].id

      const entity = self._deserialize(id, snapshot, events)
      return resolve(entity)
    })
  }

  _commitEvents(entity) {
    return new Promise((resolve, reject) => {
      if (entity.newEvents.length === 0) return resolve()

      if (!entity.id) {
        return reject(
          new Error(
            `Cannot commit an entity of type ${this.EntityType} without an [id] property`
          )
        )
      }

      const newEvents = entity.newEvents
      newEvents.forEach((event) => {
        this.indices.forEach(function (index) {
          event[index] = entity[index]
        })
      })

      this.events.update((previousEvents) => [...previousEvents, ...newEvents])
      entity.newEvents = []

      log(`committed ${this.EntityType.name}.events for id ${entity.id}`)

      resolve(entity)
    })
  }

  _commitSnapshots(entity) {
    const self = this

    return new Promise((resolve, reject) => {
      if (
        self.forceSnapshot ||
        entity.version >= entity.snapshotVersion + self.snapshotFrequency
      ) {
        const snapshot = entity.snapshot()
        // put new one at the beginning for premptive sorting
        this.snapshots.update((previousSnapshots) => [
          snapshot,
          ...previousSnapshots
        ])

        log(
          `committed ${self.EntityType.name}.snapshot for id ${entity.id}`,
          snapshot
        )

        return resolve(entity)
      } else {
        return resolve(entity)
      }
    })
  }

  _deserialize(id, snapshot, events) {
    log('deserializing %s entity ', this.EntityType.name)
    const entity = new this.EntityType(snapshot, events)
    entity.id = id
    return entity
  }

  _emitEvents(entity) {
    log('emitting events')
    const self = this

    const eventsToEmit = entity.eventsToEmit
    entity.eventsToEmit = []
    eventsToEmit.forEach(function (eventToEmit) {
      const args = Array.prototype.slice.call(eventToEmit)
      self.EntityType.prototype.emit.apply(entity, args)
    })

    log('emitted local events for id %s', entity.id)
  }
}
