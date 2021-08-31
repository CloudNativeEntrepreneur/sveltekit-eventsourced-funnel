<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { load } from '$lib/funnel'
  import { funnelRepository } from '$lib/repositories/funnelRepository'

  let creditCard
  let email
  let funnel
  let loadingFunnel = true

  const start = async () => {
    funnel = await load()

    email = funnel.email
    loadingFunnel = false

    const currentStep = funnel.steps.find((step) => step.url === $page.path)

    funnel.on('checkout.completed', async () => {
      await goto(currentStep.nextStep)
    })

    funnel.setCurrentStep(currentStep.url)
    funnelRepository.commit(funnel)
  }

  const submit = () => {
    funnel.checkout({ creditCard })
    funnelRepository.commit(funnel)
  }

  onMount(start)
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
  <input type="submit" disabled={loadingFunnel} />
</form>
