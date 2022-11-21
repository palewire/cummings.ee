var e = Object.freeze({
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
        new Promise((o, a) => {
          const c = new URL(e, n);
          if (self[t].moduleMap[c]) return o(self[t].moduleMap[c]);
          const m = new Blob(
              [`import * as m from '${c}';`, `${t}.moduleMap['${c}']=m;`],
              { type: 'text/javascript' }
            ),
            i = Object.assign(document.createElement('script'), {
              type: 'module',
              src: URL.createObjectURL(m),
              onerror() {
                a(new Error(`Failed to import: ${e}`)), r(i);
              },
              onload() {
                o(self[t].moduleMap[c]), r(i);
              },
            });
          document.head.appendChild(i);
        })),
        (self[t].moduleMap = {});
    }
  },
});
e.initialize({ modulePath: 'scripts/' });
const t = document.getElementById('poem');
function o() {
  const e = document.getElementsByName('wrap');
  'no' == Array.from(e).find((e) => e.checked).value
    ? t.classList.add('nowrap')
    : t.classList.remove('nowrap');
}
document.getElementsByName('wrap').forEach((e) => {
  e.onclick = o;
});
//# sourceMappingURL=poem.4c49fc2f.js.map
