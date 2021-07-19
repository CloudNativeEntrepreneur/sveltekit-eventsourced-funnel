<script>
import { funnel } from '$lib/funnel'
let email = funnel.user.email
funnel.enter()

const upsell = async () => {
  await funnel.completeStep({ upsell: true })
}
</script>

<style>
  button {
    display: block;
  }

  .yes {
    background-color: greenyellow;
  }
</style>

<h1>DevOps Bliss</h1>

<p>Thanks for signing up {email}</p>

<button class="yes" on:click|preventDefault={upsell}>
  Buy DevOps Bliss
</button>

<button>
  No thanks
</button>