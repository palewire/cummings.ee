/** @typedef {import("rollup").Plugin} RollupPlugin */

// packages
const { createFilter } = require('@rollup/pluginutils');

function cssPlugin() {
  const filter = createFilter('**/*.css');
  const styles = new Map();
  const order = new Set();

  return /** @type {RollupPlugin} */ ({
    name: 'css-plugin',

    transform(code, id) {
      // we only care about CSS files
      if (!filter(id)) return;

      // track the order of CSS found
      order.add(id);

      // track the rendered styles for output later
      styles.set(id, code);

      // we don't want Rollup to attempt to remove this
      return { code: '', moduleSideEffects: 'no-treeshake' };
    },

    generateBundle(_, bundle) {
      // first we build a mapping of Svelte components to output CSS
      const components = new Map();

      // using our found CSS earlier, let's sort out which components import them
      for (const id of order) {
        const info = this.getModuleInfo(id);

        // should be the Svelte component
        const component = info.importers[0];

        // join the rendered CSS to the importing component's path
        components.set(component, styles.get(id));
      }

      // next we figure out which entrypoints use which components
      for (const chunk of Object.values(bundle)) {
        // we only care about entrypoints
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const modules = Object.keys(chunk.modules);

          let css = '';

          // if any of the modules are our Svelte components, this entrypoint may have CSS
          for (const module of modules) {
            if (components.has(module)) {
              css += components.get(module);
            }
          }

          // no need to output if there was no CSS
          if (css.length > 0) {
            // output our prepared CSS
            const referenceId = this.emitFile({
              type: 'asset',
              name: `${chunk.name}.css`,
              source: css,
            });

            // find its generated file name
            const fileName = this.getFileName(referenceId);

            // tell the entrypoint chunk it has a new "import" for downstream use
            chunk.imports.push(fileName);
          }
        }
      }
    },
  });
}

module.exports = { cssPlugin };
