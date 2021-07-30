<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/funnelRepository'
  import { goto } from '$app/navigation'

  let email
  let funnel

  const start = async () => {
    funnel = await loadFunnel()

    email = funnel.email

    const currentStep =
      funnel.steps
        .filter((step) => step.url === $page.path)
        .reduce((step) => step)

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1
    
    // downsell is next step
    const downsellStep = funnel.steps[nextStepIndex]

    // or send to end if they accept (skip downsell)
    let finalStep = funnel.steps[funnel.steps.length - 1]

    // if accepted, go to final step
    funnel.on('upsell.accepted', async () => {
      await goto(finalStep.url)
    })

    // if declined, send to the downsell
    funnel.on('upsell.declined', async () => {
      await goto(downsellStep.url)
    })

    await funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  if (browser) {
    start()
  }

  const yes = async () => {
    await funnel.acceptUpsell()
    await funnelRepository.commit(funnel)
  }

  const no = async () => {
    await funnel.declineUpsell()
    await funnelRepository.commit(funnel)
  }
</script>

<h1>Upsell</h1>

<p>Thanks for signing up {email}</p>

<button class="yes" on:click|preventDefault={yes}> Buy Upsell</button>

<button class="no" on:click|preventDefault={no}> No thanks </button>

<style>
  button {
    display: block;
  }

  .yes {
    background-color: greenyellow;
  }

  .no {
    background-color: lightcoral;
  }
</style>
