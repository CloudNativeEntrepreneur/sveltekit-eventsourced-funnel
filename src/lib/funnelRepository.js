import { Funnel } from './aggregates/Funnel'
import { Repository } from './sourced-repo-svelte-store-localstorage'

export const funnelRepository = new Repository(Funnel)
