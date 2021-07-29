<script>
  import { browser } from '$app/env'
  import { loadFunnel } from '$lib/loadFunnel'

  let funnel
  let email
  let submit = (event) => {
    console.log(event)
    console.log(email)
    console.log(funnel)
  }

  const start = async () => {
    console.log('index - loading funnel...')
    funnel = await loadFunnel()
    console.log('index - funnel loaded', funnel)
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
