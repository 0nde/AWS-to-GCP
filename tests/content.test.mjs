import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const docs = readdirSync('src/content/docs').filter((name) => name.endsWith('.mdx'));
test('les vingt sections documentaires sont présentes', () => assert.equal(docs.length, 20));
test('la table contient au moins 75 correspondances', () => {
  const source = readFileSync('src/data/mappings.ts', 'utf8');
  assert.ok((source.match(/\['/g) || []).length >= 75);
});
test('les quatre architectures et les sources sont documentées', () => {
  const architecture = readFileSync('src/content/docs/architectures.mdx', 'utf8');
  for (const title of ['Application web', 'Kubernetes', 'Serverless', 'data et analytics']) assert.match(architecture, new RegExp(title, 'i'));
  assert.match(readFileSync('src/content/docs/apprentissage-sources.mdx', 'utf8'), /31\/07\/2026/);
});
