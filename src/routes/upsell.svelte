<script>
import { funnel } from '$lib/funnel'
let email = funnel.user.email
funnel.enter()

const yes = async () => {
  await funnel.completeStep({ upsell: true })
}
const no = async () => {
  await funnel.completeStep({ upsell: false })
}
</script>

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

<h1>DevOps Bliss</h1>

<p>Thanks for signing up {email}</p>

<button class="yes" on:click|preventDefault={yes}>
  Buy DevOps Bliss
</button>

<button class="no" on:click|preventDefault={no}>
  No thanks
</button>