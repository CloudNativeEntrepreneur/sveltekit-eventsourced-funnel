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

    const currentStep = funnel.steps.find((step) => step.url === $page.path)

    // if accepted, go to next step
    funnel.on('oto.accepted', async () => {
      await goto(currentStep.nextStepYes)
    })

    // if declined, send to the end
    funnel.on('oto.declined', async () => {
      await goto(currentStep.nextStepNo)
    })

    funnel.setCurrentStep(currentStep.url)
    funnelRepository.commit(funnel)
  }

  const yes = () => {
    funnel.acceptOTO()
    funnelRepository.commit(funnel)
  }

  const no = () => {
    funnel.declineOTO()
    funnelRepository.commit(funnel)
  }

  onMount(start)
</script>

<h1>One time offer!</h1>

<p>Thanks for signing up {email}</p>

<button class="yes" on:click|preventDefault={yes} disabled={loadingFunnel}>
  Buy One time offer!
</button>
<button class="no" on:click|preventDefault={no} disabled={loadingFunnel}>
  No thanks
</button>

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
