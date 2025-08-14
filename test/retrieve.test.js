const test = require('node:test');
const assert = require('node:assert');
require('ts-node/register');

const { searchOfficial } = require('../lib/retrieve.ts');

test('searchOfficial rejects on fetch failure', async () => {
  const origFetch = global.fetch;
  global.fetch = async () => { throw new Error('fail'); };
  await assert.rejects(() => searchOfficial('test'));
  global.fetch = origFetch;
});

test('searchOfficial rejects without API key', async () => {
  delete process.env.SERPER_API_KEY;
  delete process.env.BING_API_KEY;
  await assert.rejects(() => searchOfficial('test'), /missing_api_key/);
});
