# Validation — 29 October 2026

This report describes the portable handover package, not a completed GitHub deployment.

## Passed in this preparation

- Clean `npm ci` from package-lock.json.
- `npm run check` (TypeScript).
- `npm test`: **68 tests passed**, zero failed. Covers provider pagination/parsing, persistent jobs, expiry and explicit closures, failed/limited checks, posting-date precision and IST boundaries, browser discovery queue logic, local file state and isolated Git data-branch persistence, and SEO URL/schema rules.
- `npm run publish:data` generated seed-based published JSON.
- `npm run build` generated the Pages frontend plus static SEO pages.
- `npm run build:local` generated the standalone Node frontend.
- Static SEO output validation: **2,804 historical seed job-detail pages plus the homepage**; 2,805 sitemap URLs with the configured repository-path prefix; every generated job page had visible job content and an employer-application link. The homepage contained normal links and no JobPosting schema on the list itself.
- Seed SEO output emitted **zero JobPosting schema pages**, correctly withholding eligibility for old snapshots. New qualifying source data is needed for eligible markup. Unit tests check exact-date/country eligibility and reject remote, ambiguous, estimated, expired and stale rows.
- The example origin `https://example.github.io/data-atlas/` was used only to test URL generation. Build output is excluded from the delivered ZIP. Workflow production builds get the real Pages base URL or SITE_URL repository variable.
- Local server API smoke check with scheduled scans disabled: search returned 244 India-filtered seed roles; published scan metadata and the local India flag SVG were served successfully. The process was stopped after verification.
- Workflow YAML parsed; schedule is `7,37 * * * *`; Pages configuration precedes the production build.
- All 250 supported country/territory codes have local SVG flag assets. The live hosted v24 flag-popup and stable-filter changes were ported without replacing portable runtime branches.
- No temporary popup-preview route, production test-job insertion, account token, node_modules, dist, generated mutable state or git credentials is included in the release.

## Existing UI verification from the hosted v24 update

A local sample-only popup displayed the India flag beside the tiger and in the country label. Show/Hide preserved the selected location and remote switch state; filter tilt was removed. The hosted update was published separately. This report does not claim a new GitHub browser deployment was tested.

## Limitations and remaining acceptance

- No live full-directory crawl was run for this handover. Unit tests use controlled provider fixtures; they are not evidence that all 12,310 career sites currently succeed.
- Seed data is old collected data. Its timestamps are retained and must not be advertised as a fresh scan. The current hosted live database and browser-local private data are not exported.
- The Vite build warns about a large bundle (~3.3 MB uncompressed JS). No Lighthouse/performance score or exhaustive mobile browser test is claimed.
- No GitHub repository, Pages publication, running schedule, custom domain, Search Console property, OAuth credentials or AI API service was provisioned. GitHub/HTTPS and schema acceptance must be checked in the real deployed environment.
- No guarantee of every worldwide vacancy, LinkedIn feed access, exact 30-minute execution, complete sweep every 30 minutes, indexing or ranking.

Follow HANDOVER.md's first-deployment acceptance checks before switching the production address.
