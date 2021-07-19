<script>
import { funnel } from '$lib/funnel'
let email = funnel.user.email
funnel.enter()

const downsell = async () => {
  await funnel.completeStep({ downsell: true })
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

<h1>Downsell</h1>

<p>How about this instead?</p>

<button class="yes" on:click|preventDefault={downsell}>
  Buy DevOps Bliss
</button>

<button>
  No thanks
</button>