import dynamicImportPolyfill from 'dynamic-import-polyfill';

// This needs to be done before any dynamic imports are used
dynamicImportPolyfill.initialize({ modulePath: 'scripts/' });
