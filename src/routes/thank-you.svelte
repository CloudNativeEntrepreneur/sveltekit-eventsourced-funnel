<script>
  import { funnel } from '$lib/funnel'
  const email = funnel.user.email
  const creditCard = funnel.creditCard
  const oto = funnel.oto
  const upsell = funnel.upsell
  const downsell = funnel.downsell
  funnel.enter()
</script>

<h1>Thanks!</h1>

<ul>
  {#if email}<li>Email: {email}</li>{/if}
  {#if creditCard}<li>Card #: {creditCard}</li>{/if}
  {#if oto}<li>OTO: {oto}</li>{/if}
  {#if upsell}<li>upsell: {upsell}</li>{/if}
  {#if downsell}<li>downsell: {downsell}</li>{/if}
</ul>
