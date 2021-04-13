// native
const path = require('path');

// packages
const chokidar = require('chokidar');
const glob = require('fast-glob');

// local
const { noop, outputFile } = require('../utils');

/**
 * The base builder engine for all asset types. For most engines this will
 * handle the majority of tasks.
 */
class BaseEngine {
  /**
   * @param {object} options
   * @param {string} options.domain
   * @param {string} options.input
   * @param {string} options.output
   * @param {string} options.pathPrefix
   * @param {string} options.staticRoot
   */
  constructor({ domain, input, output, pathPrefix, staticRoot }) {
    // the project's domain
    this.domain = domain;

    // the input directory
    this.input = input;

    // the output directory
    this.output = output;

    // the path prefix
    this.pathPrefix = pathPrefix;

    // any additional pathing for static assets
    this.staticRoot = staticRoot;

    // the glob pattern to use for finding files to process
    this.filePattern = null;

    // any files or paths to ignore when searching
    this.ignorePattern = ['**/_*/**', '**/node_modules/**'];

    // the output manifest for this engine
    this.manifest = {};

    // any files this engine considers a dependency for rendering its output
    /** @type {Set<string>} */
    this.dependencies = new Set();

    /** @type {Map<string, Set<string>>} */
    this.mappedDependencies = new Map();

    // make sure we can tap into this embedded in other functions
    this.addDependency = this.addDependency.bind(this);
  }

  findFiles() {
    return glob(path.join(this.input, this.filePattern), {
      ignore: this.ignorePattern,
    });
  }

  /**
   * @param {string} file
   */
  addDependency(file, importer) {
    if (this.mappedDependencies.has(file)) {
      this.mappedDependencies.get(file).add(importer);
    } else {
      this.mappedDependencies.set(file, new Set([importer]));
    }

    return this.dependencies.add(file);
  }

  getDependencies() {
    return Array.from(this.dependencies);
  }

  invalidate() {
    this.manifest = {};
    this.dependencies.clear();
    this.mappedDependencies.clear();
  }

  /**
   * @param {object} options
   * @param {string} [options.content]
   * @param {string} options.base
   * @param {string} options.dir
   * @param {string} options.ext
   * @param {string} options.input
   * @param {string} options.name
   */
  getOutputPath({ dir, ext, name }) {
    return path.format({ dir, ext, name });
  }

  async outputFile(file) {
    // grab the path relative to the source directory
    const input = path.relative(this.input, file);

    // pull the relative path's extension and name
    const parts = path.parse(input);

    // render this file according to the engine
    const content = await this.render(file);

    // use the inheriting engine's instructions for generating the output path
    const output = await this.getOutputPath({ content, input, ...parts });

    const staticOutput = path.join(this.staticRoot, output);

    // build the absolute output path
    const absolute = path.join(this.output, staticOutput);

    // write to disk
    await outputFile(absolute, content);

    // save a reference how the file path was modified
    this.manifest[input] = staticOutput;

    return staticOutput;
  }

  async build() {
    // clear out the dependencies and manifest
    this.invalidate();

    // find the files to work with
    const files = await this.findFiles();

    try {
      await Promise.all(files.map((file) => this.outputFile(file)));
    } catch (err) {
      throw err;
    }
  }

  /**
   * A wrapper around chokidar to serve as our default watcher for any given
   * file type.
   *
   * @param {Function} [fn] The function to call every time a change is detected
   */
  watch(fn = noop) {
    const toWatch = Array.from(this.dependencies);

    this.watcher = chokidar.watch(toWatch, {
      ignoreInitial: true,
    });

    const onChange = async (path) => {
      try {
        const entrypoints = this.mappedDependencies.get(path);

        const outputs = await Promise.all(
          Array.from(entrypoints).map((entrypoint) =>
            this.outputFile(entrypoint)
          )
        );

        for (const file of this.dependencies) {
          this.watcher.add(file);
        }

        fn(null, outputs);
      } catch (err) {
        fn(err);
      }
    };

    this.watcher.on('add', onChange);
    this.watcher.on('change', onChange);
    this.watcher.on('unlink', onChange);
  }
}

module.exports = { BaseEngine };
