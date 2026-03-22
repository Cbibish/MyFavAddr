# My Favorite Addresses app

This is a demo app to work around tests and CI, you should clone this repo, remove the `.git` folder and push it to your own public repo!

The client folder is empty, you may create an interface to communicate with the server! This is kind of a bonus.

## Documentation

All project documentation is available at the root of the repository:

- `SpotBook_Cahier_Recette.docx` — Test acceptance document (cahier de recette) with all test scenarios, stakeholders and delivery decision
- `SpotBook_Cahier_Recette.xlsx` — Same cahier de recette in Excel format for easier filling
- `MFP_Reponses_Theoriques.docx` — Answers to all theoretical questions (TDD, CI pipeline, coverage, unit vs integration tests, Bruno contract tests)

## Stack

- **Server** — Node.js, Express, TypeScript, TypeORM, SQLite
- **Client** — React, Vite, TypeScript
- **Tests** — Jest, Supertest, Playwright, Bruno
- **CI** — GitHub Actions (runs on push to `dev` and `master`)
