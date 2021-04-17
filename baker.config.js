const yaml = require('js-yaml');

const entrypoints = ['poem'];

function parsePoem(text) {
  if (!text) {
    return [];
  }
  const lines = text.split(/\r?\n/);
  let stanzaList = [];
  let thisStanza = [];
  lines.forEach((l) => {
    // If it's an empty line, start a new stanza
    if (l.trim().length == 0) {
      stanzaList.push(thisStanza);
      thisStanza = [];
    } else {
      // Add to the current stanza
      thisStanza.push(l);
    }
  });
  stanzaList.push(thisStanza);
  return stanzaList;
}

function parseText(text) {
  return text.replace(/(  +)/g, "<span class='indent'>$1</span>");
}

function getChildren(node) {
  if (node.children) {
    return node.children.map(getChildren).flat();
  } else {
    return node;
  }
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
    // Get all the books
    const books = data.books.list;

    // Loop through them
    for (const book of books) {
      // Get the table of contents, if it exists
      const toc = data.toc[book.slug] || [];

      // Flatten the TOC, which may be nested, into a simple list
      const allPoems = toc.map(getChildren).flat();

      // Make a JSON file for the book and its metadata
      allPoems.forEach((p) => {
        p.html_url = `https://cummings.ee/book/${book.slug}/poem/${p.slug}/`;
      });
      book.html_url = `https://cummings.ee/book/${book.slug}/`;
      book.json_url = `https://cummings.ee/book/${book.slug}.json`;
      createPage('book_detail.json.njk', `/book/${book.slug}.json`, {
        text: JSON.stringify({ book, toc: allPoems }, null, 2),
      });

      // Pull the poems that have actually been keypunched
      const availablePoems = data.poems[book.slug] || {};

      // Create the HTML page for the book
      createPage('book_detail.html', `/book/${book.slug}/`, {
        book,
        allPoems,
        availablePoems,
      });

      // Loop through those
      for (const [slug, poem] of Object.entries(availablePoems)) {
        // Set all the poem metadata
        poem.slug = slug;
        poem.html_url = `https://cummings.ee/book/${book.slug}/poem/${slug}/`;
        poem.json_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.json`;
        poem.txt_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.txt`;

        // Create a JSON output
        createPage(
          'poem_detail.json.njk',
          `/book/${book.slug}/poem/${slug}.json`,
          {
            text: JSON.stringify(poem, null, 2),
          }
        );

        // Create a text output
        createPage(
          'poem_detail.txt.njk',
          `/book/${book.slug}/poem/${slug}.txt`,
          {
            poem,
          }
        );

        // Get the previous and next poems, if they exist
        const index = allPoems.findIndex((e, i) => e.slug === slug);

        const previousIndex = allPoems[index - 1];
        if (previousIndex) {
          poem.previous_poem = availablePoems[previousIndex.slug] || {};
        }

        const nextIndex = allPoems[index + 1];
        if (nextIndex) {
          poem.next_poem = availablePoems[nextIndex.slug] || {};
        }

        // Create the HTML page for the poem
        createPage('poem_detail.html', `/book/${book.slug}/poem/${slug}/`, {
          book,
          poem,
          slug: slug,
        });
      }
    }
  },
  minifyOptions: { collapseWhitespace: false },
};
