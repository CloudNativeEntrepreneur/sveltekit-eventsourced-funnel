import { Repository } from 'sourced-repo-svelte-local-storage-store'
import { Funnel } from '$lib/models/Funnel'
import { browser } from '$app/env'

let repository

if (browser) {
  repository = new Repository(Funnel)
}

export const funnelRepository = repository
