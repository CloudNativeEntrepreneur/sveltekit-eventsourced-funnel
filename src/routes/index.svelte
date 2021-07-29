<script>
  import { funnel } from '$lib/funnel'

  let email = funnel.user.email
  funnel.enterStep()

  const submit = async () => {
    await funnel.completeStep({ email })
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
