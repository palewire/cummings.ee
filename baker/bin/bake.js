#!/usr/bin/env node

// native
const { bold, green, red } = require('colorette');
const { resolve } = require('path');

// packages
const debug = require('debug');
const mri = require('mri');
const { rollup } = require('rollup');
const requireFromString = require('require-from-string');

// local
const { Baker } = require('../lib');
const { logErrorMessage } = require('../lib/utils');

const logger = debug('baker:cli');

const defaultConfigFile = 'baker.config.js';

const defaultConfig = {
  assets: 'assets',
  createPages: undefined,
  data: '_data',
  domain: undefined,
  entrypoints: 'scripts/app.js',
  input: process.cwd(),
  layouts: '_layouts',
  nunjucksFilters: undefined,
  nunjucksTags: undefined,
  minifyOptions: undefined,
  output: '_dist',
  pathPrefix: '/',
  staticRoot: '',
};

function getDefaultFromConfig(module) {
  return module.__esModule ? module.default : module;
}

async function compileAndLoadConfig(pathToConfig) {
  const bundle = await rollup({
    external: () => true,
    input: pathToConfig,
    treeshake: false,
  });

  const {
    output: [{ code }],
  } = await bundle.generate({
    exports: 'named',
    format: 'cjs',
    interop: 'auto',
  });

  const loadedConfig = requireFromString(code, pathToConfig);

  return getDefaultFromConfig(loadedConfig);
}

async function prepareConfig(inputOptions) {
  // the input directory everything is relative to
  const input = inputOptions.input;

  // a config parameter was passed
  if (inputOptions.config) {
    // we check to see if it was passed as a boolean and use our default path to the config, otherwise we use what was given
    const pathToConfig = resolve(
      input,
      inputOptions.config === true ? defaultConfigFile : inputOptions.config
    );

    inputOptions = await compileAndLoadConfig(pathToConfig);
  }

  // prep a helper function to resolve paths against input
  const resolver = (key) => inputOptions[key] || defaultConfig[key];

  const options = {};

  options.assets = resolver('assets');
  options.createPages = resolver('createPages');
  options.data = resolver('data');
  options.domain = resolver('domain');
  options.entrypoints = resolver('entrypoints');
  options.input = resolver('input');
  options.layouts = resolver('layouts');
  options.nunjucksFilters = resolver('nunjucksFilters');
  options.nunjucksTags = resolver('nunjucksTags');
  options.minifyOptions = resolver('minifyOptions');
  options.output = resolver('output');
  options.pathPrefix = resolver('pathPrefix');
  options.staticRoot = resolver('staticRoot');

  return options;
}

const mriConfig = {
  alias: {
    a: 'assets',
    c: 'config',
    d: 'data',
    e: 'entrypoints',
    i: 'input',
    l: 'layouts',
    o: 'output',
    p: 'pathPrefix',
    s: 'staticRoot',
  },
  default: {
    input: process.cwd(),
  },
};

/**
 * The function that runs when the CLI is ran.
 *
 * @param {string[]} args The provided args
 */
async function run(args) {
  const { _, ...flags } = mri(args, mriConfig);

  const command = _[0];
  const config = await prepareConfig(flags);

  logger('command:', command);
  logger('resolved input flags:', config);

  const baker = new Baker(config);

  switch (command) {
    case 'bake':
    case 'build':
      try {
        await baker.bake();

        console.log(green(bold('The build was a success!')));
      } catch (err) {
        console.log(
          red(bold("Build failed. Here's what possibly went wrong:\n"))
        );
        logErrorMessage(err);
        process.exit(1);
      }
      break;
    case 'serve':
      await baker.serve();
  }
}

run(process.argv.slice(2)).catch((err) => {
  console.error(err);
  // we want to throw a real exit value on crash and burn
  process.exit(1);
});
