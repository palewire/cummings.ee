const entrypoints = [
  // Add more script entrypoints here as needed
  'index',
  'book',
  'poem',
];

const fs = require('fs');

export default {
  domain: 'https://cummings.ee/',
  output: process.env.BAKER_OUTPUT || '_dist',
  entrypoints: `scripts/${
    entrypoints.length > 1 ? `{${entrypoints.join(',')}}` : entrypoints[0]
  }.js`,
  pathPrefix:
    process.env.BAKER_PATH_PREFIX || process.env.DELIVERY_BASE_PATH || '/',
  // use createPages to generate pages on the fly
  createPages(createPage, data) {
    const books = data.books.list;
    fs.writeFile('output.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) {
        console.log('An error occured while writing JSON Object to File.');
        return console.log(err);
      }
      console.log('JSON file has been saved.');
    });
    for (const b of books) {
      createPage('book_detail.html', `/book/${b.slug}/`, { book: b });
      const poems = data.poems[b.slug] || {};
      for (const [slug, p] of Object.entries(poems)) {
        createPage('poem_detail.html', `/book/${b.slug}/poem/${slug}/`, {
          book: b,
          poem: p,
          slug: slug,
        });
      }
    }
  },
};
