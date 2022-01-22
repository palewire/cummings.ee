Object.freeze({
  initialize: function ({
    modulePath: e = '.',
    importFunctionName: t = '__import__',
  } = {}) {
    try {
      self[t] = new Function('u', 'return import(u)');
    } catch (o) {
      const n = new URL(e, location),
        r = (e) => {
          URL.revokeObjectURL(e.src), e.remove();
        };
      (self[t] = (e) =>
        new Promise((o, c) => {
          const a = new URL(e, n);
          if (self[t].moduleMap[a]) return o(self[t].moduleMap[a]);
          const m = new Blob(
              [`import * as m from '${a}';`, `${t}.moduleMap['${a}']=m;`],
              { type: 'text/javascript' }
            ),
            i = Object.assign(document.createElement('script'), {
              type: 'module',
              src: URL.createObjectURL(m),
              onerror() {
                c(new Error(`Failed to import: ${e}`)), r(i);
              },
              onload() {
                o(self[t].moduleMap[a]), r(i);
              },
            });
          document.head.appendChild(i);
        })),
        (self[t].moduleMap = {});
    }
  },
}).initialize({ modulePath: 'scripts/' });
const e = document.getElementById('poem');
function t() {
  const t = document.getElementsByName('wrap');
  'no' == Array.from(t).find((e) => e.checked).value
    ? e.classList.add('nowrap')
    : e.classList.remove('nowrap');
}
document.getElementsByName('wrap').forEach((e) => {
  e.onclick = t;
});
//# sourceMappingURL=poem.4c49fc2f.js.map
