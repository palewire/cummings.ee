/** @typedef {import("rollup").Plugin} RollupPlugin */

// native
const { readFileSync } = require('fs');
const { extname } = require('path');

// packages
const { csvParse, tsvParse } = require('d3-dsv');
const parseJson = require('parse-json');

// constants
const moduleName = 'dataset-plugin';
const moduleStart = 'dataset:';
const internalModuleStart = `\0${moduleStart}`;
const parsers = { '.csv': csvParse, '.tsv': tsvParse, '.json': parseJson };

function datasetPlugin() {
  return /** @type {RollupPlugin} */ ({
    name: moduleName,

    async resolveId(id, importer) {
      // if it doesn't match our prefix, pass it along
      if (!id.startsWith(moduleStart)) return null;

      // resolve the path and tag it with our virtual module so other plugins leave it alone
      id = id.slice(moduleStart.length);
      const resolved = await this.resolve(id, importer, { skipSelf: true });

      return resolved && `${internalModuleStart}${resolved.id}`;
    },

    load(id) {
      // only mess with files with our special flag from "resolveId"
      if (!id.startsWith(internalModuleStart)) {
        return null;
      }

      id = id.slice(internalModuleStart.length);

      const ext = extname(id);

      // check if we have a processor for this - should probably throw a harder error if no match
      if (!(ext in parsers)) {
        return null;
      }

      // because we are handling the load here we need to tell Rollup to watch it
      this.addWatchFile(id);

      // read the raw file, parse it, and turn it into a string
      const code = readFileSync(id, 'utf8');
      const data = parsers[ext](code);
      const str = JSON.stringify(data);

      // we check size here because JSON.parse is typically only more performant for 10kb+ files
      // source: https://v8.dev/blog/cost-of-javascript-2019#json
      // source: https://v8.dev/features/subsume-json#embedding-json-parse
      const size = Buffer.byteLength(str, 'utf8');

      const output =
        size > 10000
          ? `export default JSON.parse(${JSON.stringify(str)});`
          : `export default ${str}`;

      return output;
    },
  });
}

module.exports = { datasetPlugin };
