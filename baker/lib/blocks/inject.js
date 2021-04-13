// native
const { readFile } = require('fs').promises;
const { join } = require('path');

function createInjectBlock(outputDir, sources) {
  async function inject(file) {
    let path;

    // we try to find it in our sources
    for (const source of sources) {
      if (file in source.manifest) {
        path = source.manifest[file];
        break;
      }
    }

    if (path) {
      const absolutePath = join(outputDir, path);

      return readFile(absolutePath, 'utf8');
    } else {
      throw new Error(
        `The inject block tried to load a file that does not exist: ${file}`
      );
    }
  }

  inject.async = true;

  return inject;
}

module.exports = { createInjectBlock };
