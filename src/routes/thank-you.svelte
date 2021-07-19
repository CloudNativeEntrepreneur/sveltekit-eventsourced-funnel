<script>
import { funnel } from '$lib/funnel'
let email = funnel.user.email
let creditCard = funnel.creditCard
funnel.enter()

const submit = async () => {
  console.log('submitted', arguments)
  await funnel.completeStep({ email, creditCard })
}
</script>

<h1>Thanks!</h1>

<ul>
  <li>Email: {email}</li>
  {#if creditCard}<li>Card #: {creditCard}</li>{/if}
</ul>