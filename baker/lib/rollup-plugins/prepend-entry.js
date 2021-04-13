// packages
const MagicString = require('magic-string').default;

function prependEntry({ content }) {
  return {
    name: 'prepend-entry',
    transform(code, id) {
      const { isEntry } = this.getModuleInfo(id);

      if (isEntry) {
        const magicString = new MagicString(code);
        magicString.prepend(content);

        return { code: magicString.toString(), map: magicString.generateMap() };
      }
    },
  };
}

module.exports = { prependEntry };
