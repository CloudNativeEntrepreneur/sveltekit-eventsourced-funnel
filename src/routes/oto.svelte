<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/funnelRepository'
  import { goto } from '$app/navigation'

  let funnel
  let email
  let currentStep
  let nextStep
  let finalStep

  const start = async () => {
    funnel = await loadFunnel()

    email = funnel.email

    currentStep =
      funnel.steps
        .filter((step) => step.url === $page.path)
        .reduce((step) => step)

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1
    
    nextStep = funnel.steps[nextStepIndex]
    finalStep = funnel.steps[funnel.steps.length - 1]

    // if accepted, go to next step
    funnel.on('oto.accepted', async () => {
      await goto(nextStep.url)
    })

    // if declined, send to the end
    funnel.on('oto.declined', async () => {
      await goto(finalStep.url)
    })

    await funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  if (browser) {
    start()
  }

  const yes = async () => {
    await funnel.acceptOTO()
    await funnelRepository.commit(funnel)
  }

  const no = async () => {
    await funnel.declineOTO()
    await funnelRepository.commit(funnel)
  }
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
