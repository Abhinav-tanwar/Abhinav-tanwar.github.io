# Abhinav Tanwar — AI Engineering Portfolio

A responsive static portfolio for selected AI applications, professional experience, and contact details. Published at https://abhinav-tanwar.github.io/ through GitHub Pages.

## Local preview

```bash
python3 -m http.server 8040 --directory dist
```

## Project curation

`dist/projects.json` is the project catalog. Only entries with `featured: true` appear on the site. The featured selection includes five main projects: three AI applications, an AI evaluation workspace, and one applied machine learning system. Give every project the same card size and visual priority. Link the complete repository collection instead of expanding the landing page.

Each project defines its name, category, description, stack, repository URL, and expanded detail. Keep descriptions aligned with the actual implementation and avoid unsupported performance claims. The catalog retains earlier work for future curation.

## Publishing

Changes merged into `main` trigger `.github/workflows/pages.yml`, which publishes `dist/`. No build step or API keys are required. Contact: abhinav.t@careeritjob.com.

## Evidence on project cards

Featured entries may include an `evidence` object with two headline `metrics`, an observed `result`, a `method`, a `limit`, screenshot `caption`, and primary-source `sources`. Keep automated checks, synthetic integration tests, and held-out model evaluation explicitly distinct. All five main projects use equally sized cards with a centered final row. Screenshots live in `dist/assets/evidence/` and show the actual local applications. Results and methodology expand in the project dialog; the landing page stays limited to five featured projects.
