import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (!existsSync(dist)) throw new Error('Le dossier dist est absent. Exécutez npm run build avant check:links.');
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const files = walk(dist).filter((file) => file.endsWith('.html'));
const errors = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
    if (!href.startsWith('/') || href.startsWith('//') || href.includes('://') || href.startsWith('/_astro/')) continue;
    const [rawPathname, hash] = href.split('#');
    const pathname = basePath && (rawPathname === basePath || rawPathname.startsWith(`${basePath}/`))
      ? rawPathname.slice(basePath.length) || '/'
      : rawPathname;
    const candidates = [join(dist, pathname, 'index.html'), join(dist, pathname), join(dist, `${pathname}.html`)];
    const target = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
    if (!target) { errors.push(`${file}: lien interne introuvable ${href}`); continue; }
    if (hash && !readFileSync(target, 'utf8').includes(`id="${hash}"`)) errors.push(`${file}: ancre introuvable ${href}`);
  }
}
if (errors.length) throw new Error(errors.join('\n'));
console.log(`${files.length} pages HTML et leurs liens internes sont valides.`);
