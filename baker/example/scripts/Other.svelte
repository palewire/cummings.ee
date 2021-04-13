<script lang="typescript">
  import Inner from './Inner.svelte';

  export let name: string;
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello, {name}!</h1>
<Inner {name} />
