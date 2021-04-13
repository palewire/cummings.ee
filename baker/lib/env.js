const VALID_NODE_ENVS = ['development', 'production'];
const DEFAULT_NODE_ENV = 'production';

const DEBUG = process.env.DEBUG;
const NODE_ENV = process.env.NODE_ENV;

const nodeEnv =
  NODE_ENV && VALID_NODE_ENVS.includes(NODE_ENV) ? NODE_ENV : DEFAULT_NODE_ENV;
const isProductionEnv = nodeEnv === 'production';

const inDebugMode = Boolean(DEBUG);

/**
 * Regex for grabbing any environmental variables that may start with "BAKER_".
 * @type {RegExp}
 */
const BAKER_REGEX = /^BAKER_/i;

/**
 * @param {string} pathPrefix
 */
function getEnvironment(pathPrefix) {
  // find all the keys of the environment
  const keys = Object.keys(process.env);

  // find any of them that match our regex for BAKER_ exclusive ones
  const bakerKeys = keys.filter((key) => BAKER_REGEX.test(key));

  // build the object of environment variables
  const raw = bakerKeys.reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      // Are we in production mode or not?
      NODE_ENV: nodeEnv,
      // Useful for resolving the correct path relative to the project files
      PATH_PREFIX: pathPrefix,
    }
  );

  // Stringify all values so we can pass it directly to rollup-plugin-replace
  const stringified = Object.keys(raw).reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(raw[key]);
    return env;
  }, {});

  return { raw, stringified };
}

module.exports = {
  getEnvironment,
  inDebugMode,
  isProductionEnv,
  nodeEnv,
};
