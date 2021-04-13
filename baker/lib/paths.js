// native
const fs = require('fs');
const path = require('path');

/**
 * The current project's root directory
 *
 * @type {string}
 */
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolves a relative path against the current project's root directory.
 *
 * @param {string} relativePath The desired path relative to the app's directory
 * @returns {string}
 */
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

/**
 * Resolves a relative path against this library's root directory.
 *
 * @param {string} relativePath The desired path relative to this package's directory
 * @returns {string}
 */
function resolveOwn(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

module.exports = {
  polyfillsDynamicImport: resolveOwn('lib/polyfills/dynamic-import.js'),
};
