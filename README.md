# Abhinav Tanwar — Portfolio

Static, dependency-free portfolio. Serve `dist/` with any static server. GitHub Pages can publish these files from the repository root, or use the included Pages workflow after merging.

## Add a project
Edit `dist/projects.json`. Each item has `id`, `name`, `title`, `category`, `description`, `detail`, `stack`, and `repo` (a public GitHub URL or null). Categories supported by the filter: Generative AI, Machine learning, Developer tools. Add filter buttons for additional categories. Keep private repositories unlinked until intentionally made public. No build is required.

## Content
Primary source: user-supplied new resume. Dates explicitly confirmed by the user: Citigroup May 2026–Present; Zomato July 2021–December 2024. Public contact explicitly confirmed: abhinav.t@careeritjob.com. Do not upload the original resume without reviewing its outdated dates and contact information.

## Deploy to GitHub Pages
Create `Abhinav-tanwar.github.io`, initialized with a README. Add this source on a review branch, merge its PR, and select GitHub Actions in Settings → Pages. The workflow deploys `dist/`. The Sites hosting manifest is separate from Pages and contains no credentials.
