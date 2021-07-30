import { Funnel } from '$lib/models/Funnel'
import { Repository } from '$lib/eventsourcing/sourced-repo-svelte-store-localstorage'

export const funnelRepository = new Repository(Funnel)
