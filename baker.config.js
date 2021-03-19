const entrypoints = [
  // Add more script entrypoints here as needed
  'index',
  'book',
  'poem',
];

export default {
  domain: 'https://cummings.ee/',
  output: process.env.BAKER_OUTPUT || '_dist',
  entrypoints: `scripts/${
    entrypoints.length > 1 ? `{${entrypoints.join(',')}}` : entrypoints[0]
  }.js`,
  pathPrefix:
    process.env.BAKER_PATH_PREFIX || process.env.DELIVERY_BASE_PATH || '/',
};
