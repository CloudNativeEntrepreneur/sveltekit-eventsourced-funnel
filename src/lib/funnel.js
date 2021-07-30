import { funnelRepository } from '$lib/repositories/funnelRepository'
import { Funnel } from '$lib/models/Funnel'
import { steps } from '$lib/steps'

export const load = () => {
  return new Promise(async (resolve, reject) => {
    let funnel
    try {
      funnel = await funnelRepository.get('session')
    } catch (err) {
      console.error(err)
      throw err
    }

    if (!funnel) {
      funnel = new Funnel()
      funnel.initialize('session')
      funnel.configureSteps(steps)
      funnel.enter()
    }

    try {
      await funnelRepository.commit(funnel)
    } catch (err) {
      console.error(err)
      throw err
    }

    return resolve(funnel)
  })
}
