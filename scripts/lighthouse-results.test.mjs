import { test } from 'node:test';
import assert from 'node:assert/strict';
import { median, summarize } from './lighthouse-results.mjs';
test('median preserves zero, ignores missing values and resists an outlier', () => {
  assert.equal(median([0, null, undefined]), 0);
  assert.equal(median([98, 20, 97]), 97);
  assert.equal(median([2, 4]), 3);
  assert.equal(median([null, undefined]), null);
});
const sample = (performance) => ({ path: '/tr', profile: 'mobile', status: 'TESTED', performance, accessibility: 1, bestPractices: 1, seo: 1, cls: 0 });
test('a failed or missing run cannot become a passing summary', () => {
  assert.equal(summarize([sample(1)], 3)[0].status, 'BLOCKED');
  assert.equal(summarize([sample(1), { path: '/tr', profile: 'mobile', status: 'BLOCKED' }], 2)[0].status, 'BLOCKED');
});
test('threshold status uses medians and keeps profiles separate', () => {
  const rows = summarize([sample(0.98), sample(0.97), sample(0.2), { ...sample(0.8), profile: 'desktop' }], 3);
  assert.equal(rows[0].performance, 0.97);
  assert.equal(rows[0].cls, 0);
  assert.equal(rows[0].status, 'PASS');
  assert.equal(rows[1].status, 'BLOCKED');
  assert.equal(summarize([sample(0.8)], 1)[0].status, 'FAIL');
});
