function t(t) {
  if (!t.ok) throw new Error(t.status + ' ' + t.statusText);
  return t.text();
}
function e(e, n) {
  return fetch(e, n).then(t);
}
function n() {}
function o(t) {
  return t();
}
function r() {
  return Object.create(null);
}
function c(t) {
  t.forEach(o);
}
function l(t) {
  return 'function' == typeof t;
}
function u(t, e) {
  return t != t
    ? e == e
    : t !== e || (t && 'object' == typeof t) || 'function' == typeof t;
}
function s(t, e) {
  t.appendChild(e);
}
function i(t, e, n) {
  t.insertBefore(e, n || null);
}
function f(t) {
  t.parentNode.removeChild(t);
}
function a(t, e) {
  for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e);
}
function p(t) {
  return document.createElement(t);
}
function d(t) {
  return document.createTextNode(t);
}
function h(t, e, n) {
  null == n
    ? t.removeAttribute(e)
    : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
let m;
function g(t) {
  m = t;
}
Object.freeze({
  initialize: function ({
    modulePath: t = '.',
    importFunctionName: e = '__import__',
  } = {}) {
    try {
      self[e] = new Function('u', 'return import(u)');
    } catch (n) {
      const o = new URL(t, location),
        r = (t) => {
          URL.revokeObjectURL(t.src), t.remove();
        };
      (self[e] = (t) =>
        new Promise((n, c) => {
          const l = new URL(t, o);
          if (self[e].moduleMap[l]) return n(self[e].moduleMap[l]);
          const u = new Blob(
              [`import * as m from '${l}';`, `${e}.moduleMap['${l}']=m;`],
              { type: 'text/javascript' }
            ),
            s = Object.assign(document.createElement('script'), {
              type: 'module',
              src: URL.createObjectURL(u),
              onerror() {
                c(new Error(`Failed to import: ${t}`)), r(s);
              },
              onload() {
                n(self[e].moduleMap[l]), r(s);
              },
            });
          document.head.appendChild(s);
        })),
        (self[e].moduleMap = {});
    }
  },
}).initialize({ modulePath: 'scripts/' });
const $ = [],
  b = [],
  x = [],
  _ = [],
  y = Promise.resolve();
let w = !1;
function k(t) {
  x.push(t);
}
let E = !1;
const j = new Set();
function v() {
  if (!E) {
    E = !0;
    do {
      for (let t = 0; t < $.length; t += 1) {
        const e = $[t];
        g(e), L(e.$$);
      }
      for (g(null), $.length = 0; b.length; ) b.pop()();
      for (let t = 0; t < x.length; t += 1) {
        const e = x[t];
        j.has(e) || (j.add(e), e());
      }
      x.length = 0;
    } while ($.length);
    for (; _.length; ) _.pop()();
    (w = !1), (E = !1), j.clear();
  }
}
function L(t) {
  if (null !== t.fragment) {
    t.update(), c(t.before_update);
    const e = t.dirty;
    (t.dirty = [-1]),
      t.fragment && t.fragment.p(t.ctx, e),
      t.after_update.forEach(k);
  }
}
const M = new Set();
function O(t, e) {
  -1 === t.$$.dirty[0] &&
    ($.push(t), w || ((w = !0), y.then(v)), t.$$.dirty.fill(0)),
    (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
}
function R(t, e, u, s, i, a, p = [-1]) {
  const d = m;
  g(t);
  const h = (t.$$ = {
    fragment: null,
    ctx: null,
    props: a,
    update: n,
    not_equal: i,
    bound: r(),
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(d ? d.$$.context : []),
    callbacks: r(),
    dirty: p,
    skip_bound: !1,
  });
  let $ = !1;
  if (
    ((h.ctx = u
      ? u(t, e.props || {}, (e, n, ...o) => {
          const r = o.length ? o[0] : n;
          return (
            h.ctx &&
              i(h.ctx[e], (h.ctx[e] = r)) &&
              (!h.skip_bound && h.bound[e] && h.bound[e](r), $ && O(t, e)),
            n
          );
        })
      : []),
    h.update(),
    ($ = !0),
    c(h.before_update),
    (h.fragment = !!s && s(h.ctx)),
    e.target)
  ) {
    if (e.hydrate) {
      const t = (function (t) {
        return Array.from(t.childNodes);
      })(e.target);
      h.fragment && h.fragment.l(t), t.forEach(f);
    } else h.fragment && h.fragment.c();
    e.intro && (b = t.$$.fragment) && b.i && (M.delete(b), b.i(x)),
      (function (t, e, n) {
        const {
          fragment: r,
          on_mount: u,
          on_destroy: s,
          after_update: i,
        } = t.$$;
        r && r.m(e, n),
          k(() => {
            const e = u.map(o).filter(l);
            s ? s.push(...e) : c(e), (t.$$.on_mount = []);
          }),
          i.forEach(k);
      })(t, e.target, e.anchor),
      v();
  }
  var b, x;
  g(d);
}
function U(t) {
  return t.startsWith('# ') ? 'title' : 'line';
}
function N(t) {
  return t.replace('# ', '').replace(' ', '&nbsp;');
}
function P(t, e, n) {
  const o = t.slice();
  return (o[2] = e[n]), o;
}
function z(t, e, n) {
  const o = t.slice();
  return (o[5] = e[n]), o;
}
function A(t) {
  let e,
    o = t[5].text + '';
  return {
    c() {
      (e = p('p')), h(e, 'class', t[5].class);
    },
    m(t, n) {
      i(t, e, n), (e.innerHTML = o);
    },
    p: n,
    d(t) {
      t && f(e);
    },
  };
}
function C(t) {
  let e,
    n,
    o,
    r = t[2],
    c = [];
  for (let l = 0; l < r.length; l += 1) c[l] = A(z(t, r, l));
  return {
    c() {
      (e = p('article')), (n = p('section'));
      for (let t = 0; t < c.length; t += 1) c[t].c();
      (o = d(' ')), h(n, 'class', 'stanza'), h(e, 'class', 'poem');
    },
    m(t, r) {
      i(t, e, r), s(e, n);
      for (let e = 0; e < c.length; e += 1) c[e].m(n, null);
      s(e, o);
    },
    p(t, e) {
      if (1 & e) {
        let o;
        for (r = t[2], o = 0; o < r.length; o += 1) {
          const l = z(t, r, o);
          c[o] ? c[o].p(l, e) : ((c[o] = A(l)), c[o].c(), c[o].m(n, null));
        }
        for (; o < c.length; o += 1) c[o].d(1);
        c.length = r.length;
      }
    },
    d(t) {
      t && f(e), a(c, t);
    },
  };
}
function F(t) {
  let e,
    o = t[0],
    r = [];
  for (let n = 0; n < o.length; n += 1) r[n] = C(P(t, o, n));
  return {
    c() {
      for (let t = 0; t < r.length; t += 1) r[t].c();
      e = d('');
    },
    m(t, n) {
      for (let e = 0; e < r.length; e += 1) r[e].m(t, n);
      i(t, e, n);
    },
    p(t, [n]) {
      if (1 & n) {
        let c;
        for (o = t[0], c = 0; c < o.length; c += 1) {
          const l = P(t, o, c);
          r[c]
            ? r[c].p(l, n)
            : ((r[c] = C(l)), r[c].c(), r[c].m(e.parentNode, e));
        }
        for (; c < r.length; c += 1) r[c].d(1);
        r.length = o.length;
      }
    },
    i: n,
    o: n,
    d(t) {
      a(r, t), t && f(e);
    },
  };
}
function T(t, e, n) {
  let { text: o } = e;
  const r = (function (t) {
    const e = t.split(/\r?\n/);
    let n = [],
      o = [];
    return (
      e.forEach((t) => {
        0 == t.trim().length
          ? (n.push(o), (o = []))
          : o.push({ text: N(t), class: U(t) });
      }),
      n
    );
  })(o);
  return (
    console.log(r),
    (t.$$set = (t) => {
      'text' in t && n(1, (o = t.text));
    }),
    [r, o]
  );
}
class B extends class {
  $destroy() {
    !(function (t, e) {
      const n = t.$$;
      null !== n.fragment &&
        (c(n.on_destroy),
        n.fragment && n.fragment.d(e),
        (n.on_destroy = n.fragment = null),
        (n.ctx = []));
    })(this, 1),
      (this.$destroy = n);
  }
  $on(t, e) {
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return (
      n.push(e),
      () => {
        const t = n.indexOf(e);
        -1 !== t && n.splice(t, 1);
      }
    );
  }
  $set(t) {
    var e;
    this.$$set &&
      ((e = t), 0 !== Object.keys(e).length) &&
      ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
  }
} {
  constructor(t) {
    super(), R(this, t, T, F, u, { text: 1 });
  }
}
export { B as P, e as t };
//# sourceMappingURL=Poem.a30b3db3.chunk.js.map
