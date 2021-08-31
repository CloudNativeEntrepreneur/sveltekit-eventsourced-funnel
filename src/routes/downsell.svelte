<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { load } from '$lib/funnel'
  import { funnelRepository } from '$lib/repositories/funnelRepository'

  let email
  let funnel
  let loadingFunnel = true

  const start = async () => {
    funnel = await load()

    email = funnel.email
    loadingFunnel = false

    const currentStep = funnel.steps.find((step) => step.url === $page.path)

    // if accepted, go to final step
    funnel.on('downsell.accepted', async () => {
      await goto(currentStep.nextStepYes)
    })

    // if declined, send to the downsell
    funnel.on('downsell.declined', async () => {
      await goto(currentStep.nextStepNo)
    })

    funnel.setCurrentStep(currentStep.url)
    funnelRepository.commit(funnel)
  }

  const yes = () => {
    funnel.acceptDownsell()
    funnelRepository.commit(funnel)
  }

  const no = () => {
    funnel.declineDownsell()
    funnelRepository.commit(funnel)
  }

  onMount(start)
</script>

<h1>Downsell</h1>

<p>How about this instead, {email}?</p>

<button class="yes" on:click|preventDefault={yes} disabled={loadingFunnel}>
  Ok, Let's do that!
</button>
<button class="no" on:click|preventDefault={no} disabled={loadingFunnel}>
  Still, No thanks
</button>

<style>
  button {
    display: block;
  }

  .yes {
    background-color: greenyellow;
  }
</style>
