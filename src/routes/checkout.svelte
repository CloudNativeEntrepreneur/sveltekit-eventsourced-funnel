<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/funnelRepository'
  import { goto } from '$app/navigation'

  let creditCard
  let email
  let funnel

  const start = async () => {
    funnel = await loadFunnel()

    email = funnel.email

    const currentStep = funnel.steps
      .filter((step) => step.url === $page.path)
      .reduce((step) => step)

    const nextStepIndex =
      funnel.steps.map((e) => e.url).indexOf(currentStep.url) + 1

    const nextStep = funnel.steps[nextStepIndex]

    funnel.on('checkout.completed', async () => {
      await goto(nextStep.url)
    })

    await funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  if (browser) {
    start()
  }

  const submit = async () => {
    await funnel.checkout({ creditCard })
    await funnelRepository.commit(funnel)
  }
</script>

<h1>Checkout</h1>

<form class="content" on:submit|preventDefault={submit}>
  <label for="email">
    E-mail
    <input name="email" type="text" bind:value={email} required disabled />
  </label>

  <label for="creditCard">
    Credit Card #
    <input name="creditCard" type="text" bind:value={creditCard} required />
  </label>
  <input type="submit" />
</form>
