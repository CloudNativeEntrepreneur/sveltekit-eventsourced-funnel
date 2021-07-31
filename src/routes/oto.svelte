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

    // if accepted, go to next step
    funnel.on('oto.accepted', async () => {
      await goto(currentStep.nextStepYes)
    })

    // if declined, send to the end
    funnel.on('oto.declined', async () => {
      await goto(currentStep.nextStepNo)
    })

    funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  const yes = async () => {
    funnel.acceptOTO()
    await funnelRepository.commit(funnel)
  }

  const no = async () => {
    funnel.declineOTO()
    await funnelRepository.commit(funnel)
  }

  onMount(start)
</script>

<h1>One time offer!</h1>

<p>Thanks for signing up {email}</p>

<button class="yes" on:click|preventDefault={yes}> Buy One time offer! </button>

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
