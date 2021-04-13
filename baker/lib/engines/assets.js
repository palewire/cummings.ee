// native
const fs = require('fs').promises;
const path = require('path');

// packages
const debug = require('debug');
const imagemin = require('imagemin');
const gifsicle = require('imagemin-gifsicle');
const jpegtran = require('imagemin-jpegtran');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');

// local
const { BaseEngine } = require('./base');
const { isProductionEnv } = require('../env');
const {
  getRevHash,
  validFontExtensions,
  validImageExtensions,
  validJsonExtensions,
  validVideoExtensions,
} = require('../utils');

const logger = debug('baker:engines:assets');

class AssetsEngine extends BaseEngine {
  constructor({ dir, ...args }) {
    super(args);

    this.name = 'assets';

    // the directory where all assets live
    this.dir = path.relative(this.input, dir);

    // the glob for finding asset files, we accept anything
    this.filePattern = path.join(this.dir, '**/*');

    // prepare the plugins for image processing
    this.plugins = [gifsicle(), jpegtran(), optipng(), svgo()];

    // the set of valid extensions to hash
    this.validExtensions = new Set([
      ...validFontExtensions,
      ...validImageExtensions,
      ...validJsonExtensions,
      ...validVideoExtensions,
    ]);
  }

  async getOutputPath({ content, dir, ext, name }) {
    // ensure our check picks up extensions with different cases
    const normalizedExt = ext.toLowerCase();

    // if we're in production and this is an image, font, video or JSON, hash it, otherwise skip
    if (isProductionEnv && this.validExtensions.has(normalizedExt)) {
      const hash = await getRevHash(content);
      name = `${name}.${hash}`;
    }

    return path.format({ dir, name, ext });
  }

  async render(file) {
    // grab the path relative to the source directory
    const input = path.relative(this.input, file);
    logger('loading', input);

    // determine the file's extension
    const { ext } = path.parse(file);

    // make sure it's always lowercase for matching purposes
    const normalizedExt = ext.toLowerCase();

    // read the file
    let buffer = await fs.readFile(file);

    // if this is an image, we want to do extra work
    if (isProductionEnv && validImageExtensions.includes(normalizedExt)) {
      // pass it through imagemin
      buffer = await imagemin.buffer(buffer, { plugins: this.plugins });
    }

    // if this is JSON, we want to minify it
    if (isProductionEnv && validJsonExtensions.includes(normalizedExt)) {
      buffer = Buffer.from(JSON.stringify(JSON.parse(buffer.toString())));
    }

    logger('finished processing of', input);

    return buffer;
  }

  /**
   * @param {string[]} files
   */
  buildManifest(files) {
    return files.reduce((obj, file) => {
      // grab the path relative to the source directory
      const input = path.relative(this.input, file);

      logger('found asset', input);

      obj[input] = input;

      return obj;
    }, {});
  }

  async build() {
    // clear out the dependencies and manifest
    this.invalidate();

    // find the files to work with
    const files = await this.findFiles();

    for (const file of files) {
      this.addDependency(file, file);
    }

    if (isProductionEnv) {
      try {
        await Promise.all(files.map((file) => this.outputFile(file)));
      } catch (err) {
        throw err;
      }
    } else {
      this.manifest = this.buildManifest(files);
    }
  }
}

module.exports = { AssetsEngine };
