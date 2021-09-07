<script>
  import {setContext} from 'svelte';
  import {writable} from 'svelte/store';

  export let Component;

  export let stores = {
    page: writable({ path: '/' }),
    navigating: writable(null),
    session: writable(null),
  };

  setContext('__svelte__', stores);
</script>

<svelte:component this={Component} />