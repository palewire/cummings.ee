Object.freeze({
  initialize: function ({
    modulePath: e = '.',
    importFunctionName: o = '__import__',
  } = {}) {
    try {
      self[o] = new Function('u', 'return import(u)');
    } catch (t) {
      const n = new URL(e, location),
        r = (e) => {
          URL.revokeObjectURL(e.src), e.remove();
        };
      (self[o] = (e) =>
        new Promise((t, c) => {
          const a = new URL(e, n);
          if (self[o].moduleMap[a]) return t(self[o].moduleMap[a]);
          const m = new Blob(
              [`import * as m from '${a}';`, `${o}.moduleMap['${a}']=m;`],
              { type: 'text/javascript' }
            ),
            l = Object.assign(document.createElement('script'), {
              type: 'module',
              src: URL.createObjectURL(m),
              onerror() {
                c(new Error(`Failed to import: ${e}`)), r(l);
              },
              onload() {
                t(self[o].moduleMap[a]), r(l);
              },
            });
          document.head.appendChild(l);
        })),
        (self[o].moduleMap = {});
    }
  },
}).initialize({ modulePath: 'scripts/' }),
  console.log('HELLO');
const e = document.getElementById('poem');
function o() {
  const o = document.getElementsByName('wrap');
  'no' == Array.from(o).find((e) => e.checked).value
    ? e.classList.add('nowrap')
    : e.classList.remove('nowrap');
}
document.getElementsByName('wrap').forEach((e) => {
  e.onclick = o;
});
//# sourceMappingURL=poem.c25016ac.js.map
