const entrypoints = [
  // Add more script entrypoints here as needed
  'app',
];

export default {
  domain: 'https://cummings.ee/',
  entrypoints: `scripts/${
    entrypoints.length > 1 ? `{${entrypoints.join(',')}}` : entrypoints[0]
  }.js`,
  pathPrefix:
    process.env.BAKER_PATH_PREFIX || process.env.DELIVERY_BASE_PATH || '/',
};
