<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores';
  import { funnelRepository } from '$lib/funnelRepository';

  let funnel
  let email
  let currentStep

  let submit = (event) => {
    console.log(event)
    console.log(email)
    console.log(funnel)
  }

  const start = async () => {
    console.log('index - loading funnel...')
    funnel = await loadFunnel()
    
    currentStep = funnel.steps.filter(step => step.url === $page.path).reduce(step => step)
    console.log('index - funnel loaded', { funnel, currentStep })

    currentStep.on('entered', async () => {
      console.log('entered step')
      funnel.setCurrentStep(currentStep.url)
      await funnelRepository.commit(funnel)
    })

    await currentStep.enter()

  }

  if (browser) {
    start()
  }
</script>

<h1>Lead magnet</h1>

<form class="content" on:submit|preventDefault={submit}>
  <label for="email">
    E-mail
    <input name="email" type="text" bind:value={email} required />
  </label>
  <input type="submit" />
</form>
