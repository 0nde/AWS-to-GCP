import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || undefined;
const accessibilityEnhancements = {
  name: 'accessibility-enhancements',
  hooks: {
    'astro:config:setup': ({ injectScript }) => injectScript('page', `
      const enhanceScrollableRegions = () => document.querySelectorAll('pre').forEach((pre) => {
        if (pre.scrollWidth > pre.clientWidth) {
          pre.tabIndex = 0;
          pre.setAttribute('aria-label', 'Bloc de code défilable horizontalement');
        }
      });
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceScrollableRegions);
      else enhanceScrollableRegions();
      document.addEventListener('astro:page-load', enhanceScrollableRegions);
      const addQuickSummary = () => {
        if (document.querySelector('[data-quick-summary]')) return;
        const link = document.createElement('a');
        link.dataset.quickSummary = 'true';
        link.className = 'quick-summary-link';
        link.href = '${base}';
        link.textContent = 'Retour au sommaire';
        document.body.append(link);
      };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addQuickSummary);
      else addQuickSummary();
      document.addEventListener('astro:page-load', addQuickSummary);
    `),
  },
};

export default defineConfig({
  output: 'static',
  site,
  base,
  integrations: [
    accessibilityEnhancements,
    starlight({
      title: 'AWS → GCP',
      description: 'Le modèle mental GCP pour architectes AWS expérimentés.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Français', lang: 'fr-FR' },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: 'Démarrer', items: [
          { label: 'Vue d’ensemble', slug: 'index' },
          { label: 'Modèle mental GCP', slug: 'modele-mental' },
          { label: 'Parcours d’apprentissage', slug: 'apprentissage-sources' },
        ] },
        { label: 'Fondations', items: [
          { label: 'Organisation et Landing Zones', slug: 'organisation' },
          { label: 'IAM et identités', slug: 'iam' },
          { label: 'Réseau', slug: 'reseau' },
          { label: 'Compute, containers et serverless', slug: 'compute' },
          { label: 'Stockage et bases de données', slug: 'stockage-databases' },
          { label: 'Messaging et event-driven', slug: 'messaging' },
        ] },
        { label: 'Plateforme', items: [
          { label: 'Data, analytics et IA', slug: 'data-ia' },
          { label: 'Sécurité', slug: 'securite' },
          { label: 'Observabilité et opérations', slug: 'observabilite' },
          { label: 'IaC et CI/CD', slug: 'iac-cicd' },
          { label: 'Gouvernance et conformité', slug: 'gouvernance' },
          { label: 'FinOps et facturation', slug: 'finops' },
          { label: 'Résilience et DR', slug: 'resilience' },
          { label: 'Souveraineté et localisation', slug: 'souverainete' },
        ] },
        { label: 'Références pratiques', items: [
          { label: 'Correspondances de services', slug: 'correspondances' },
          { label: 'Architectures comparées', slug: 'architectures' },
          { label: 'Anti-patterns AWS → GCP', slug: 'anti-patterns' },
        ] },
      ],
    }),
    mdx(),
  ],
});
