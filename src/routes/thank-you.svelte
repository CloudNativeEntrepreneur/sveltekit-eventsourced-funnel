<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'
  import { page } from '$app/stores'
  import { funnelRepository } from '$lib/funnelRepository'

  let email
  let oto
  let creditCard
  let upsell
  let downsell
  let funnel

  const start = async () => {
    funnel = await loadFunnel()

    email = funnel.email
    oto = funnel.oto
    creditCard = funnel.creditCard
    upsell = funnel.upsell
    downsell = funnel.downsell

    const currentStep = funnel.steps
      .filter((step) => step.url === $page.path)
      .reduce((step) => step)

    funnel.setCurrentStep(currentStep.url)
    funnel.complete()
    await funnelRepository.commit(funnel)
  }

  if (browser) {
    start()
  }
</script>

<h1>Thanks!</h1>

<ul>
  {#if email}<li>Email: {email}</li>{/if}
  {#if creditCard}<li>Card #: {creditCard}</li>{/if}
  {#if oto}<li>OTO: {oto}</li>{/if}
  {#if upsell}<li>upsell: {upsell}</li>{/if}
  {#if downsell}<li>downsell: {downsell}</li>{/if}
</ul>
