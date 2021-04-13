<script>
  import { square } from './utils';

  export let text;
  export let value;
</script>

<style>
  p {
    color: pink;
  }
</style>

<p>{text} = {square(value)}</p>
