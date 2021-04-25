# Contributing to cummings.ee

The following is a set of guidelines for contributing to this repository and therefore the e.e. cumming free poetry archive at [cummings.ee](https://cummings.ee/).

#### Table Of Contents

- [Code of Conduct](#code-of-conduct)
- [About this site](#about-this-site)
- [Reporting an error](#reporting-an-error)
- [Transcribing poems](#reporting-an-error)

## Code of Conduct

This project and everyone participating in it is governed by the project's [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [b@palewi.re](mailto:b@palewi.re).

## About this site

This site is run by [Ben Welsh](https://palewi.re/who-is-ben-welsh/). You can reach him at [b@palewi.re](mailto:b@palewi.re). All of the poems here, as well as all of the code, are available for free in the public domain.

That is due to the way U.S. copyright law works, each Jan. 1 another year of past literature opens up. In the last few years, Cummings' first books have clicked over. As more poems enter the public domain, they will be added here. Since the poems are free, I figure the code ought to be too.

## Reporting an error

If you see an error on the site, you can [file an issue](https://github.com/ee-cummings-archive/cummings.ee/issues) here on GitHub or send a report to [b@palewi.re](mailto:b@palewi.re). All types of bug reports are welcome. If believe you have spotted a typo in how the poetry was transcribed, please be as detailed as possible about the error and provide your sourcing, if possible.

## Transcribing poems

Gaps in the archive can be filled by adding new files to the `_data/poems` directory. Poems should be in [YAML format](https://en.wikipedia.org/wiki/YAML) and stored in a folder slugged to match the book where it was published. Poem file names should be slugged to match the poem's name.

For instance, the poem "Chansons Innocentes I" appears in the book "Tulips and Chimneys." So, following standard slugging conventions, the file is stored at [\_data/poems/tulips-and-chimneys/chansons-innocentes-i.yaml](https://github.com/ee-cummings-archive/cummings.ee/blob/master/_data/poems/tulips-and-chimneys/chansons-innocentes-i.yaml). The slugs should match what is found in the book's [table of contents file](https://github.com/ee-cummings-archive/cummings.ee/blob/master/_data/toc/tulips-and-chimneys.json).

The poem file should have at least three keys: `title` for the name of the poem; `first_line` for the opening line; and `text` for the full contents of the poem. The convention here is to store the text as a multi-line string with one space of indentation. Here, as an example, is "Chansons Innoncentes I":

```yaml
title: Chansons Innocentes I

first_line: in Just-

text: |1-
 in Just-
 spring     when the world is mud-
 luscious the little
 lame baloonman

 whistles    far    and wee

 and eddieandbill come
 running from marbles and
 piracies and it’s
 spring

 when the world is puddle-wonderful

 the queer
 old baloonman whistles
 far    and    wee
 and bettyandisbel come dancing

 from hop-scotch and jump-rope and

 it’s
 spring
 and

    the

          goat-footed

 baloonMan    whistles
 far
 and
 wee
```

In rare cases where the poem's layout would be ruined by the text wrapping common on small devices, such as mobile phones, an `unwrap` attribute in the YAML file should be set to `true`. This will overflow the text on all devices and maintain the integrity of the author's linebreaks in all cases.
