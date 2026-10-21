# Abhinav Tanwar — AI Engineering Portfolio

A responsive static portfolio for selected AI applications, professional experience, and contact details. Published at https://abhinav-tanwar.github.io/ through GitHub Pages.

## Local preview

```bash
python3 -m http.server 8040 --directory dist
```

## Project curation

`dist/projects.json` is the project catalog. Only entries with `featured: true` appear on the site. Keep the featured selection to four projects: three AI applications and one applied machine learning system. Link the complete repository collection instead of expanding the landing page.

Each project defines its name, category, description, stack, repository URL, and expanded detail. Keep descriptions aligned with the actual implementation and avoid unsupported performance claims. The catalog retains earlier work for future curation.

## Publishing

Changes merged into `main` trigger `.github/workflows/pages.yml`, which publishes `dist/`. No build step or API keys are required. Contact: abhinav.t@careeritjob.com.
