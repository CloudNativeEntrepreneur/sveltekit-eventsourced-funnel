<script>
  import { funnel } from '$lib/funnel'
  const email = funnel.user.email
  funnel.enter()

  const yes = async () => {
    await funnel.completeStep({ downsell: true })
  }
  const no = async () => {
    await funnel.completeStep({ downsell: false })
  }
</script>

<h1>Downsell</h1>

<p>How about this instead, {email}?</p>

<button class="yes" on:click|preventDefault={yes}> Ok, Let's do that! </button>

<button class="no" on:click|preventDefault={no}> Still, No thanks </button>

<style>
  button {
    display: block;
  }

  .yes {
    background-color: greenyellow;
  }
</style>
