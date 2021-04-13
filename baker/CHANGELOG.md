# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The `{% static %}` tag will now pass through full URLs as-is when used as the parameter. This lets developers not have to worry about whether a path is project relative or not in loops, and allows templates that work with files to easily account for local and remote files.

## [0.31.2] - 2021-02-22

### Added

- Add `preventAssignment: true` to `@rollup/plugin-replace` options.

### Fixed

- Make sure `process.exit(1)` is called when builds fail.

## [0.31.1] - 2021-01-31

### Fixed

- Pathing for Svelte CSS also needs to account for path prefixes or else it will be resolved incorrectly in HTML that's not at the root.

## [0.31.0] - 2021-01-22

### Added

- Thanks to `@web/rollup-plugin-import-meta-assets` it's now possible to import paths to files within JavaScript and have that be enough to ensure that the file is added to the build. This is _yet another_ method for loading data in baker projects, and likely the best one yet.

```js
// Rollup will see this and understand it should add this file to your build
const url = new URL('./data/cities.json', import.meta.url);

// load it and go!
const data = await d3.json(url);
```

### Changed

- The Nunjucks environment is now allowed to cache templates in production mode. Probably won't change much speed wise, but ever so slightly more efficient.

## [0.30.0] - 2021-01-18

### Added

A new experimental custom Rollup plugin has been added that provides an optimized method for importing data files in JavaScript. If a JSON, CSV, or TSV file is imported using the prefix `dataset:*` it will be added to the bundle either directly as an Object or Array literal (if under 10K in size) or rendered as a string within a `JSON.parse` call.

It has been documented that [parsing a string within `JSON.parse` is much, much faster](https://v8.dev/blog/cost-of-javascript-2019#json) on average than directly passing in JavaScript, and typically this is the very first step when data is being loaded manually (with `d3-fetch`'s `json` or `csv` functions, etc.). This makes it possible to import (or even better — dynamically import) data without having to deploy it as a file or inject it into HTML to be parsed.

An example of how to use it:

```js
import data from 'dataset:./assets/data.json';
// or dynamically
const data = await import('dataset:./assets/data.json');
```

## [0.29.0] - 2021-01-13

### Added

- CSS within Svelte components is now **supported**. This means any CSS that's written within Svelte components will be included in the `{% script %}` entrypoint bundle that is added to a page.
- Additional variables are now available on the `page` template context object (previously `current_page`) - in addition to `page.absoluteUrl`, `page.url` represents the project-relative URL. `page.inputPath` represents the project-relative path to the original input template, and `page.outputPath` represents the project-relative output path.

### Changed

- The file watcher logic is now a little smarter and keeps track of dependencies directly in the engines (except for Rollup, which manages this itself). This is a small step toward having a much richer dependency graph for builds.
- The `current_page` template context object has been renamed to `page`. `current_page` however will continue to exist until `1.0`.

## [0.28.0] - 2020-12-30

### Added

- It's now possible to supply custom tags (`{% custom variable1, variable2 %}`) to Nunjucks via the `baker.config.js` file. It is very similar to how you add custom filters.

How to add one:

```js
// baker.config.js
module.exports = {
  // ...
  nunjucksTags: {
    author(firstName, lastName) {
      return `<p class="author">By ${firstName} ${lastName}</p>`;
    },
  },
};
```

How to use one:

```html
{% author "Arthur", "Barker" %}
```

> Heads up! Nunjucks **requires** a comma between arguments.

And the output:

```html
<p class="author">By Arthur Barker</p>
```

### Changed

- Async nunjucks tags now _must_ return a Promise. This abstracts away some of Nunjucks' warts and the expectation of a callback to enable async tags.
- Because the built-in `inject` tag was async it now returns a Promise to match the new interface.

## [0.27.1] - 2020-12-14

### Added

- Because users of `baker.config.js` no longer have access to the Baker instance, the function that resolves static files is now also available on the Nunjucks instance at `getStaticPath`.

## [0.27.0] - 2020-12-14

### Changed

- A behind-the-scenes change, but the custom Rollup plugin for injecting imports into entrypoints has been replaced. This rids Baker of a bug that surfaces when attempting to use dynamic imports.

## [0.26.0] - 2020-10-05

### Added

- Added TypeScript support to Svelte files via `svelte-preprocess`.
- Added an exported `svelte.config.js` file so templates and other tools that need to mirror Baker's `svelte-preprocess` options can do so easily.

### Changed

- Moved to `premove` from `rimraf` for directory-emptying tasks.

## [0.25.0] - 2020-08-14

### Added

- The `jsonScript` filter is now built-in to Baker's Nunjucks' environment. [Much like the Django version](https://docs.djangoproject.com/en/dev/ref/templates/builtins/#json-script), this filter safely outputs an object as JSON, wrapped in a <script> tag and ready for use with JavaScript. XSS attacks are mitigated by escaping the characters "<", ">" and "&".

This input:

```html
{{ value|jsonScript("hello-data") }}
```

Becomes this:

```html
<script id="hello-data" type="application/json">
  { "hello": "world" }
</script>
```

- Attempting to use a JavaScript entrypoint that does not exist because compiling failed or because it was not configured as an entrypoint will now throw a more explicit (and helpful) error.

- It's now possible to use ESM imports/exports when writing the `baker.config.js` file. Hopefully this will make context switching less annoying - before it was the only user-facing JavaScript file that required CommonJS syntax.

### Changed

- The `static`, `staticabsolute` and `inject` blocks will now always throw an error if a valid file cannot be found. Previously it would silently (and intentionally) fail so a missing file wasn't the end of the world while in development. Maybe this will be too drastic of a change but we'll have to see. Too often folks have a silent failure in development and don't realize it until their build fails in production.

- Nunjucks blocks and filters have been reorganized within Baker. Nothing user-facing should be altered by this.

## [0.24.1] - 2020-08-11

### Fixed

- Bumped `mini-sync` to 0.3.0 to catch a downstream change to do what we already thought was happening - all files served by the dev server should be receiving explicit `no-cache` Cache Control headers.

## [0.24.0] - 2020-08-03

### Changed

- Custom Nunjucks filters now have a reference to the current instance of the Nunjucks engine available at `this`. Most filters will never need this, but we have a few cases where filters were hacking access in and we don't wanna break everything.

### Fixed

- The Nunjucks custom `log` filter now returns the input value so Nunjucks will not complain about a null or undefined output.

## [0.23.0] - 2020-08-03

### Added

- It's now possible to use a configuration file to pass options to Baker when it is ran using the CLI. This is the **preferred** method for using Baker.

By default the CLI tool looks for a file called `baker.config.js` in the `input` directory when the `--config` (or `-c`) paramter is passed bare. You can also pass a path to a configuration file if you've given it another name or put it in another directory. If you _do not_ pass `--config` it will use the defaults instead and any other parameters you pass.

```sh
# will look for "baker.config.js" in the current directory
baker bake --config

# will load the config in "my-config.js" in the current directory
baker bake --config my-config.js

# will not use any config *at all* even if it exists, and use all default options other than "input"
baker bake --input my-project-directory
```

The configuration file should export an `object` off of `module.exports`. All options are optional, and Baker will still use the smart defaults the previous iteration of the CLI used. Only set things you want to explicitly change/add!

```js
// baker.config.js
module.exports = {
  // a custom domain for all resolved URLs
  domain: 'our-news-domain',

  // we want to use the static root feature, so we supply the path
  staticRoot: '/static/',

  // use createPages to generate pages on the fly
  createPages(createPage, data) {
    for (const title of data.titles) {
      createPage('template.html', `${title}.html`, {
        context: { title },
      });
    }
  },

  // pass an object of filters to add to Nunjucks
  nunjucksFilters: {
    square(n) {
      n = +n;

      return n * n;
    },
  },
};
```

- It's now possible to add new Nunjucks filters using the `nunjucksFilters` configuration method. While it was always technically possible to add new filters before by reaching into Baker's instance of Nunjucks, this is a more user-friendly option that is available via the new config file method.

`nunjucksFilters` should be an object, where each key is the name of the filter, and the key's value is the function to call when the filter is used.

```js
// baker.config.js
module.exports = {
  nunjucksFilters: {
    square(value) {
      const n = +value;

      return n * n;
    },
  },
};
```

```html
{% set value = 5 %}
```

```html
{{ value|square }} // 25
```

- New `log` filter in Nunjucks templates that allows you to log any variable or value to the terminal's console.

```html
{{ value|log }} // this variable should log in your terminal
```

### Changed

- Templates are now rendered sequentially instead of in parallel in an attempt to encourage some consistency in the order of errors being thrown. It's not uncommon to have an error present in multiple pages but because each one races each other to render it's not always the same page that throws. It's maddening. This _may_ be slightly slower in bigger projects but we shall see.

## [0.22.0] - 2020-07-20

### Added

- It's now possible to dynamically generate HTML outputs by passing an optional `createPages` function when you create a `Baker` instance.

```js
/**
 * "createPages" is a function to call for each page you want created
 * "data" is the quaff generated contents of the "_data" folder
 */
function createPages(createPage, data) {
  // use whatever parts of the data context (or external sources!) to determine
  // what pages should be generated
  for (const title of data.titles) {
    // call createPage for each one, passing in the template to use within
    // _layouts, where to output it in the output (_dist) folder, and optional
    // additional context
    createPage('template.html', `${title}.html`, {
      context: { title },
    });
  }
}

const baker = new Baker({
  ...,
  createPages,
});
```

This works whether you're running the development server locally or building for production.

If an optional additional context is passed, it will be merged with the global context **only** for that render and have precedence, meaning any overlapping keys will contain what was passed locally to `createPage` even if it also exists in the global context. It's recommended to do something similar to above and "namespace" your provided local context to lessen the chance of an unexpected overwrite.

### Changed

- Moved from `rollup-plugin-babel` to the namespaced `@rollup/plugin-babel`.

## [0.21.0] - 2020-06-22

### Added

- `.json`, `.geojson` and `.topojson` files in the `assets` directory will now have hashes generated and work like you'd expect with `{% static %}`. In production these files will also be minified.

### Changed

- Baker no longer uses `hasha` to calculate file hashes and instead rolls its own with `crypto`, dropping two dependencies.

## [0.20.0] - 2020-06-17

### Added

A new experimental Rollup plugin has been added to `baker` to provide an additional way to pull primitive values from files in the `_data` folder into JavaScript files. By importing a value from a special `data:*` path you can use the value directly.

So if there was `meta.json` file in your `_data` folder:

```json
{
  "breed": "corgi",
  "names": ["Abe", "Winston", "Willow"]
}
```

Then you could tap into it like this:

```js
import breed from 'data:meta.breed';

console.log(breed); // "corgi"
```

However - to prevent any excessively large imports this plugin will prevent the import of anything that's not a primitive value (number, boolean, string, etc.). This means _no_ arrays or objects.

```js
import names from 'data:meta.names'; // will throw a Rollup error!
```

### Changed

- `postcss` will now be ran against any CSS in development as well. This prevents the (increasingly) rare case of where a CSS property only has support with a prefix. (`appearance: none` was the driver for this.) This could cryptically break in development and _then_ work in production, which is about as non-ideal as you can get.
- `fs-extra` has been purged from the library in favor of native `fs.promises` and `rimraf`.
- The CLI command now throws proper `process.exit()` calls.
- The dev server (via `mini-sync`) now waits for the initial build to succeed before attempting to serve. This should help prevent partial serves and throw more helpful errors if there is something critically wrong without leaving the dev server in limbo.
- We now use `colorette` for all our terminal coloring needs.

### Fixed

- Failures to process a file in the `_data` directory will now throw legitmate errors via `quaff`. In the case of JSON this means you'll get actually useful line numbers.

## [0.20.0-alpha.0] - 2020-02-09

### Added

- It's now possible to pass a `staticRoot` path to Baker, which will make every non-HTML engine output into the `staticRoot` **relative** to `output`. This is intented to make multi-page deploys more viable in certain scenarios.

## [0.19.0] - 2020-02-06

### Added

- Each HTML page generated by Nunjucks now has access to the local context variable `current_page`. As of this release the only value in this object is `current_page.absolute_url`, which is intended to replace the global `CURRENT_URL`.

### Removed

- The `CURRENT_URL` Nunjucks global is no longer available, and has been replaced by the local context object `current_page`. Please note this now means any usage of `current_page` **must** be passed into macros, who do not have access to the local context.

### Fixed

- The `CURRENT_URL` Nunjucks global was subject to a race condition when Baker is in multiple-page output mode due to the async render method. This means it was possible for an HTML page to use the wrong `CURRENT_URL`. Now, the current URL of a page will appear on a local context variable called `current_page.absolute_url`, guaranteeing that each page can only ever see it's own `current_page` context.

## [0.18.2] - 2020-02-05

### Fixed

- The included `preload` via `{% script %}` now passes `crossorigin`.

## [0.18.1] - 2020-02-05

### Fixed

- The preload section of the `{% script %}` block now accounts for the `pathPrefix` and resolves relative to it.

## [0.18.0] - 2020-02-05

### Added

- It's now possible to pass a second flag to the `{% script %}` block that instructs it to include any scripts that are candidates for preloading. This is recommended in browsers that support `rel=preload` in order to assist the browser in efficiently loading assets. You should **only** use this if something like [Lighthouse](https://developers.google.com/web/tools/lighthouse/) is suggesting it. To activate it, just pass `true` as the second parameter to `{% script %}` and Baker will do the rest.

```html
{% script 'app', true %}
```

## [0.17.0] - 2020-02-04

### Added

- `dotenv-expand` has been added to our `.env` file logic, allowing for tapping into existing environment variables to build values `baker` can see. the `BAKER_` prefix is still enforced, however - but this provides a way to morph existing variables into compatible ones.

### Fixed

- The reworked `inject` function from `0.15.0` did not account for local development when a manifest does not exist for `AssetsEngine` output. This has been fixed. It instead will look for the local version of the file in `development` and continue to error out in `production` if the manifest check fails.

## [0.16.1] - 2020-01-19

### Fixed

- `@babel/preset-typescript` also needs to know what the JSX pragma is so it knows to ignore it. This patch ensures both `@babel/preset-typescript` and `@babel/plugin-transform-react-jsx` get passed the same one.

## [0.16.0] - 2020-01-19

### Added

- Added support for TypeScript (`.ts`, `.tsx`) files in the `scripts` directory via `@babel/preset-typescript`. They are also allowed as `entrypoints` if passed. Actual type-checking is left up to the user, all this does is remove any TypeScript artifacts from the files - BYO `tsconfig.json` and `tsc` calls.

## [0.15.0] - 2020-01-17

### Added

- Added a reworked `inject` block, which allows for inserting the contents of a file **post** processing directly into the HTML. This is useful for potentially "injecting" CSS or JavaScript into the page.

## [0.14.0] - 2020-01-16

### Added

- Video files (`.mp4`, `.webm`) are now recognized by `AssetsEngine` and will be included in any hashing.

## [0.13.2] - 2020-01-10

### Fixed

- Some `dependencies` got moved to `devDependencies`, meaning you wouldn't have got them on install. Oops.

## [0.13.1] - 2020-01-10

### Fixed

- `Baker.pathPrefix` is now set to `/` in `development` mode so a passed `pathPrefix` does not break anything in serve mode.

## [0.13.0] - 2020-01-10

### Added

- The Nunjucks environment now includes a new global named `CURRENT_URL`. This represents the final URL of each generated page that can be used in its template. It's based on a combination of the provided `domain`, `pathPrefix` and clean (without `index.html` appended) path of the output HTML itself.

## [0.12.0] - 2020-01-09

### Added

- Added new built-in `date` filter to Nunjucks, which allows for formatting of an ISO date string or Date object with `date-fns` [formatting function](https://date-fns.org/v2.8.1/docs/format).
- Added a new parameter that must be passed to `new Baker()` — `domain`. This is used by `staticabsolute` to prepare absolute project URLs. (May become optional later for scenarios where this doesn't matter.)
- Added new `staticabsolute` block, which makes it possible to build absolute URLs to project files.

## [0.11.0] - 2019-12-06

### Added

- Font files (`.woff2`, `.woff`, `.ttf`, `.otf`) are now recognized by `AssetsEngine` and will be included in any hashing.

### Fixed

- Baker now picks up images with without all lowercase extensions and includes them the compression and hashing process.

## [0.10.0] - 2019-12-03

### Added

- The function that resolves static files is now available on a Baker instance as `getStaticPath`. This enables users of Baker to tap into the file resolution logic however they see fit.

## [0.9.0] - 2019-11-18

### Added

- Modern JavaScript builds now use [`@babel/preset-modules`](https://github.com/babel/preset-modules). This should result in even smaller modern bundles that natively support features that already exist in ~85% of browsers.

### Removed

- Automatic web polyfill injection has been removed. It's just too much magic going on, and we shouldn't assume that every single thing will need `fetch` + `intersection-observer` + `classlist` injected into it. (JavaScript features are still polyfilled via `core-js`. In other words if it's something you'd be able to do in Node.js it's handled.) The gains of keeping a few polyfills out of the modern build aren't worth the confusion. However this does mean users are now responsible for importing their own polyfills.

## [0.8.0] - 2019-11-03

### Added

- The Rollup engine now supports both Svelte (`.svelte` files) and Preact (the usage of JSX) as options for JavaScript-based HTML templating.

### Changed

- `browser-sync` has been replaced with [`mini-sync`](https://github.com/rdmurphy/mini-sync). `browser-sync` was one of the largest packages installed in `baker`, and this should lead to quicker install times.

### Removed

- The old legacy Rollup engine has been deleted and the one previously called `rollup2.js` has taken its place.

## [0.7.0] - 2019-10-18

### Added

- Support for correctly formatted environment variables that are passed to `rollup-plugin-replace` has been added. Any environment variable that begins with `BAKER_` will be read and converted to the `process.env.BAKER_*` format that can be used in JavaScript files. Any environmental variables that do not have a match are ignored.

It's also possible to manage these with a `.env` in the root of your project. The same rule regarding the `BAKER_` prefix applies.

## [0.6.0] - 2019-09-17

### Added

- Two custom functions have been added to the `sass` renderer — `static-url` and `static-path`. These are implemented against the Node.js API (and not within a Sass file) because they need to reference the static asset manifests. They are used in the same scenarios as the `{% static %}` block in Nunjucks templates — you need to reference the path to a static asset in your project, but need it to be given the correct hash prefix on production builds.

`static-url` is meant to be a shortcut for anything you'd normally put inside of `url()`, which it will include for you.

_SCSS_

```scss
body {
  background-image: static-url('assets/background.png');
}
```

_CSS_

```css
body {
  background-image: url(/assets/background.123abc.png);
}
```

`static-path` only adjusts the path and returns it as a string. This will probably be less used, but it's there as an escape hatch if you need it.

```scss
body {
  background-image: url(static-path('assets/background.png'));
}
```

_CSS_

```css
body {
  background-image: url(/assets/background.123abc.png);
}
```

### Changed

- Now only valid images will receive the file hash in production mode. This is imperfect, but better than every random asset getting a hash unnecessarily and causing issues when they're used. (Looking at you, `.gltf` files.) Ideally this would be smarter, but not quite sure how to go about that yet.

## [0.5.0] - 2019-09-04

### Added

- Nunjucks templates now have a better error logger. It's not perfect, but should help find specific lines causing issues.
- Template files in the layout directory are now watched during a serve - if any changes are made templates are regenerated.
- Files in the `data` directory are now watched during a serve and will trigger a template build.

### Changed

- This package is now deployed on `npm` at `@datagraphics/baker` instead of `@datadesk/baker`, which has been deprecated.

## [0.4.0] - 2019-09-03

### Added

- Legacy script builds now use `core-js` to polyfill and add features that may be missing in those browsers. This will likely cause the `iife` build to be bigger than it should be, but this prevents users from having to whack-a-mole issues with IE 11. It should just work.
- Polyfills for both the modern and legacy are automatically inserted into every entrypoint, with the assumption there's a base set of features we should expect to be there. For modern builds, it's support for dynamic imports and IntersectionObserver. For legacy builds, it's fetch, Element.classList and IntersectionObserver.

### Changed

- The engine for Rollup has been rewritten to be much smarter about how it navigates modern and legacy builds. This also does away with SystemJS in favor of native modules for browsers that support it, and an `iife` build for browsers that do not.

## [0.3.0] - 2019-08-16

### Added

- Added `AssetsEngine` for management of generic assets files in a build. By default it looks for an `assets` directory in the input directory.

### Changed

- The `ImagesEngine` is no more and has been merged into `AssetsEngine`. This means that images _must_ be in the `assets` directory to be found and handled.

## [0.2.1] - 2019-08-16

### Fixed

- A `pathPrefix` should always have a leading slash to ensure pathing resolution works.

## [0.2.0] - 2019-08-08

### Changed

- The serve task now runs all the engines in an initial pass before activating the server. This ensures that the local development URL is not presented as available before it truly is.

## [0.1.0] - 2019-08-07

### Added

- Initial release.
