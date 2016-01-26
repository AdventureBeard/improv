import Improv from './lib/index.js';
import jetpack from 'fs-jetpack';
import _ from 'lodash';

function loadSpec () {
  const spec = {};
  const snippetFiles = jetpack.find(`${__dirname}/hms_data`, {
    matching: '*.json'
  });
  snippetFiles.forEach(function (filename) {
    const snippet = jetpack.read(filename, 'json');
    if (typeof snippet.groups === 'undefined') {
      snippet.groups = [];
    }
    if (snippet.phrases) {
      snippet.groups.push({
        tags: [],
        phrases: snippet.phrases
      });
    }
    spec[snippet.name] = snippet;
  });
  return spec;
}

const shipMate = new Improv(loadSpec(), {
  filters: [
    Improv.filters.mismatchFilter(),
    Improv.filters.unmentioned(2),
    Improv.filters.partialBonus(),
    Improv.filters.fullBonus(),
    Improv.filters.dryness()
  ],
  persistence: false,
  reincorporate: true
});

const newModel = function () {
  return { tags: [] };
};

const output = function () {
  console.log('\n---\n');
  console.log(shipMate.gen('root', newModel()));
};

_.times(10, output);