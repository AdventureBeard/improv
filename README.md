# Improv

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

**Note**: Improv is currently unfinished; this README currently describes functionality that doesn't exist yet.

A model-backed generative text grammar tool for javascript. Improv is similar to Tracery in that it can generate random, procedurally generated text recursively. Also like Tracery, Improv includes some basic templating functionality.

Unlike Tracery, however, Improv generators refer to *models* to build text. This allows for more sophisticated text generation by referencing an underlying world model.

## Installation

Improv is an npm module, but it should work fine in a browser environment through Webpack or Browserify.

```sh
$ npm install --save improv
```

## Snippets

The default export from this module is a constructor that creates text generators from two arguments: A snippets object, and an (optional) options object.

A snippets object is just a plain JavaScript object. Each property of that object is a "snippet", a structured collection of phrases. The structure for a snippets object is:

```js
{
  "animal-gesture": {
    "groups": [
      {
        "tags": [
          ["pet", "dog", "puppy"],
          ["status", "happy"]
        ],
        "phrases": [
          "The puppy wags his tail excitedly."
          "The puppy yips happily."
        ]
      },
      {
        "tags": [
          ["pet", "cat"],
          ["status", "tired"]
        ],
        "phrases": [
          "The cat groans exhaustedly."
        ]
      }
    ]
  }
}
```

Because snippets are plain data objects, they can be conveniently loaded from JSON files.

## Instantiating a Generator

An Improv generator is a collection of snippets attached to a configuration, which defines its behavioural specifics.

The main option, currently, is `filters`, a list of filters that the generator should apply when choosing which phrases are valid.

```js
/* Improv itself is written in ES6 through Babel */
import Improv from "improv";

const myGenerator = new Improv(snippetObject, {
  filters: [Improv.filters.mismatchFilter]
});

let text = myGenerator.gen('snippet-name', modelObject);
```

## Filters

Improv comes witht a number of filters previously defined as properties of `Improv.filters`. However, those are just regular functions; you can use your own. A filter is a function that takes a single group (from a snippet) and a model object, and returns either a number, or `null`.

`null` indicates that the group in question is inappropriate and should be excluded from selection entirely. A number, normally a small positive or negative integer, is treated as a scoring offset. The numeric results from each filter are added up to form a salience score. Improv, when generating text, will use only text from the highest-scoring groups.

### Tags

While models and groups can have any properties you want and you can write custom filters that take them into account, Improv by default relies on a tagging system.

A tag is an array of strings (words) that is treated as a series of increasingly specific categories. Two tags that have the same first element (`a[0] === b[0]`) are considered a *matched pair*; all of the default filters look only at matched pairs when making decisions. That is, if a model and a group have no tags with identical first elements, they have no defined relationship to one another, and the salience score for that group will be 0 (the baseline score).

Matched pairs are compared side-by-side; if one of the tags has an element that is different from the element in the same position in its counterpart, they are *mismatched*. For instance, `['pet', 'dog', 'spaniel']` and `['pet', 'cat']` are mismatched.

If both halves of the matched pair are identical (all elements are the same), this is a *total match*. If all elements in one half of the pair match their counterparts, but the other half is longer, this is a *partial match*. For instance, `['pet', 'dog']` and `['pet', 'dog', 'spaniel']` are partially matched.

Note that order matters; `['pet', 'dog', 'spaniel']` and `['pet', 'spaniel']` are mismatched, not a partial match. `['pet', 'dog']`and `['dog', 'pet']` are not a matched pair at all.

### Included filters

Improv.filter contains *factories* that return functions; most of these can be customised. The ones that can't use the factory pattern for consistency's sake.

#### mismatchFilter ()

Returns null if the group and model have a mismatched tag pair, 0 otherwise. This filter is useful for completely removing inappropriate phrases from the pool.

#### partialBonus (bonus = 1, cumulative = true)

The `partialBonus` filter calculates salience score based on partial matches. If `cumulative` is false, it will return a score offset equal to `bonus`; if it is true, it will multiply that bonus by the number of partial matches. If there are no partial matches, it returns 0.

#### fullBonus (bonus = 1, cumulative = true)

Behaves identically to the `partialBonus` filter, but counts full matches instead.

## License

MIT © [Bruno Dias](http://segue.pw/)


[npm-image]: https://badge.fury.io/js/improv.svg
[npm-url]: https://npmjs.org/package/improv
[travis-image]: https://travis-ci.org/sequitur/improv.svg?branch=master
[travis-url]: https://travis-ci.org/sequitur/improv
[daviddm-image]: https://david-dm.org/sequitur/improv.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/sequitur/improv