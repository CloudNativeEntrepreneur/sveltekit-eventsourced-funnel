import { funnelRepository } from '$lib/repositories/funnelRepository'
import { Funnel } from '$lib/models/Funnel'
import { steps } from '$lib/steps'

/**
 *
 * There is only one instance of Funnel per session, and therefore uses the id "session" to keep it simple.
 *
 * Calling `load` attempts to get the Funnel by it's id, "session" from the repository.
 *
 * If an existing funnel instance exists in the repository (svelte store backed by localstorage), it returns that funnel instance.
 * Otherwise, a new Funnel is initialized, configured with steps, and entered. This new funnel instance is provided. The next time the
 * `load` function is called (on another page), this same already initialized instance will be returned.
 *
 * It's a singleton with some initialization logic.
 *
 */
export const load = async () => {
  let funnel
  try {
    funnel = await funnelRepository.get('session')
  } catch (err) {
    console.error('Error getting from the funnel repository:', err)
    throw err
  }

  if (!funnel) {
    funnel = new Funnel()
    funnel.initialize('session')
    funnel.configureSteps(steps)
    funnel.enter()
  }

  // it's ok to commit without changes
  // and, if using sourced-queued-repo, releases the lock created by the get
  // we are not in this project, but that possibility makes it good practice
  // to get then commit.
  try {
    await funnelRepository.commit(funnel)
  } catch (err) {
    console.error('Error commiting to the funnel repository:', err)
    throw err
  }

  return funnel
}
