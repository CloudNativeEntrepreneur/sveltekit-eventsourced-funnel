<script>
import { funnel } from '$lib/funnel'
let email = funnel.user.email
let creditCard = ""
funnel.enter()

const submit = async () => {
  console.log('submitted', arguments)
  await funnel.completeStep({ email, creditCard })
}
</script>

<h1>Checkout</h1>

<form class="content" on:submit|preventDefault={submit}>
  <label>E-mail</label>
  <input name="email" type="text" bind:value={email} />
  <input name="creditCard" type="text" bind:value={creditCard} />
  <input type="submit">
</form>