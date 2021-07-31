<script>
  import { onMount } from 'svelte'
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

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1

    // downsell is next step
    const downsellStep = funnel.steps[nextStepIndex]

    // or send to end if they accept (skip downsell)
    const finalStep = funnel.steps[funnel.steps.length - 1]

    // if accepted, go to final step
    funnel.on('upsell.accepted', async () => {
      await goto(finalStep.url)
    })

    // if declined, send to the downsell
    funnel.on('upsell.declined', async () => {
      await goto(downsellStep.url)
    })

    funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  const yes = async () => {
    funnel.acceptUpsell()
    await funnelRepository.commit(funnel)
  }

  const no = async () => {
    funnel.declineUpsell()
    await funnelRepository.commit(funnel)
  }

  onMount(start)
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
