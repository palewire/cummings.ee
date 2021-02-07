<script>
import { parsePoem } from '../utils/parsers';

export let text;

const poem = parsePoem(text);
console.log(poem);
</script>

{#each poem as stanza}
<article class="poem">
  <section class="stanza">
    {#each stanza as line}
      <p class="{line.class}">{@html line.text}</p>
    {/each}
  </section>
</article>
{/each}
