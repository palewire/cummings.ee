const fs = require('fs');

const entrypoints = [];

function parsePoem(text) {
  console.log(text);
  if (!text) {
    return [];
  }
  const lines = text.split(/\r?\n/);
  let stanzaList = [];
  let thisStanza = [];
  lines.forEach((l) => {
    if (l.trim().length == 0) {
      stanzaList.push(thisStanza);
      thisStanza = [];
    } else {
      thisStanza.push({
        text: parseText(l),
        class: 'line',
      });
    }
  });
  stanzaList.push(thisStanza);
  return stanzaList;
}

function parseText(text) {
  return text.replace('# ', '').replace(' ', '&nbsp;');
}

export default {
  domain: 'https://cummings.ee/',
  output: process.env.BAKER_OUTPUT || '_dist',
  entrypoints: `scripts/${
    entrypoints.length > 1 ? `{${entrypoints.join(',')}}` : entrypoints[0]
  }.js`,
  pathPrefix:
    process.env.BAKER_PATH_PREFIX || process.env.DELIVERY_BASE_PATH || '/',
  nunjucksFilters: {
    parsePoem,
    parseText,
  },
  // use createPages to generate pages on the fly
  createPages(createPage, data) {
    const books = data.books.list;
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
