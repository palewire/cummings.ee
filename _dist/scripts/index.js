import { t as text, P as Poem } from './Poem.chunk.js';

async function main() {
  const url = new URL(
    new URL('assets/i.txt', import.meta.url).href,
    import.meta.url
  );
  const data = await text(url);
  const target = document.getElementById('container');
  const props = {
    text: data,
  };
  new Poem({
    target,
    props,
  });
}

main();
//# sourceMappingURL=index.js.map
