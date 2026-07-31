import { mkdirSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

if (!existsSync('dist')) throw new Error('Exécutez npm run build avant npm run pdf.');
const server = spawn(process.execPath, ['./node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4322'], { stdio: 'ignore' });
const waitForServer = async () => { for (let i = 0; i < 40; i++) { try { const response = await fetch('http://127.0.0.1:4322/impression/'); if (response.ok) return; } catch {} await new Promise((resolve) => setTimeout(resolve, 250)); } throw new Error('Le serveur de prévisualisation ne démarre pas.'); };
try {
  await waitForServer();
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4322/impression/', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' }); mkdirSync('artifacts', { recursive: true });
  await page.pdf({ path: 'artifacts/aws-vers-gcp-guide.pdf', format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' } });
  await browser.close(); console.log('PDF créé : artifacts/aws-vers-gcp-guide.pdf');
} finally { server.kill(); }
