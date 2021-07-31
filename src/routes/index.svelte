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

    const currentStep = funnel.steps
      .filter((step) => step.url === $page.path)
      .reduce((step) => step)

    funnel.on('email.set', async () => {
      await goto(currentStep.nextStep)
    })

    funnel.setCurrentStep(currentStep.url)
    await funnelRepository.commit(funnel)
  }

  const submit = async () => {
    funnel.setEmail(email)
    await funnelRepository.commit(funnel)
  }

  onMount(start)
</script>

<h1>Lead magnet</h1>

<form class="content" on:submit|preventDefault={submit}>
  <label for="email">
    E-mail
    <input name="email" type="text" bind:value={email} required />
  </label>
  <input type="submit" disabled="{loadingFunnel}" />
</form>
