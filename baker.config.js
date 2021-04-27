const yaml = require('js-yaml');
const csv = require('json-2-csv');

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
    if (l.trim().length === 0) {
      // if the stanza is empty, we need to stick in at least one empty line
      if (thisStanza.length === 0) {
        thisStanza.push('&nbsp;');
      }
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

function formatLine(text) {
  return text.replace(/(  +)/g, "<span class='indent'>$1</span>");
}

function formatFirstLine(text) {
  const trimmed = text.trim();
  let t = text.replace(trimmed, `<span class='text'>${trimmed}</span>`);
  return t.replace(/(  +)/g, "<span class='indent'>$1</span>");
}

function parseFirstLine(text) {
  const lines = text.split(/\r?\n/);
  return lines[0].trim();
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
    formatLine,
    formatFirstLine,
  },
  // use createPages to generate pages on the fly
  createPages(createPage, data) {
    // Get all the books
    const books = data.books.list;

    // Create a list of all the URLs for our sitemap
    let urlList = ['https://cummings.ee/'];
    let poemList = [];
    let bookList = [];

    // Loop through them
    for (const book of books) {
      // Get the table of contents, if it exists
      const toc = data.toc[book.slug] || [];

      // Flatten the TOC, which may be nested, into a simple list
      const allPoems = toc.map(getChildren).flat();

      // Make a JSON file for the book and its metadata
      book.seo_description = book.description[0];
      allPoems.forEach((p) => {
        p.html_url = `https://cummings.ee/book/${book.slug}/poem/${p.slug}/`;
      });
      book.html_url = `https://cummings.ee/book/${book.slug}/`;
      book.json_url = `https://cummings.ee/book/${book.slug}.json`;

      const bookJson = {
        slug: book.slug,
        title: book.title,
        description: book.seo_description,
        year: book.year,
        public_domain: book.public_domain,
        source: book.source,
        html_url: book.html_url,
        json_url: book.json_url,
      };
      bookList.push(bookJson);

      createPage('book_detail.json.njk', `/book/${book.slug}.json`, {
        text: JSON.stringify({ book: bookJson, toc: allPoems }, null, 2),
      });

      // Pull the poems that have actually been keypunched
      const poemFiles = Object.entries(data.poems[book.slug] || {});
      const availablePoems = poemFiles.filter((o) => o[1].text);

      // Create the HTML page for the book
      createPage('book_detail.html', `/book/${book.slug}/`, {
        book,
        allPoems,
        availablePoems,
      });

      // Loop through those
      for (const [slug, poem] of availablePoems) {
        // Set all the poem metadata
        poem.description = poem.first_line || parseFirstLine(poem.text);
        poem.seo_description = poem.first_line || parseFirstLine(poem.text);
        poem.slug = slug;
        poem.html_url = `https://cummings.ee/book/${book.slug}/poem/${slug}/`;
        poem.json_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.json`;
        poem.txt_url = `https://cummings.ee/book/${book.slug}/poem/${slug}.txt`;
        urlList.push(poem.html_url);
        poemList.push({
          slug: poem.slug,
          title: poem.title,
          first_line: poem.first_line,
          book_slug: book.slug,
          book_title: book.title,
          text: poem.text,
          html_url: poem.html_url,
          json_url: poem.json_url,
          txt_url: poem.txt_url,
        });

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
    // Make sitemap
    createPage('sitemap.xml.njk', `sitemap.xml`, {
      urlList,
    });
    // Make data dumps
    createPage('book_list.json.njk', `/downloads/books.json`, {
      text: JSON.stringify(bookList, null, 2),
    });
    csv.json2csv(bookList, (err, text) => {
      if (err) {
        throw err;
      }
      createPage('book_list.csv.njk', `/downloads/books.csv`, {
        text,
      });
    });
    createPage('poem_list.json.njk', `/downloads/poems.json`, {
      text: JSON.stringify(poemList, null, 2),
    });
    csv.json2csv(poemList, (err, text) => {
      if (err) {
        throw err;
      }
      createPage('poem_list.csv.njk', `/downloads/poems.csv`, {
        text,
      });
    });
  },
  minifyOptions: { collapseWhitespace: false },
};
