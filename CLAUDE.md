# Data Atlas handoff for Claude Code

You are maintaining an existing job portal, not creating a replacement design. Start with README.md and package.json. The source includes the professional Data Atlas interface, India/global/company/experience filters, direct employer links, a persistent job index, refresh evidence, expiry handling, and country animal discovery alerts.

## User's objective

Publish this package on GitHub Pages with GitHub Actions running rotating scan batches approximately every 30 minutes. Keep a manual workflow trigger. The user also wants to run and maintain the application with Claude Code without depending on ChatGPT hosting.

## Architecture

- app/JobBrowser.tsx: existing portal adapted for static Pages and local Node mode.
- app/static-api.ts: browser-side search and directory queries on published JSON; no server requests or secret GitHub token on Pages.
- app/main.tsx: loads generated data and polls for a newly published report.
- lib/: shared parsers, 12,310 public source definitions, expiry checks, reconciliation, filtering and evidence types.
- server/store.ts: Node-only scanner and filesystem state; bounded per-source requests; no Cloudflare bindings or OpenAI APIs.
- server/server.ts: local HTTP server and independent 30-minute batch scheduler. Bind is 127.0.0.1 by default. Do not expose publicly without adding authentication, rate limits and TLS deployment guidance.
- scripts/scan.ts: bounded batch scanner and persistent cursor. Do not confuse a batch with a full-world scan.
- scripts/publish-data.ts: exports state into public/data for static hosting.
- scripts/persist-state.mjs: writes state to the atlas-data Git branch without changing the main checkout; uses the workflow's GITHUB_TOKEN via git checkout credentials. Never put tokens in the browser bundle.
- .github/workflows/scan-and-publish.yml: scheduled/manual scan, state persistence, static build and Pages deployment.
- state/seed.json: old initial snapshots. Not a fresh scan. Preserve source timestamps and unverified labels.
- state/state.json: local generated data, ignored on main. Never commit LinkedIn contacts or private user records.

## Commands

Node >=22.18.0 required. npm ci; npm run check; npm test. npm start runs the full local app. npm run scan runs one standalone batch (stop the local server first). npm run publish:data && npm run build creates GitHub Pages output in dist.

## Invariants

1. Jobs go into Explore jobs when actually retrieved. Starting a new batch must not clear existing active jobs.
2. Failed/blocked/incomplete requests must not pretend there were zero jobs or delete old roles. Keep them unverified.
3. Complete successful source feeds remove missing jobs. Explicit expiry and closure checks remove jobs from both Explore and Found open postings. Limited checks cannot prove every vacancy is open or closed.
4. Job discovery is not employer posting date. Keep first-collection labels honest.
5. Country animal alerts must fire only for real new discoveries, not fabricated demo results. Keep reduced-motion support.
6. No claim of complete worldwide/LinkedIn coverage. LinkedIn sign-in does not provide connections access; CSV remains local.
7. Scheduled Actions can be delayed, and a complete scan of 12,310 sites can take many batches. Preserve cursor and show timestamps.
8. Preserve the scan evidence and direct official application links.
9. Do not delete atlas-data during a normal deployment. Its history is separate from source.
10. Do not start both a standalone scanner process and the Node server against the same state/state.json.

## Suggested first request from the owner

“Read README.md and CLAUDE.md, install and test the project, then help me publish it to my GitHub repository with GitHub Pages. Keep the atlas-data state branch, 30-minute Actions schedule, manual Run workflow option, persistent jobs, expiry checks and country animal alerts. Do not invent credentials or say it is deployed until GitHub confirms success. Ask me to authenticate through the normal account flow when needed.”

No Claude or OpenAI API key is needed to run the scanner. Claude assists development; Node/GitHub Actions executes the job collection code.

## Latest handover — 29 October 2026

Read START-HERE.md and HANDOVER.md before deployment or refactoring. They describe live v24 parity, portable differences, unimplemented authentication and SEO configuration. The country flags and stable filter toggle are already implemented; do not replace the animal alerts with Spider-Man or restore the removed character animation.

`npm run build` now includes scripts/seo.ts: crawlable index, static individual job pages, sitemap/robots, canonical URLs and conservative eligible JobPosting data. lib/job-path.ts defines filesystem-safe job URLs shared by UI and exporter. Set the real SITE_URL before publishing; never use an example hostname or the old ChatGPT domain as canonical. New Search Console HTML verification uses GOOGLE_SITE_VERIFICATION, not a DNS/account token. Confirm all Pages-relative paths after deployment.

The package's seed is historical, not a live R2 export. Browser saved jobs and private contacts are not migrated. All 250 country flag SVGs are local with MIT attribution. Preserve localMode branches in JobBrowser and the static-api adapter when porting hosted changes.
