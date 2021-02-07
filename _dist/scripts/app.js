!(function () {
  function e(e) {
    let t = '',
      s = '',
      o = e.indexOf('#');
    o >= 0 && ((t = e.slice(o)), (e = e.slice(0, o)));
    const i = e.indexOf('??');
    return (
      i >= 0
        ? i + 1 !== e.lastIndexOf('?') && (o = e.lastIndexOf('?'))
        : (o = e.indexOf('?')),
      o >= 0 && ((s = e.slice(o)), (e = e.slice(0, o))),
      { url: e, params: s, hash: t }
    );
  }
  function t(t) {
    if (!t) return '';
    let s;
    return (
      ({ url: t } = e(t)),
      (s =
        0 === t.indexOf('file://')
          ? t.replace(new RegExp('^file://(localhost)?'), '')
          : t.replace(new RegExp('^([^:]+:)?//([^:/]+)(:\\d*)?/'), '/')),
      decodeURIComponent(s)
    );
  }
  function s(e, t) {
    if (
      (e = e.replace(/^\/+/, '').toLowerCase()) ===
      (t = t.replace(/^\/+/, '').toLowerCase())
    )
      return 1e4;
    const s = e.split(/\/|\\/).reverse(),
      o = t.split(/\/|\\/).reverse(),
      i = Math.min(s.length, o.length);
    let r = 0;
    for (; r < i && s[r] === o[r]; ) ++r;
    return r;
  }
  function o(e, t) {
    return s(e, t) > 0;
  }
  const i = [
      { selector: 'background', styleNames: ['backgroundImage'] },
      {
        selector: 'border',
        styleNames: ['borderImage', 'webkitBorderImage', 'MozBorderImage'],
      },
    ],
    r = { stylesheetReloadTimeout: 15e3 };
  class n {
    constructor(e) {
      (this.func = e),
        (this.running = !1),
        (this.id = null),
        (this._handler = () => (
          (this.running = !1), (this.id = null), this.func()
        ));
    }
    start(e) {
      this.running && clearTimeout(this.id),
        (this.id = setTimeout(this._handler, e)),
        (this.running = !0);
    }
    stop() {
      this.running &&
        (clearTimeout(this.id), (this.running = !1), (this.id = null));
    }
  }
  n.start = (e, t) => setTimeout(t, e);
  var l = '[MINI SYNC]',
    a = new (class {
      constructor(e, t, s) {
        (this.window = e),
          (this.console = t),
          (this.Timer = s),
          (this.document = this.window.document),
          (this.importCacheWaitPeriod = 200),
          (this.plugins = []);
      }
      addPlugin(e) {
        return this.plugins.push(e);
      }
      analyze(e) {}
      reload(e, t = {}) {
        if (
          ((this.options = { ...r, ...t }),
          this.options.pluginOrder && this.options.pluginOrder.length)
        )
          this.runPluginsByOrder(e, t);
        else {
          for (const s of Array.from(this.plugins))
            if (s.reload && s.reload(e, t)) return;
          if (
            !(
              t.liveCSS &&
              e.match(/\.css(?:\.map)?$/i) &&
              this.reloadStylesheet(e)
            )
          )
            if (t.liveImg && e.match(/\.(jpe?g|png|gif)$/i))
              this.reloadImages(e);
            else {
              if (!t.isChromeExtension) return this.reloadPage();
              this.reloadChromeExtension();
            }
        }
      }
      runPluginsByOrder(e, t) {
        t.pluginOrder.some(
          (s) =>
            !!(
              'css' === s &&
              t.liveCSS &&
              e.match(/\.css(?:\.map)?$/i) &&
              this.reloadStylesheet(e)
            ) ||
            ('img' === s && t.liveImg && e.match(/\.(jpe?g|png|gif)$/i)
              ? (this.reloadImages(e), !0)
              : 'extension' === s && t.isChromeExtension
              ? (this.reloadChromeExtension(), !0)
              : 'others' === s
              ? (this.reloadPage(), !0)
              : 'external' === s
              ? this.plugins.some((s) => {
                  if (s.reload && s.reload(e, t)) return !0;
                })
              : this.plugins
                  .filter((e) => e.constructor.identifier === s)
                  .some((s) => {
                    if (s.reload && s.reload(e, t)) return !0;
                  }))
        );
      }
      reloadPage() {
        return this.window.document.location.reload();
      }
      reloadChromeExtension() {
        return this.window.chrome.runtime.reload();
      }
      reloadImages(e) {
        let s;
        const r = this.generateUniqueString();
        for (s of Array.from(this.document.images))
          o(e, t(s.src)) && (s.src = this.generateCacheBustUrl(s.src, r));
        if (this.document.querySelectorAll)
          for (const { selector: t, styleNames: o } of i)
            for (s of Array.from(
              this.document.querySelectorAll(`[style*=${t}]`)
            ))
              this.reloadStyleImages(s.style, o, e, r);
        if (this.document.styleSheets)
          return Array.from(this.document.styleSheets).map((t) =>
            this.reloadStylesheetImages(t, e, r)
          );
      }
      reloadStylesheetImages(e, t, s) {
        let o;
        try {
          o = (e || {}).cssRules;
        } catch (e) {}
        if (o)
          for (const e of Array.from(o))
            switch (e.type) {
              case CSSRule.IMPORT_RULE:
                this.reloadStylesheetImages(e.styleSheet, t, s);
                break;
              case CSSRule.STYLE_RULE:
                for (const { styleNames: o } of i)
                  this.reloadStyleImages(e.style, o, t, s);
                break;
              case CSSRule.MEDIA_RULE:
                this.reloadStylesheetImages(e, t, s);
            }
      }
      reloadStyleImages(e, s, i, r) {
        for (const n of s) {
          const s = e[n];
          if ('string' == typeof s) {
            const l = s.replace(new RegExp('\\burl\\s*\\(([^)]*)\\)'), (e, s) =>
              o(i, t(s)) ? `url(${this.generateCacheBustUrl(s, r)})` : e
            );
            l !== s && (e[n] = l);
          }
        }
      }
      reloadStylesheet(e) {
        const o = this.options || r;
        let i, n;
        const l = (() => {
            const e = [];
            for (n of Array.from(this.document.getElementsByTagName('link')))
              n.rel.match(/^stylesheet$/i) &&
                !n.__LiveReload_pendingRemoval &&
                e.push(n);
            return e;
          })(),
          a = [];
        for (i of Array.from(this.document.getElementsByTagName('style')))
          i.sheet && this.collectImportedStylesheets(i, i.sheet, a);
        for (n of Array.from(l)) this.collectImportedStylesheets(n, n.sheet, a);
        if (this.window.StyleFix && this.document.querySelectorAll)
          for (i of Array.from(
            this.document.querySelectorAll('style[data-href]')
          ))
            l.push(i);
        this.console.log(
          `LiveReload found ${l.length} LINKed stylesheets, ${a.length} @imported stylesheets`
        );
        const h = (function (e, t, o = (e) => e) {
          let i,
            r = { score: 0 };
          for (const n of t)
            (i = s(e, o(n))), i > r.score && (r = { object: n, score: i });
          return 0 === r.score ? null : r;
        })(e, l.concat(a), (e) => t(this.linkHref(e)));
        if (h)
          h.object.rule
            ? (this.console.log(
                'LiveReload is reloading imported stylesheet: ' + h.object.href
              ),
              this.reattachImportedRule(h.object))
            : (this.console.log(
                'LiveReload is reloading stylesheet: ' + this.linkHref(h.object)
              ),
              this.reattachStylesheetLink(h.object));
        else if (o.reloadMissingCSS)
          for (n of (this.console.log(
            `LiveReload will reload all stylesheets because path '${e}' did not match any specific one. To disable this behavior, set 'options.reloadMissingCSS' to 'false'.`
          ),
          Array.from(l)))
            this.reattachStylesheetLink(n);
        else
          this.console.log(
            `LiveReload will not reload path '${e}' because the stylesheet was not found on the page and 'options.reloadMissingCSS' was set to 'false'.`
          );
        return !0;
      }
      collectImportedStylesheets(e, t, s) {
        let o;
        try {
          o = (t || {}).cssRules;
        } catch (e) {}
        if (o && o.length)
          for (let t = 0; t < o.length; t++) {
            const i = o[t];
            switch (i.type) {
              case CSSRule.CHARSET_RULE:
                continue;
              case CSSRule.IMPORT_RULE:
                s.push({ link: e, rule: i, index: t, href: i.href }),
                  this.collectImportedStylesheets(e, i.styleSheet, s);
            }
          }
      }
      waitUntilCssLoads(e, t) {
        const s = this.options || r;
        let o = !1;
        const i = () => {
          if (!o) return (o = !0), t();
        };
        if (
          ((e.onload = () => (
            this.console.log(
              'LiveReload: the new stylesheet has finished loading'
            ),
            (this.knownToSupportCssOnLoad = !0),
            i()
          )),
          !this.knownToSupportCssOnLoad)
        ) {
          let t;
          (t = () =>
            e.sheet
              ? (this.console.log(
                  'LiveReload is polling until the new CSS finishes loading...'
                ),
                i())
              : this.Timer.start(50, t))();
        }
        return this.Timer.start(s.stylesheetReloadTimeout, i);
      }
      linkHref(e) {
        return e.href || (e.getAttribute && e.getAttribute('data-href'));
      }
      reattachStylesheetLink(e) {
        let t;
        if (e.__LiveReload_pendingRemoval) return;
        (e.__LiveReload_pendingRemoval = !0),
          'STYLE' === e.tagName
            ? ((t = this.document.createElement('link')),
              (t.rel = 'stylesheet'),
              (t.media = e.media),
              (t.disabled = e.disabled))
            : (t = e.cloneNode(!1)),
          (t.href = this.generateCacheBustUrl(this.linkHref(e)));
        const s = e.parentNode;
        return (
          s.lastChild === e
            ? s.appendChild(t)
            : s.insertBefore(t, e.nextSibling),
          this.waitUntilCssLoads(t, () => {
            let s;
            return (
              (s = /AppleWebKit/.test(this.window.navigator.userAgent)
                ? 5
                : 200),
              this.Timer.start(s, () => {
                if (e.parentNode)
                  return (
                    e.parentNode.removeChild(e),
                    (t.onreadystatechange = null),
                    this.window.StyleFix ? this.window.StyleFix.link(t) : void 0
                  );
              })
            );
          })
        );
      }
      reattachImportedRule({ rule: e, index: t, link: s }) {
        const o = e.parentStyleSheet,
          i = this.generateCacheBustUrl(e.href),
          r = e.media.length ? [].join.call(e.media, ', ') : '',
          n = `@import url("${i}") ${r};`;
        e.__LiveReload_newHref = i;
        const l = this.document.createElement('link');
        return (
          (l.rel = 'stylesheet'),
          (l.href = i),
          (l.__LiveReload_pendingRemoval = !0),
          s.parentNode && s.parentNode.insertBefore(l, s),
          this.Timer.start(this.importCacheWaitPeriod, () => {
            if (
              (l.parentNode && l.parentNode.removeChild(l),
              e.__LiveReload_newHref === i)
            )
              return (
                o.insertRule(n, t),
                o.deleteRule(t + 1),
                ((e = o.cssRules[t]).__LiveReload_newHref = i),
                this.Timer.start(this.importCacheWaitPeriod, () => {
                  if (e.__LiveReload_newHref === i)
                    return o.insertRule(n, t), o.deleteRule(t + 1);
                })
              );
          })
        );
      }
      generateUniqueString() {
        return 'livereload=' + Date.now();
      }
      generateCacheBustUrl(t, s) {
        const o = this.options || r;
        let i, n;
        if (
          (s || (s = this.generateUniqueString()),
          ({ url: t, hash: i, params: n } = e(t)),
          o.overrideURL && t.indexOf(o.serverURL) < 0)
        ) {
          const e = t;
          (t = o.serverURL + o.overrideURL + '?url=' + encodeURIComponent(t)),
            this.console.log(
              `LiveReload is overriding source URL ${e} with ${t}`
            );
        }
        let l = n.replace(/(\?|&)livereload=(\d+)/, (e, t) => `${t}${s}`);
        return (
          l === n && (l = 0 === n.length ? '?' + s : `${n}&${s}`), t + l + i
        );
      }
    })(window, { log: function () {} }, n),
    h = { liveCSS: !0, liveImg: !0 };
  !(function e() {
    var t = new EventSource(
      'http://' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/__mini_sync__'
    );
    t.addEventListener('open', function () {
      console.info('%s Development server has connected.', l);
    }),
      t.addEventListener('error', function (s) {
        var o = t.readyState,
          i = o === EventSource.CONNECTING,
          r = o === EventSource.CLOSED;
        i || r
          ? (console.info('%s Lost connection. Trying to reconnect...', l),
            r && (t.close(), setTimeout(e, 1e4)))
          : console.error(s);
      }),
      t.addEventListener('reload', function (e) {
        var t = JSON.parse(e.data).file || '';
        t
          ? console.info('%s Reloading "%s".', l, t)
          : console.info('%s Reloading entire page.', l),
          a.reload(t, h);
      });
  })();
})();

function e({ modulePath: e = '.', importFunctionName: t = '__import__' } = {}) {
  try {
    self[t] = new Function('u', 'return import(u)');
  } catch (o) {
    const r = new URL(e, location),
      n = (e) => {
        URL.revokeObjectURL(e.src), e.remove();
      };
    (self[t] = (e) =>
      new Promise((o, a) => {
        const c = new URL(e, r);
        if (self[t].moduleMap[c]) return o(self[t].moduleMap[c]);
        const l = new Blob(
            [`import * as m from '${c}';`, `${t}.moduleMap['${c}']=m;`],
            { type: 'text/javascript' }
          ),
          m = Object.assign(document.createElement('script'), {
            type: 'module',
            src: URL.createObjectURL(l),
            onerror() {
              a(new Error(`Failed to import: ${e}`)), n(m);
            },
            onload() {
              o(self[t].moduleMap[c]), n(m);
            },
          });
        document.head.appendChild(m);
      })),
      (self[t].moduleMap = {});
  }
}
var t = Object.freeze({ initialize: e });

// This needs to be done before any dynamic imports are used
t.initialize({ modulePath: 'scripts/' });

function responseText(response) {
  if (!response.ok)
    throw new Error(response.status + ' ' + response.statusText);
  return response.text();
}

function text(input, init) {
  return fetch(input, init).then(responseText);
}

function noop() {}
function add_location(element, file, line, column, char) {
  element.__svelte_meta = {
    loc: { file, line, column, char },
  };
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === 'function';
}
function safe_not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}

function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text$1(data) {
  return document.createTextNode(data);
}
function space() {
  return text$1(' ');
}
function empty() {
  return text$1('');
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element) {
  return Array.from(element.childNodes);
}
function custom_event(type, detail) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, false, false, detail);
  return e;
}

let current_component;
function set_current_component(component) {
  current_component = component;
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
  if (flushing) return;
  flushing = true;
  do {
    // first, call beforeUpdate functions
    // and update components
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}

const globals =
  typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
    ? globalThis
    : global;
function mount_component(component, target, anchor) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  // onMount happens before the initial afterUpdate
  add_render_callback(() => {
    const new_on_destroy = on_mount.map(run).filter(is_function);
    if (on_destroy) {
      on_destroy.push(...new_on_destroy);
    } else {
      // Edge case - component was destroyed immediately,
      // most likely as a result of a binding initialising
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}
function init(
  component,
  options,
  instance,
  create_fragment,
  not_equal,
  props,
  dirty = [-1]
) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = (component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
  });
  let ready = false;
  $$.ctx = instance
    ? instance(component, options.props || {}, (i, ret, ...rest) => {
        const value = rest.length ? rest[0] : ret;
        if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
          if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
          if (ready) make_dirty(component, i);
        }
        return ret;
      })
    : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  // `false` as a special case of no DOM component
  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}

function dispatch_dev(type, detail) {
  document.dispatchEvent(
    custom_event(type, Object.assign({ version: '3.32.1' }, detail))
  );
}
function append_dev(target, node) {
  dispatch_dev('SvelteDOMInsert', { target, node });
  append(target, node);
}
function insert_dev(target, node, anchor) {
  dispatch_dev('SvelteDOMInsert', { target, node, anchor });
  insert(target, node, anchor);
}
function detach_dev(node) {
  dispatch_dev('SvelteDOMRemove', { node });
  detach(node);
}
function attr_dev(node, attribute, value) {
  attr(node, attribute, value);
  if (value == null)
    dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
  else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function validate_each_argument(arg) {
  if (
    typeof arg !== 'string' &&
    !(arg && typeof arg === 'object' && 'length' in arg)
  ) {
    let msg = '{#each} only iterates over array-like objects.';
    if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
      msg += ' You can use a spread to convert this iterable into an array.';
    }
    throw new Error(msg);
  }
}
function validate_slots(name, slot, keys) {
  for (const slot_key of Object.keys(slot)) {
    if (!~keys.indexOf(slot_key)) {
      console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
    }
  }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
  constructor(options) {
    if (!options || (!options.target && !options.$$inline)) {
      throw new Error("'target' is a required option");
    }
    super();
  }
  $destroy() {
    super.$destroy();
    this.$destroy = () => {
      console.warn('Component was already destroyed'); // eslint-disable-line no-console
    };
  }
  $capture_state() {}
  $inject_state() {}
}

function parsePoem(text) {
  const lines = text.split(/\r?\n/);
  let stanzaList = [];
  let thisStanza = [];
  lines.forEach((l) => {
    if (l.trim().length == 0) {
      stanzaList.push(thisStanza);
      thisStanza = [];
    } else {
      thisStanza.push({
        text: parseText(l),
        class: parseClass(l),
      });
    }
  });
  return stanzaList;
}
function parseClass(text) {
  if (text.startsWith('# ')) {
    return 'title';
  } else {
    return 'line';
  }
}
function parseText(text) {
  return text.replace('# ', '').replace(' ', '&nbsp;');
}

/* scripts/components/Poem.svelte generated by Svelte v3.32.1 */

const { console: console_1 } = globals;
const file = 'scripts/components/Poem.svelte';

function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  return child_ctx;
}

function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i];
  return child_ctx;
}

// (13:4) {#each stanza as line}
function create_each_block_1(ctx) {
  let p;
  let raw_value = /*line*/ ctx[5].text + '';

  const block = {
    c: function create() {
      p = element('p');
      attr_dev(p, 'class', /*line*/ ctx[5].class);
      add_location(p, file, 13, 6, 240);
    },
    m: function mount(target, anchor) {
      insert_dev(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(p);
    },
  };

  dispatch_dev('SvelteRegisterBlock', {
    block,
    id: create_each_block_1.name,
    type: 'each',
    source: '(13:4) {#each stanza as line}',
    ctx,
  });

  return block;
}

// (10:0) {#each poem as stanza}
function create_each_block(ctx) {
  let article;
  let section;
  let t;
  let each_value_1 = /*stanza*/ ctx[2];
  validate_each_argument(each_value_1);
  let each_blocks = [];

  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(
      get_each_context_1(ctx, each_value_1, i)
    );
  }

  const block = {
    c: function create() {
      article = element('article');
      section = element('section');

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      t = space();
      attr_dev(section, 'class', 'stanza');
      add_location(section, file, 11, 2, 182);
      attr_dev(article, 'class', 'poem');
      add_location(article, file, 10, 0, 157);
    },
    m: function mount(target, anchor) {
      insert_dev(target, article, anchor);
      append_dev(article, section);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(section, null);
      }

      append_dev(article, t);
    },
    p: function update(ctx, dirty) {
      if (dirty & /*poem*/ 1) {
        each_value_1 = /*stanza*/ ctx[2];
        validate_each_argument(each_value_1);
        let i;

        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx, each_value_1, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(section, null);
          }
        }

        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }

        each_blocks.length = each_value_1.length;
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(article);
      destroy_each(each_blocks, detaching);
    },
  };

  dispatch_dev('SvelteRegisterBlock', {
    block,
    id: create_each_block.name,
    type: 'each',
    source: '(10:0) {#each poem as stanza}',
    ctx,
  });

  return block;
}

function create_fragment(ctx) {
  let each_1_anchor;
  let each_value = /*poem*/ ctx[0];
  validate_each_argument(each_value);
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  const block = {
    c: function create() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      each_1_anchor = empty();
    },
    l: function claim(nodes) {
      throw new Error(
        'options.hydrate only works if the component was compiled with the `hydratable: true` option'
      );
    },
    m: function mount(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
    },
    p: function update(ctx, [dirty]) {
      if (dirty & /*poem*/ 1) {
        each_value = /*poem*/ ctx[0];
        validate_each_argument(each_value);
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }

        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    },
  };

  dispatch_dev('SvelteRegisterBlock', {
    block,
    id: create_fragment.name,
    type: 'component',
    source: '',
    ctx,
  });

  return block;
}

function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots('Poem', slots, []);
  let { text } = $$props;
  const poem = parsePoem(text);
  console.log(poem);
  const writable_props = ['text'];

  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
      console_1.warn(`<Poem> was created with unknown prop '${key}'`);
  });

  $$self.$$set = ($$props) => {
    if ('text' in $$props) $$invalidate(1, (text = $$props.text));
  };

  $$self.$capture_state = () => ({ parsePoem, text, poem });

  $$self.$inject_state = ($$props) => {
    if ('text' in $$props) $$invalidate(1, (text = $$props.text));
  };

  if ($$props && '$$inject' in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [poem, text];
}

class Poem extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, { text: 1 });

    dispatch_dev('SvelteRegisterComponent', {
      component: this,
      tagName: 'Poem',
      options,
      id: create_fragment.name,
    });

    const { ctx } = this.$$;
    const props = options.props || {};

    if (/*text*/ ctx[1] === undefined && !('text' in props)) {
      console_1.warn("<Poem> was created without expected prop 'text'");
    }
  }

  get text() {
    throw new Error(
      "<Poem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
    );
  }

  set text(value) {
    throw new Error(
      "<Poem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
    );
  }
}

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
//# sourceMappingURL=app.js.map
