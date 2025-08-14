const test = require('node:test');
const assert = require('node:assert');
require('ts-node/register');

const { summarizeSnippets } = require('../lib/summarize.ts');

const snips = [
  { title: 't', url: 'https://example.com', snippet: 'info' },
];

test('summarizeSnippets includes citation brackets', () => {
  const out = summarizeSnippets(snips);
  assert.match(out, /^- info \[1\] https:\/\/example.com/);
});
