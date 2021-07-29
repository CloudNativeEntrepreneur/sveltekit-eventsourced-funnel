import { funnelRepository } from '$lib/funnelRepository'
import { Funnel } from '$lib/aggregates/Funnel'
import { steps } from '$lib/steps'

export const loadFunnel = () => {
  return new Promise(async (resolve, reject) => {
    let funnel
    console.log('loadFunnel - Loading funnel...')
    try {
      funnel = await funnelRepository.get('session')
    } catch (err) {
      console.error(err)
      throw err
    }
  
    if (! funnel) {
      console.log('loadFunnel - initializing new funnel')
      funnel = new Funnel()
      await funnel.initialize('session')
      console.log('loadFunnel - configuring steps')
      await funnel.configureSteps(steps)
      console.log('loadFunnel - entering funnel')
      await funnel.enter()
      console.log('loadFunnel - funnel', funnel)
    }
  
    try {
      console.log('loadFunnel - commiting funnel', funnel)
      await funnelRepository.commit(funnel)
    } catch (err) {
      console.error(err)
      throw err
    }
  
    return resolve(funnel)

  })
}