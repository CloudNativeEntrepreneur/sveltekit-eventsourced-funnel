import { EventEmitter } from 'eventemitter3'
import { writable } from 'svelte/store'
import { get } from 'svelte/store'

const log = console.log

export class Repository extends EventEmitter {
  constructor(
    entityType,
    options = {
      indices: [],
      forceSnapshot: true
    }
  ) {
    super()

    console.log(options)

    const indices = [...new Set([...options.indices, ...['id']])]

    this.entityType = entityType
    this.indices = indices
    this.snapshotFrequency = options.snapshotFrequency || 10
    this.forceSnapshot = options.forceSnapshot

    // snapshot store setup
    // const snapshotCollectionName = `${entityType.name}.snapshots`
    const snapshots = writable([])
    this.snapshots = snapshots

    // event store setup
    // const eventCollectionName = `${entityType.name}.events`
    const events = writable([])
    this.events = events

    // history store setup
    // const historyCollectionName = `${entityType.name}.history`
    const history = writable([])
    this.history = history

    log(`initialized ${this.entityType.name} entity store`)

    this.emit('ready')
  }

  async commit(entity) {
    return new Promise(async (resolve, reject) => {

      log(`committing ${this.entityType.name} for id ${entity.id}`)
  
      try {
        log(`committing ${this.entityType.name} events`)
        await this._commitEvents(entity)
        log(`committed ${this.entityType.name} events`)
      } catch (err) {
        console.error(err)
        return reject(err)
      }
      
      try {
        log(`committing ${this.entityType.name} snapshots`)
        await this._commitSnapshots(entity)
        log(`committed ${this.entityType.name} snapshots`)
      } catch (err) {
        console.error(err)
        return reject(err)
      }

      log(`emitting ${this.entityType.name} events`)
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
          this.entityType,
          index
        )

      log(`getting ${this.entityType.name} where "${index}" is "${value}"`)

      const allSnapshots = get(this.snapshots)
      const snapshots = allSnapshots.filter(snapshot => snapshot[index] === value)

      const snapshot = snapshots[0]
      const allEvents = get(this.events)
      const events = allEvents.filter(event => event[index] === value)

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
    const self = this

    return new Promise((resolve, reject) => {
      if (entity.newEvents.length === 0) return resolve()
  
      if (!entity.id) {
        return reject(
          new Error(`Cannot commit an entity of type ${this.entityType} without an [id] property`)
        )
      }
  
      const newEvents = entity.newEvents
      newEvents.forEach((event) => {
        this.indices.forEach(function (index) {
          event[index] = entity[index]
        })
      })
  
      const previousEvents = get(this.events)
      this.history.set(previousEvents)
      this.events.set(newEvents)
      entity.newEvents = []
      log(`committed ${this.entityType.name}.events for id ${entity.id}`)

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

        const snapshots = get(this.snapshots)

        // this.snapshots.set([snapshot, ...snapshots])
        // only store one as local storage space is limited
        this.snapshots.set([snapshot])

        log('committed ${self.entityType.name}.snapshot for id ${entity.id}', snapshot)
        
        return resolve(entity)
      } else {
        return resolve(entity)
      }

    })

  }

  _deserialize(id, snapshot, events) {
    log('deserializing %s entity ', this.entityType.name)
    const entity = new this.entityType(snapshot, events)
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
      self.entityType.prototype.emit.apply(entity, args)
    })

    log('emitted local events for id %s', entity.id)
  }
}
