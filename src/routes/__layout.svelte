<script>
  import '../app.postcss'
  import { funnel } from '$lib/funnel'

  if (!funnel.entered) {
    funnel.enter()
  }
</script>

<slot />
