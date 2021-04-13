import App from './Other.svelte';

const map: Map<string, string> = new Map();
const resolved = Promise.resolve();

console.log(map, resolved);

new App({
  target: document.querySelector('#svelte'),
  props: { name: 'Svelte' },
});
