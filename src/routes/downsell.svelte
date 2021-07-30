<script>
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { load } from '$lib/funnel'
  import { funnelRepository } from '$lib/repositories/funnelRepository'

  let email
  let funnel

  const start = async () => {
    funnel = await load()

    email = funnel.email

    const currentStep = funnel.steps
      .filter((step) => step.url === $page.path)
      .reduce((step) => step)

    // only step left
    const finalStep = funnel.steps[funnel.steps.length - 1]

    // if accepted, go to final step
    funnel.on('downsell.accepted', async () => {
      await goto(finalStep.url)
    })

    // if declined, send to the downsell
    funnel.on('downsell.declined', async () => {
      await goto(finalStep.url)
    })

    funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  if (browser) {
    start()
  }

  const yes = async () => {
    funnel.acceptDownsell()
    await funnelRepository.commit(funnel)
  }

  const no = async () => {
    funnel.declineDownsell()
    await funnelRepository.commit(funnel)
  }
</script>

<h1>Downsell</h1>

<p>How about this instead, {email}?</p>

<button class="yes" on:click|preventDefault={yes}> Ok, Let's do that! </button>

<button class="no" on:click|preventDefault={no}> Still, No thanks </button>

<style>
  button {
    display: block;
  }

  .yes {
    background-color: greenyellow;
  }
</style>
