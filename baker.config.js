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
  return text;
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
    const books = data.books.list;
    for (const book of books) {
      const toc = data.toc[book.slug] || [];
      const allPoems = toc.map(getChildren).flat();
      const availablePoems = data.poems[book.slug] || {};
      availablePoems.forEach((p) => {
        p.html_url = `https://cummings.ee/book/${book.slug}/poem/${p.slug}/`;
      });
      book.html_url = `https://cummings.ee/book/${book.slug}/`;
      book.json_url = `https://cummings.ee/book/${book.slug}.json`;
      createPage('book_detail.json.njk', `/book/${book.slug}.json`, {
        text: JSON.stringify({ book, toc: availablePoems }, null, 2),
      });
      for (const [slug, poem] of Object.entries(availablePoems)) {
        poem.slug = slug;
        poem.html_url = `https://cummings.ee/book/${book.slug}/poem/${slug}/`;
        poem.json_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.json`;
        poem.yaml_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.yaml`;
        poem.txt_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.txt`;
        poem.markdown_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.md`;
        createPage(
          'poem_detail.json.njk',
          `/book/${book.slug}/poem/${slug}.json`,
          {
            text: JSON.stringify(poem, null, 2),
          }
        );
        createPage(
          'poem_detail.yaml.njk',
          `/book/${book.slug}/poem/${slug}.yaml`,
          {
            text: yaml.safeDump(poem, { indent: 2 }),
          }
        );
        createPage('poem_detail.md.njk', `/book/${book.slug}/poem/${slug}.md`, {
          poem,
        });
        createPage(
          'poem_detail.txt.njk',
          `/book/${book.slug}/poem/${slug}.txt`,
          {
            poem,
          }
        );
        const index = allPoems.findIndex((e, i) => e.slug === slug);
        const previousIndex = allPoems[index - 1];
        if (previousIndex) {
          poem.previous_poem = availablePoems[previousIndex.slug] || {};
        }
        const nextIndex = allPoems[index + 1];
        if (nextIndex) {
          poem.next_poem = availablePoems[nextIndex.slug] || {};
        }
        createPage('poem_detail.html', `/book/${book.slug}/poem/${slug}/`, {
          book,
          poem,
          slug: slug,
        });
      }
      createPage('book_detail.html', `/book/${book.slug}/`, {
        book,
        allPoems,
        availablePoems,
      });
    }
  },
  minifyOptions: { collapseWhitespace: false },
};
