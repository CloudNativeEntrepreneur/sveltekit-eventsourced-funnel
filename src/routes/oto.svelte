<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/funnelRepository'
  // import { goto } from '$app/navigation'

  let funnel
  let email
  let currentStep
  let nextStep

  const start = async () => {
    funnel = await loadFunnel()

    email = funnel.email

    currentStep = funnel.steps
      .filter((step) => step.url === $page.path)
      .reduce((step) => step)

    const nextStepIndex = funnel.steps.map(e => e.url).indexOf(currentStep.url) + 1
    nextStep = funnel.steps[nextStepIndex]

    currentStep.on('entered', async () => {
      funnel.setCurrentStep(currentStep.url)
      await funnelRepository.commit(funnel)
    })
    
    currentStep.on('submitted', async ({ submittedData }) => {
      const { email } = submittedData
      funnel.setEmail(email)
      await funnelRepository.commit(funnel)
    })

    await currentStep.enter()
  }

  if (browser) {
    start()
  }

  const yes = () => {}
  const no = () => {}
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
