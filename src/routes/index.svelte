<script>
  import { funnel } from '$lib/funnel'
  let email = ''
  funnel.enter()

  const submit = async () => {
    await funnel.completeStep({ email })
  }
</script>

<h1>Getting Dangerous With DevOps 2.0</h1>

<form class="content" on:submit|preventDefault={submit}>
  <label for="email">
    E-mail
    <input name="email" type="text" bind:value={email} />
  </label>
  <input type="submit" />
</form>
