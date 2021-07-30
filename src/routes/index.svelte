<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/funnelRepository'
  import { FunnelStep } from '$lib/entities/FunnelStep'
  import { goto } from '$app/navigation'

  let funnel
  let email
  let currentStep
  let nextStep

  const submit = async (event) => {
    console.log('submit', currentStep)
    await currentStep.submit({ email })
  }

  const start = async () => {
    funnel = await loadFunnel()

    email = funnel.email

    funnel.on('email.set', async () => {
      await goto(nextStep.url)
    })

    currentStep = new FunnelStep(
      funnel.steps
        .filter((step) => step.url === $page.path)
        .reduce((step) => step)
    )

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1
    nextStep = new FunnelStep(funnel.steps[nextStepIndex])

    currentStep.on('entered', async () => {
      await funnel.setCurrentStep(currentStep.url)
      await funnelRepository.commit(funnel)
    })

    currentStep.on('submitted', async ({ submittedData }) => {
      console.log('submitted!')
      const { email } = submittedData
      await funnel.setEmail(email)
      await funnelRepository.commit(funnel)
    })

    await currentStep.enter()
    await funnelRepository.commit(funnel)
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
