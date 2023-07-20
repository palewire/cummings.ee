const csv = require('json-2-csv');
const he = require('he');

const entrypoints = ['poem'];

function parsePoem(text) {
  if (!text) {
    return [];
  }
  const lines = text.split(/\r?\n/);
  let stanzaList = [];
  let thisStanza = [];
  let lineNumber = 0;
  lines.forEach((l) => {
    // If it's an empty line, start a new stanza
    if (l.trim().length === 0) {
      // if the stanza is empty, we need to stick in at least one empty line
      if (thisStanza.length === 0) {
        thisStanza.push({ text: '&nbsp;', number: null });
      }
      stanzaList.push(thisStanza);
      thisStanza = [];
    } else {
      // Add to the current stanza
      lineNumber += 1;
      thisStanza.push({
        text: l,
        number: lineNumber,
      });
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

function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

function escapeObjectValues(obj) {
  console.log(obj);
  if (obj.description) {
    obj.description = he.encode(obj.description);
  }
  if (obj.source) {
    obj.source = he.encode(obj.source);
  }
  return obj;
}

function toJson(obj) {
  return JSON.stringify(obj, null, 2);
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
        text: toJson({ book: escapeObjectValues(bookJson), toc: allPoems }),
      });

      // Pull the poems that have actually been keypunched

      const poemFiles = Object.entries(data.poems[book.slug] || {});
      const availablePoems = clone(
        poemFiles
          .filter((o) => o[1].text)
          .map(([s, o]) => {
            o.slug = s;
            return o;
          })
      );

      // Create the HTML page for the book
      createPage('book_detail.html', `/book/${book.slug}/`, {
        book,
        allPoems,
        availablePoems,
      });

      // Loop through those
      for (const poem of availablePoems) {
        // Set all the poem metadata
        poem.description = poem.first_line || parseFirstLine(poem.text);
        if (poem.titled) {
          poem.seo_title = poem.title;
        } else {
          poem.seo_title = poem.first_line || parseFirstLine(poem.text);
        }
        poem.seo_description = `A poem by E. E. Cummings in “${book.title}”`;
        poem.html_url = `https://cummings.ee/book/${book.slug}/poem/${poem.slug}/`;
        poem.json_url = `https://cummings.ee/book/${book.slug}/poem/${poem.slug}.json`;
        poem.txt_url = `https://cummings.ee/book/${book.slug}/poem/${poem.slug}.txt`;
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
          `/book/${book.slug}/poem/${poem.slug}.json`,
          {
            text: toJson(poem),
          }
        );

        // Create a text output
        createPage(
          'poem_detail.txt.njk',
          `/book/${book.slug}/poem/${poem.slug}.txt`,
          {
            poem,
          }
        );

        // Get the previous and next poems, if they exist
        const index = allPoems.findIndex((e, i) => e.slug === poem.slug);

        const previousIndex = allPoems[index - 1];
        if (previousIndex) {
          poem.previous_poem = data.poems[book.slug][previousIndex.slug];
        }

        const nextIndex = allPoems[index + 1];
        if (nextIndex) {
          poem.next_poem = data.poems[book.slug][nextIndex.slug];
        }

        // Create the HTML page for the poem
        createPage(
          'poem_detail.html',
          `/book/${book.slug}/poem/${poem.slug}/`,
          {
            book,
            poem,
            slug: poem.slug,
          }
        );
      }
    }
    // Make poem list
    createPage('first_lines.html', `/first-lines/`, {
      poemList,
    });
    // Make sitemap
    createPage('sitemap.xml.njk', `sitemap.xml`, {
      urlList,
    });
    // Make robots.txt
    createPage('robots.txt.njk', 'robots.txt');
    // Make data dumps
    createPage('book_list.json.njk', `/downloads/books.json`, {
      text: toJson(bookList.map(escapeObjectValues)),
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
      text: toJson(poemList),
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
