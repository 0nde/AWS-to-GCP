# AWS → GCP — modèle mental pour architectes AWS

Documentation française statique, sans backend, vérifiée le **31 juillet 2026**. Elle compare les modèles AWS et Google Cloud, sans présenter des analogies approximatives comme des équivalences exactes.

## Prérequis et démarrage

Node.js 22 ou supérieur est requis.

```bash
npm install
npm run dev
```

Ouvrir l’URL indiquée par Astro. La recherche locale est générée au build par Starlight/Pagefind.

## Vérifier et construire

```bash
npm run check
npm test
npm run build
npm run check:links
npx playwright install chromium
npm run test:e2e
npm run pdf
```

Le site statique est dans `dist/`. Le PDF complet est créé dans `artifacts/aws-vers-gcp-guide.pdf`.

## Arborescence

```text
src/content/docs/      20 chapitres MDX
src/data/mappings.ts   table de correspondance typée
src/components/        diagrammes, filtres et vue synthétique/détaillée
src/pages/impression.astro
scripts/               contrôle des liens et export PDF
e2e/                   tests Playwright et accessibilité
```

## Hébergement statique

### GitHub Pages

Le workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) construit et publie automatiquement `main`. Dans **Settings → Pages**, sélectionner **GitHub Actions** comme source. Il définit `SITE_URL` et `BASE_PATH` à partir du propriétaire et du nom de dépôt ; l’URL attendue est `https://<propriétaire>.github.io/<dépôt>/`.

### Cloudflare Pages

Connecter le dépôt, utiliser `npm run build` comme build command et `dist` comme output directory. Définir `SITE_URL` avec le domaine final ; laisser `BASE_PATH=/`.

### Amazon S3 et CloudFront

Construire avec `SITE_URL=https://docs.example.com` et `BASE_PATH=/`, synchroniser uniquement le contenu de `dist/` vers un bucket privé, puis servir via CloudFront avec Origin Access Control. Configurer les erreurs SPA n’est pas nécessaire : le site est pré-rendu page par page. Invalider CloudFront après publication.

## Mettre le contenu à jour

Chaque source est identifiée dans le chapitre [Parcours d’apprentissage et sources](src/content/docs/apprentissage-sources.mdx). Avant un changement, vérifier la documentation du service, les release notes, le launch stage et les disponibilités régionales ; mettre à jour la date de vérification et exécuter la suite de contrôles ci-dessus.

Le guide ne constitue pas un avis juridique, de conformité ou de tarification contractuelle.
