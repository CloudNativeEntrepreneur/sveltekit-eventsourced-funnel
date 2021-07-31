import { Funnel } from '$lib/models/Funnel'
import { Repository } from '$lib/eventsourcing/sourced-repo-svelte-store-localstorage'
import { browser } from '$app/env'

let repository

if (browser) {
  repository = new Repository(Funnel)
}

export const funnelRepository = repository
