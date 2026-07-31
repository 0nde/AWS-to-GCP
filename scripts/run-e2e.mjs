import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch('http://127.0.0.1:4321/')).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Le serveur Astro n’a pas démarré pour les tests E2E.');
};

try {
  await run(process.execPath, ['./node_modules/astro/bin/astro.mjs', 'dev', '--background', '--host', '127.0.0.1', '--port', '4321']);
  await waitForServer();
  await run(process.execPath, ['./node_modules/@playwright/test/cli.js', 'test']);
} finally {
  await run(process.execPath, ['./node_modules/astro/bin/astro.mjs', 'dev', 'stop']).catch(() => undefined);
}
