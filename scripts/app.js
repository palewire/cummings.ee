import { text } from 'd3-fetch';
import Poem from './components/Poem.svelte';

async function main() {
  const url = new URL('../_data/tulips/of-nicolette.txt', import.meta.url);
  const data = await text(url);

  const target = document.getElementById('container');
  const props = {
    text: data,
  };
  new Poem({ target, props });
}

main();
