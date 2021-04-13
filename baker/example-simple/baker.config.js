import { intcomma } from 'journalize';

export default {
  // special case because it is in a directory
  input: './example-simple',

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
    otherintcomma: intcomma,
    square(n) {
      n = +n;

      return n * n;
    },
    logContext() {
      console.log(this.context);

      return 'check console';
    },
  },

  nunjucksTags: {
    doubler(n) {
      return `<p>${n} doubled is ${n * 2}</p>`;
    },
    delay,
    logger(x, y, z) {
      console.log(x, y, z);
    },
  },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function delay(ms = 2000) {
  console.log(`Delaying for ${ms}ms...`);
  await sleep(ms);
  console.log('Done delaying.');

  return `I was delayed for ${ms}ms!`;
}

delay.async = true;
