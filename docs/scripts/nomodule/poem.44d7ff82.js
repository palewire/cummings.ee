!(function () {
  'use strict';
  var t =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
      ? self
      : {};
  function n(t) {
    var n = { exports: {} };
    return t(n, n.exports), n.exports;
  }
  var r = function (t) {
      return t && t.Math == Math && t;
    },
    e =
      r('object' == typeof globalThis && globalThis) ||
      r('object' == typeof window && window) ||
      r('object' == typeof self && self) ||
      r('object' == typeof t && t) ||
      (function () {
        return this;
      })() ||
      Function('return this')(),
    o = function (t) {
      try {
        return !!t();
      } catch (n) {
        return !0;
      }
    },
    i = !o(function () {
      return (
        7 !=
        Object.defineProperty({}, 1, {
          get: function () {
            return 7;
          },
        })[1]
      );
    }),
    c = {}.propertyIsEnumerable,
    u = Object.getOwnPropertyDescriptor,
    a = {
      f:
        u && !c.call({ 1: 2 }, 1)
          ? function (t) {
              var n = u(this, t);
              return !!n && n.enumerable;
            }
          : c,
    },
    f = function (t, n) {
      return {
        enumerable: !(1 & t),
        configurable: !(2 & t),
        writable: !(4 & t),
        value: n,
      };
    },
    l = {}.toString,
    s = function (t) {
      return l.call(t).slice(8, -1);
    },
    p = ''.split,
    y = o(function () {
      return !Object('z').propertyIsEnumerable(0);
    })
      ? function (t) {
          return 'String' == s(t) ? p.call(t, '') : Object(t);
        }
      : Object,
    h = function (t) {
      if (null == t) throw TypeError("Can't call method on " + t);
      return t;
    },
    v = function (t) {
      return y(h(t));
    },
    d = function (t) {
      return 'object' == typeof t ? null !== t : 'function' == typeof t;
    },
    g = function (t, n) {
      if (!d(t)) return t;
      var r, e;
      if (n && 'function' == typeof (r = t.toString) && !d((e = r.call(t))))
        return e;
      if ('function' == typeof (r = t.valueOf) && !d((e = r.call(t)))) return e;
      if (!n && 'function' == typeof (r = t.toString) && !d((e = r.call(t))))
        return e;
      throw TypeError("Can't convert object to primitive value");
    },
    m = {}.hasOwnProperty,
    b = function (t, n) {
      return m.call(t, n);
    },
    S = e.document,
    O = d(S) && d(S.createElement),
    w = function (t) {
      return O ? S.createElement(t) : {};
    },
    j =
      !i &&
      !o(function () {
        return (
          7 !=
          Object.defineProperty(w('div'), 'a', {
            get: function () {
              return 7;
            },
          }).a
        );
      }),
    A = Object.getOwnPropertyDescriptor,
    T = {
      f: i
        ? A
        : function (t, n) {
            if (((t = v(t)), (n = g(n, !0)), j))
              try {
                return A(t, n);
              } catch (r) {}
            if (b(t, n)) return f(!a.f.call(t, n), t[n]);
          },
    },
    L = function (t) {
      if (!d(t)) throw TypeError(String(t) + ' is not an object');
      return t;
    },
    E = Object.defineProperty,
    P = {
      f: i
        ? E
        : function (t, n, r) {
            if ((L(t), (n = g(n, !0)), L(r), j))
              try {
                return E(t, n, r);
              } catch (e) {}
            if ('get' in r || 'set' in r)
              throw TypeError('Accessors not supported');
            return 'value' in r && (t[n] = r.value), t;
          },
    },
    _ = i
      ? function (t, n, r) {
          return P.f(t, n, f(1, r));
        }
      : function (t, n, r) {
          return (t[n] = r), t;
        },
    I = function (t, n) {
      try {
        _(e, t, n);
      } catch (r) {
        e[t] = n;
      }
      return n;
    },
    x = '__core-js_shared__',
    M = e[x] || I(x, {}),
    k = Function.toString;
  'function' != typeof M.inspectSource &&
    (M.inspectSource = function (t) {
      return k.call(t);
    });
  var C,
    R,
    F,
    G = M.inspectSource,
    N = e.WeakMap,
    D = 'function' == typeof N && /native code/.test(G(N)),
    V = n(function (t) {
      (t.exports = function (t, n) {
        return M[t] || (M[t] = void 0 !== n ? n : {});
      })('versions', []).push({
        version: '3.10.1',
        mode: 'global',
        copyright: '© 2021 Denis Pushkarev (zloirock.ru)',
      });
    }),
    B = 0,
    z = Math.random(),
    H = function (t) {
      return (
        'Symbol(' +
        String(void 0 === t ? '' : t) +
        ')_' +
        (++B + z).toString(36)
      );
    },
    W = V('keys'),
    U = function (t) {
      return W[t] || (W[t] = H(t));
    },
    Y = {},
    q = e.WeakMap;
  if (D) {
    var K = M.state || (M.state = new q()),
      X = K.get,
      J = K.has,
      Q = K.set;
    (C = function (t, n) {
      return (n.facade = t), Q.call(K, t, n), n;
    }),
      (R = function (t) {
        return X.call(K, t) || {};
      }),
      (F = function (t) {
        return J.call(K, t);
      });
  } else {
    var Z = U('state');
    (Y[Z] = !0),
      (C = function (t, n) {
        return (n.facade = t), _(t, Z, n), n;
      }),
      (R = function (t) {
        return b(t, Z) ? t[Z] : {};
      }),
      (F = function (t) {
        return b(t, Z);
      });
  }
  var $,
    tt,
    nt = {
      set: C,
      get: R,
      has: F,
      enforce: function (t) {
        return F(t) ? R(t) : C(t, {});
      },
      getterFor: function (t) {
        return function (n) {
          var r;
          if (!d(n) || (r = R(n)).type !== t)
            throw TypeError('Incompatible receiver, ' + t + ' required');
          return r;
        };
      },
    },
    rt = n(function (t) {
      var n = nt.get,
        r = nt.enforce,
        o = String(String).split('String');
      (t.exports = function (t, n, i, c) {
        var u,
          a = !!c && !!c.unsafe,
          f = !!c && !!c.enumerable,
          l = !!c && !!c.noTargetGet;
        'function' == typeof i &&
          ('string' != typeof n || b(i, 'name') || _(i, 'name', n),
          (u = r(i)).source ||
            (u.source = o.join('string' == typeof n ? n : ''))),
          t !== e
            ? (a ? !l && t[n] && (f = !0) : delete t[n],
              f ? (t[n] = i) : _(t, n, i))
            : f
            ? (t[n] = i)
            : I(n, i);
      })(Function.prototype, 'toString', function () {
        return ('function' == typeof this && n(this).source) || G(this);
      });
    }),
    et = e,
    ot = function (t) {
      return 'function' == typeof t ? t : void 0;
    },
    it = function (t, n) {
      return arguments.length < 2
        ? ot(et[t]) || ot(e[t])
        : (et[t] && et[t][n]) || (e[t] && e[t][n]);
    },
    ct = Math.ceil,
    ut = Math.floor,
    at = function (t) {
      return isNaN((t = +t)) ? 0 : (t > 0 ? ut : ct)(t);
    },
    ft = Math.min,
    lt = function (t) {
      return t > 0 ? ft(at(t), 9007199254740991) : 0;
    },
    st = Math.max,
    pt = Math.min,
    yt = function (t) {
      return function (n, r, e) {
        var o,
          i = v(n),
          c = lt(i.length),
          u = (function (t, n) {
            var r = at(t);
            return r < 0 ? st(r + n, 0) : pt(r, n);
          })(e, c);
        if (t && r != r) {
          for (; c > u; ) if ((o = i[u++]) != o) return !0;
        } else
          for (; c > u; u++)
            if ((t || u in i) && i[u] === r) return t || u || 0;
        return !t && -1;
      };
    },
    ht = { includes: yt(!0), indexOf: yt(!1) }.indexOf,
    vt = function (t, n) {
      var r,
        e = v(t),
        o = 0,
        i = [];
      for (r in e) !b(Y, r) && b(e, r) && i.push(r);
      for (; n.length > o; ) b(e, (r = n[o++])) && (~ht(i, r) || i.push(r));
      return i;
    },
    dt = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf',
    ],
    gt = dt.concat('length', 'prototype'),
    mt = {
      f:
        Object.getOwnPropertyNames ||
        function (t) {
          return vt(t, gt);
        },
    },
    bt = { f: Object.getOwnPropertySymbols },
    St =
      it('Reflect', 'ownKeys') ||
      function (t) {
        var n = mt.f(L(t)),
          r = bt.f;
        return r ? n.concat(r(t)) : n;
      },
    Ot = function (t, n) {
      for (var r = St(n), e = P.f, o = T.f, i = 0; i < r.length; i++) {
        var c = r[i];
        b(t, c) || e(t, c, o(n, c));
      }
    },
    wt = /#|\.prototype\./,
    jt = function (t, n) {
      var r = Tt[At(t)];
      return r == Et || (r != Lt && ('function' == typeof n ? o(n) : !!n));
    },
    At = (jt.normalize = function (t) {
      return String(t).replace(wt, '.').toLowerCase();
    }),
    Tt = (jt.data = {}),
    Lt = (jt.NATIVE = 'N'),
    Et = (jt.POLYFILL = 'P'),
    Pt = jt,
    _t = T.f,
    It = function (t, n) {
      var r,
        o,
        i,
        c,
        u,
        a = t.target,
        f = t.global,
        l = t.stat;
      if ((r = f ? e : l ? e[a] || I(a, {}) : (e[a] || {}).prototype))
        for (o in n) {
          if (
            ((c = n[o]),
            (i = t.noTargetGet ? (u = _t(r, o)) && u.value : r[o]),
            !Pt(f ? o : a + (l ? '.' : '#') + o, t.forced) && void 0 !== i)
          ) {
            if (typeof c == typeof i) continue;
            Ot(c, i);
          }
          (t.sham || (i && i.sham)) && _(c, 'sham', !0), rt(r, o, c, t);
        }
    },
    xt = function (t, n, r) {
      if (
        ((function (t) {
          if ('function' != typeof t)
            throw TypeError(String(t) + ' is not a function');
        })(t),
        void 0 === n)
      )
        return t;
      switch (r) {
        case 0:
          return function () {
            return t.call(n);
          };
        case 1:
          return function (r) {
            return t.call(n, r);
          };
        case 2:
          return function (r, e) {
            return t.call(n, r, e);
          };
        case 3:
          return function (r, e, o) {
            return t.call(n, r, e, o);
          };
      }
      return function () {
        return t.apply(n, arguments);
      };
    },
    Mt = function (t) {
      return Object(h(t));
    },
    kt =
      Array.isArray ||
      function (t) {
        return 'Array' == s(t);
      },
    Ct = 'process' == s(e.process),
    Rt = it('navigator', 'userAgent') || '',
    Ft = e.process,
    Gt = Ft && Ft.versions,
    Nt = Gt && Gt.v8;
  Nt
    ? (tt = ($ = Nt.split('.'))[0] + $[1])
    : Rt &&
      (!($ = Rt.match(/Edge\/(\d+)/)) || $[1] >= 74) &&
      ($ = Rt.match(/Chrome\/(\d+)/)) &&
      (tt = $[1]);
  var Dt,
    Vt = tt && +tt,
    Bt =
      !!Object.getOwnPropertySymbols &&
      !o(function () {
        return !Symbol.sham && (Ct ? 38 === Vt : Vt > 37 && Vt < 41);
      }),
    zt = Bt && !Symbol.sham && 'symbol' == typeof Symbol.iterator,
    Ht = V('wks'),
    Wt = e.Symbol,
    Ut = zt ? Wt : (Wt && Wt.withoutSetter) || H,
    Yt = function (t) {
      return (
        (b(Ht, t) && (Bt || 'string' == typeof Ht[t])) ||
          (Bt && b(Wt, t) ? (Ht[t] = Wt[t]) : (Ht[t] = Ut('Symbol.' + t))),
        Ht[t]
      );
    },
    qt = Yt('species'),
    Kt = function (t, n) {
      var r;
      return (
        kt(t) &&
          ('function' != typeof (r = t.constructor) ||
          (r !== Array && !kt(r.prototype))
            ? d(r) && null === (r = r[qt]) && (r = void 0)
            : (r = void 0)),
        new (void 0 === r ? Array : r)(0 === n ? 0 : n)
      );
    },
    Xt = [].push,
    Jt = function (t) {
      var n = 1 == t,
        r = 2 == t,
        e = 3 == t,
        o = 4 == t,
        i = 6 == t,
        c = 7 == t,
        u = 5 == t || i;
      return function (a, f, l, s) {
        for (
          var p,
            h,
            v = Mt(a),
            d = y(v),
            g = xt(f, l, 3),
            m = lt(d.length),
            b = 0,
            S = s || Kt,
            O = n ? S(a, m) : r || c ? S(a, 0) : void 0;
          m > b;
          b++
        )
          if ((u || b in d) && ((h = g((p = d[b]), b, v)), t))
            if (n) O[b] = h;
            else if (h)
              switch (t) {
                case 3:
                  return !0;
                case 5:
                  return p;
                case 6:
                  return b;
                case 2:
                  Xt.call(O, p);
              }
            else
              switch (t) {
                case 4:
                  return !1;
                case 7:
                  Xt.call(O, p);
              }
        return i ? -1 : e || o ? o : O;
      };
    },
    Qt = {
      forEach: Jt(0),
      map: Jt(1),
      filter: Jt(2),
      some: Jt(3),
      every: Jt(4),
      find: Jt(5),
      findIndex: Jt(6),
      filterOut: Jt(7),
    },
    Zt =
      Object.keys ||
      function (t) {
        return vt(t, dt);
      },
    $t = i
      ? Object.defineProperties
      : function (t, n) {
          L(t);
          for (var r, e = Zt(n), o = e.length, i = 0; o > i; )
            P.f(t, (r = e[i++]), n[r]);
          return t;
        },
    tn = it('document', 'documentElement'),
    nn = U('IE_PROTO'),
    rn = function () {},
    en = function (t) {
      return '<script>' + t + '</' + 'script>';
    },
    on = function () {
      try {
        Dt = document.domain && new ActiveXObject('htmlfile');
      } catch (e) {}
      var t, n;
      on = Dt
        ? (function (t) {
            t.write(en('')), t.close();
            var n = t.parentWindow.Object;
            return (t = null), n;
          })(Dt)
        : (((n = w('iframe')).style.display = 'none'),
          tn.appendChild(n),
          (n.src = String('javascript:')),
          (t = n.contentWindow.document).open(),
          t.write(en('document.F=Object')),
          t.close(),
          t.F);
      for (var r = dt.length; r--; ) delete on.prototype[dt[r]];
      return on();
    };
  Y[nn] = !0;
  var cn =
      Object.create ||
      function (t, n) {
        var r;
        return (
          null !== t
            ? ((rn.prototype = L(t)),
              (r = new rn()),
              (rn.prototype = null),
              (r[nn] = t))
            : (r = on()),
          void 0 === n ? r : $t(r, n)
        );
      },
    un = Yt('unscopables'),
    an = Array.prototype;
  null == an[un] && P.f(an, un, { configurable: !0, value: cn(null) });
  var fn,
    ln = Qt.find,
    sn = 'find',
    pn = !0;
  sn in [] &&
    Array(1).find(function () {
      pn = !1;
    }),
    It(
      { target: 'Array', proto: !0, forced: pn },
      {
        find: function (t) {
          return ln(this, t, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    (fn = sn),
    (an[un][fn] = !0);
  var yn = function (t, n, r, e) {
      try {
        return e ? n(L(r)[0], r[1]) : n(r);
      } catch (o) {
        throw (
          ((function (t) {
            var n = t.return;
            if (void 0 !== n) L(n.call(t)).value;
          })(t),
          o)
        );
      }
    },
    hn = {},
    vn = Yt('iterator'),
    dn = Array.prototype,
    gn = function (t) {
      return void 0 !== t && (hn.Array === t || dn[vn] === t);
    },
    mn = function (t, n, r) {
      var e = g(n);
      e in t ? P.f(t, e, f(0, r)) : (t[e] = r);
    },
    bn = {};
  bn[Yt('toStringTag')] = 'z';
  var Sn = '[object z]' === String(bn),
    On = Yt('toStringTag'),
    wn =
      'Arguments' ==
      s(
        (function () {
          return arguments;
        })()
      ),
    jn = Sn
      ? s
      : function (t) {
          var n, r, e;
          return void 0 === t
            ? 'Undefined'
            : null === t
            ? 'Null'
            : 'string' ==
              typeof (r = (function (t, n) {
                try {
                  return t[n];
                } catch (r) {}
              })((n = Object(t)), On))
            ? r
            : wn
            ? s(n)
            : 'Object' == (e = s(n)) && 'function' == typeof n.callee
            ? 'Arguments'
            : e;
        },
    An = Yt('iterator'),
    Tn = function (t) {
      if (null != t) return t[An] || t['@@iterator'] || hn[jn(t)];
    },
    Ln = Yt('iterator'),
    En = !1;
  try {
    var Pn = 0,
      _n = {
        next: function () {
          return { done: !!Pn++ };
        },
        return: function () {
          En = !0;
        },
      };
    (_n[Ln] = function () {
      return this;
    }),
      Array.from(_n, function () {
        throw 2;
      });
  } catch (vr) {}
  var In = !(function (t, n) {
    if (!n && !En) return !1;
    var r = !1;
    try {
      var e = {};
      (e[Ln] = function () {
        return {
          next: function () {
            return { done: (r = !0) };
          },
        };
      }),
        t(e);
    } catch (vr) {}
    return r;
  })(function (t) {
    Array.from(t);
  });
  It(
    { target: 'Array', stat: !0, forced: In },
    {
      from: function (t) {
        var n,
          r,
          e,
          o,
          i,
          c,
          u = Mt(t),
          a = 'function' == typeof this ? this : Array,
          f = arguments.length,
          l = f > 1 ? arguments[1] : void 0,
          s = void 0 !== l,
          p = Tn(u),
          y = 0;
        if (
          (s && (l = xt(l, f > 2 ? arguments[2] : void 0, 2)),
          null == p || (a == Array && gn(p)))
        )
          for (r = new a((n = lt(u.length))); n > y; y++)
            (c = s ? l(u[y], y) : u[y]), mn(r, y, c);
        else
          for (
            i = (o = p.call(u)).next, r = new a();
            !(e = i.call(o)).done;
            y++
          )
            (c = s ? yn(o, l, [e.value, y], !0) : e.value), mn(r, y, c);
        return (r.length = y), r;
      },
    }
  );
  var xn,
    Mn,
    kn,
    Cn = function (t) {
      return function (n, r) {
        var e,
          o,
          i = String(h(n)),
          c = at(r),
          u = i.length;
        return c < 0 || c >= u
          ? t
            ? ''
            : void 0
          : (e = i.charCodeAt(c)) < 55296 ||
            e > 56319 ||
            c + 1 === u ||
            (o = i.charCodeAt(c + 1)) < 56320 ||
            o > 57343
          ? t
            ? i.charAt(c)
            : e
          : t
          ? i.slice(c, c + 2)
          : o - 56320 + ((e - 55296) << 10) + 65536;
      };
    },
    Rn = { codeAt: Cn(!1), charAt: Cn(!0) },
    Fn = !o(function () {
      function t() {}
      return (
        (t.prototype.constructor = null),
        Object.getPrototypeOf(new t()) !== t.prototype
      );
    }),
    Gn = U('IE_PROTO'),
    Nn = Object.prototype,
    Dn = Fn
      ? Object.getPrototypeOf
      : function (t) {
          return (
            (t = Mt(t)),
            b(t, Gn)
              ? t[Gn]
              : 'function' == typeof t.constructor && t instanceof t.constructor
              ? t.constructor.prototype
              : t instanceof Object
              ? Nn
              : null
          );
        },
    Vn = Yt('iterator'),
    Bn = !1;
  [].keys &&
    ('next' in (kn = [].keys())
      ? (Mn = Dn(Dn(kn))) !== Object.prototype && (xn = Mn)
      : (Bn = !0)),
    (null == xn ||
      o(function () {
        var t = {};
        return xn[Vn].call(t) !== t;
      })) &&
      (xn = {}),
    b(xn, Vn) ||
      _(xn, Vn, function () {
        return this;
      });
  var zn = { IteratorPrototype: xn, BUGGY_SAFARI_ITERATORS: Bn },
    Hn = P.f,
    Wn = Yt('toStringTag'),
    Un = function (t, n, r) {
      t &&
        !b((t = r ? t : t.prototype), Wn) &&
        Hn(t, Wn, { configurable: !0, value: n });
    },
    Yn = zn.IteratorPrototype,
    qn = function () {
      return this;
    },
    Kn =
      Object.setPrototypeOf ||
      ('__proto__' in {}
        ? (function () {
            var t,
              n = !1,
              r = {};
            try {
              (t = Object.getOwnPropertyDescriptor(
                Object.prototype,
                '__proto__'
              ).set).call(r, []),
                (n = r instanceof Array);
            } catch (vr) {}
            return function (r, e) {
              return (
                L(r),
                (function (t) {
                  if (!d(t) && null !== t)
                    throw TypeError(
                      "Can't set " + String(t) + ' as a prototype'
                    );
                })(e),
                n ? t.call(r, e) : (r.__proto__ = e),
                r
              );
            };
          })()
        : void 0),
    Xn = zn.IteratorPrototype,
    Jn = zn.BUGGY_SAFARI_ITERATORS,
    Qn = Yt('iterator'),
    Zn = 'keys',
    $n = 'values',
    tr = 'entries',
    nr = function () {
      return this;
    },
    rr = Rn.charAt,
    er = 'String Iterator',
    or = nt.set,
    ir = nt.getterFor(er);
  !(function (t, n, r, e, o, i, c) {
    !(function (t, n, r) {
      var e = n + ' Iterator';
      (t.prototype = cn(Yn, { next: f(1, r) })), Un(t, e, !1), (hn[e] = qn);
    })(r, n, e);
    var u,
      a,
      l,
      s = function (t) {
        if (t === o && d) return d;
        if (!Jn && t in h) return h[t];
        switch (t) {
          case Zn:
          case $n:
          case tr:
            return function () {
              return new r(this, t);
            };
        }
        return function () {
          return new r(this);
        };
      },
      p = n + ' Iterator',
      y = !1,
      h = t.prototype,
      v = h[Qn] || h['@@iterator'] || (o && h[o]),
      d = (!Jn && v) || s(o),
      g = ('Array' == n && h.entries) || v;
    if (
      (g &&
        ((u = Dn(g.call(new t()))),
        Xn !== Object.prototype &&
          u.next &&
          (Dn(u) !== Xn &&
            (Kn ? Kn(u, Xn) : 'function' != typeof u[Qn] && _(u, Qn, nr)),
          Un(u, p, !0))),
      o == $n &&
        v &&
        v.name !== $n &&
        ((y = !0),
        (d = function () {
          return v.call(this);
        })),
      h[Qn] !== d && _(h, Qn, d),
      (hn[n] = d),
      o)
    )
      if (((a = { values: s($n), keys: i ? d : s(Zn), entries: s(tr) }), c))
        for (l in a) (Jn || y || !(l in h)) && rt(h, l, a[l]);
      else It({ target: n, proto: !0, forced: Jn || y }, a);
  })(
    String,
    'String',
    function (t) {
      or(this, { type: er, string: String(t), index: 0 });
    },
    function () {
      var t,
        n = ir(this),
        r = n.string,
        e = n.index;
      return e >= r.length
        ? { value: void 0, done: !0 }
        : ((t = rr(r, e)), (n.index += t.length), { value: t, done: !1 });
    }
  );
  var cr,
    ur,
    ar = Qt.forEach,
    fr =
      !!(ur = []['forEach']) &&
      o(function () {
        ur.call(
          null,
          cr ||
            function () {
              throw 1;
            },
          1
        );
      })
        ? [].forEach
        : function (t) {
            return ar(this, t, arguments.length > 1 ? arguments[1] : void 0);
          };
  for (var lr in {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0,
  }) {
    var sr = e[lr],
      pr = sr && sr.prototype;
    if (pr && pr.forEach !== fr)
      try {
        _(pr, 'forEach', fr);
      } catch (vr) {
        pr.forEach = fr;
      }
  }
  var yr = document.getElementById('poem');
  function hr() {
    var t = document.getElementsByName('wrap');
    'no' ==
    Array.from(t).find(function (t) {
      return t.checked;
    }).value
      ? yr.classList.add('nowrap')
      : yr.classList.remove('nowrap');
  }
  document.getElementsByName('wrap').forEach(function (t) {
    t.onclick = hr;
  });
})();
//# sourceMappingURL=poem.44d7ff82.js.map
