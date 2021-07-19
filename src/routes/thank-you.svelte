<script>
  import { funnel } from '$lib/funnel'
  const email = funnel.user.email
  const creditCard = funnel.creditCard
  funnel.enter()
</script>

<h1>Thanks!</h1>

<ul>
  <li>Email: {email}</li>
  {#if creditCard}<li>Card #: {creditCard}</li>{/if}
</ul>
