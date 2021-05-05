# Contributing to cummings.ee

The following is a set of guidelines for contributing to this repository and therefore the e.e. cumming free poetry archive at [cummings.ee](https://cummings.ee/).

#### Table Of Contents

- [Code of Conduct](#code-of-conduct)
- [About this site](#about-this-site)
- [Reporting an error](#reporting-an-error)
- [Sources](#sources)
- [Transcribing poems](#reporting-an-error)
- [Style](#style)

## Code of Conduct

This project and everyone participating in it is governed by the project's [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [b@palewi.re](mailto:b@palewi.re).

## About this site

This site is run by [Ben Welsh](https://palewi.re/who-is-ben-welsh/). You can reach him at [b@palewi.re](mailto:b@palewi.re). All of the poems here, as well as all of the code, are available for free in the public domain.

That is due to the way U.S. copyright law works, each Jan. 1 another year of past literature opens up. In the last few years, Cummings' first books have clicked over. As more poems enter the public domain, they will be added here. Since the poems are free, I figure the code ought to be too.

## Reporting an error

If you see an error on the site, you can [file an issue](https://github.com/ee-cummings-archive/cummings.ee/issues) here on GitHub or send a report to [b@palewi.re](mailto:b@palewi.re). All types of bug reports are welcome. If believe you have spotted a typo in how the poetry was transcribed, please be as detailed as possible about the error and provide your sourcing, if possible.

## Sources

The tables of contents and texts on this site are largely drawn from the first editions published in the 1920's that have entered the public domain. The order of poems and their groupings attempt to be faithful to those texts.

Small exceptions are made when the spellings and spacings in the first editions vary from Liveright’s [“Complete Poems,”](https://wwnorton.com/books/9781631490415/) which Cummings scholars regard as the most authoritative source.

The standard approach for transcribing poems thus far has been to use the first edition as the initial guide. Then, when the poem is proof read prior to being republished, the transcription is compared against the Liveright edition. In the rare case of any inconsistency, the copy found in the Liveright version is substituted.

A scanned first edition of the “Tulips and Chimneys” can be found in [this repository](https://github.com/ee-cummings-archive/cummings.ee/tree/master/_workspace/tulips-and-chimneys). A scanned first edition of “XLI Poems” has been [posted online by Hathi Trust](https://catalog.hathitrust.org/Record/001028344).

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
 lame balloonman

 whistles    far    and wee

 and eddieandbill come
 running from marbles and
 piracies and it’s
 spring

 when the world is puddle-wonderful

 the queer
 old balloonman whistles
 far    and    wee
 and bettyandisbel come dancing

 from hop-scotch and jump-rope and

 it’s
 spring
 and

    the

          goat-footed

 balloonMan    whistles
 far
 and
 wee
```

In rare cases where the poem's layout would be ruined by the text wrapping common on small devices, such as mobile phones, an `unwrap` attribute in the YAML file should be set to `true`. This will overflow the text on all devices and maintain the integrity of the author's linebreaks in all cases.

Most of Cummings’s poems don't have a title or headline. When they do, the `titled` attribute should be set to `true`.

## Style

*White space*: When entering poems into the YAML file, you should endeavor to include white spaces that, as best as possible, line up with the indentations seen on the page. Due to the variable letter spacing of fonts, there is no way to perfectly recreate the original document. [The stylesheets](https://github.com/ee-cummings-archive/cummings.ee/blob/master/styles/components/_poem.scss#L48) used to format the archive's website allow for the letter spacing of fonts to be adjusted on a line by line basis, which is where fine tuning can be applied.

*Quotation marks*: Curly quotes should be used unless it's clear the author intended otherwise. 

*Ellipses*: Consecutive periods should be used, not any special character marks. Look carefully and count how many the author included. If there are no white spaces between the periods and the surrounding words, do not insert any.

