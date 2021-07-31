<script>
  import { onMount } from 'svelte'
  import { load } from '$lib/funnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/repositories/funnelRepository'

  let email
  let oto
  let creditCard
  let upsell
  let downsell
  let funnel
  let loadingFunnel = true

  const start = async () => {
    funnel = await load()

    email = funnel.email
    oto = funnel.oto
    creditCard = funnel.creditCard
    upsell = funnel.upsell
    downsell = funnel.downsell
    loadingFunnel = false

    const currentStep = funnel.steps
      .filter((step) => step.url === $page.path)
      .reduce((step) => step)

    funnel.setCurrentStep(currentStep.url)
    funnel.complete()
    await funnelRepository.commit(funnel)
  }

  onMount(start)
</script>

<h1>Thanks!</h1>

<ul>
  {#if email}<li>Email: {email}</li>{/if}
  {#if creditCard}<li>Card #: {creditCard}</li>{/if}
  {#if oto}<li>OTO: {oto}</li>{/if}
  {#if upsell}<li>upsell: {upsell}</li>{/if}
  {#if downsell}<li>downsell: {downsell}</li>{/if}
</ul>
