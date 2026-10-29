# Data Atlas — project state and operator handover

Prepared 29 October 2026. Owner: Ajay. Existing public site: https://ajay-global-data-job-radar.ajayboddeda3643.chatgpt.site/

## Source provenance

The current hosted reference is version 24, commit 77c23ac46c6baf94bfd9df47b0edd0589fb9e1fb, published 29 October 2026. This package continues the existing portable Vite/React + Node source, with the v24 country flag and stable-filter changes ported into it. It is intentionally adapted for GitHub Pages; it is not a byte-for-byte deployment of the hosted Cloudflare Worker. GitHub repository URL and production domain remain unset until the owner creates/selects them.

## Product and decisions already made

- A professional, light blue/white Data Atlas job portal focused on data engineer, analytics engineer, ETL and related data-platform roles, India first and worldwide.
- Approximately 12,310 tracked source entries, including startups, mid-sized firms, services companies, banks and large product employers. Entries remain in the directory with zero verified roles. A tracked entry does not imply current hiring, independence of duplicate boards, or complete company coverage.
- Curated employer groups and aliases include MAANG, Accenture, Capgemini, TCS, Infosys, HSBC, JLL, T-Systems and EXL/Clairvoyant. Provider adapters include Greenhouse, Lever, Ashby, Workday, SmartRecruiters, Eightfold, Amazon and limited official HTML checks.
- Direct employer application links; role/company/location/provider/seniority/experience/remote-label/date filters; saved jobs in browser storage; referral message drafts with locally imported LinkedIn connections CSV.
- Real per-source check evidence, status, timing, discovered/updated/removed counts, reports and Found open postings. Repeated scans preserve active jobs; complete successful feed absence and explicit expiry/closures remove jobs. Failures retain old roles as unverified.
- Employer posting dates are distinct from discovery/check dates. Posted today uses IST. Relative employer dates are labeled approximate; an old role found today is not labeled newly posted.
- Newly discovered roles animate one by one with original country-associated animal cartoons, country maps and locally bundled country flags. Country follows the role location. Company category changes the animal’s expression. Unknown locations are not guessed; multiple-country roles display multiple flags with the generic mascot. Popups pause while the tab is hidden, deduplicate on each device, and retain pending notices where browser storage allows.
- Spider-Man was removed. Preserve the career feeds → layered job index → application 3D illustration, reduced-motion/data-saver handling and off-screen animation pause. It is decorative and must never imply a real check happened.
- Logos are local for curated employers, otherwise deterministic initials icons. No external logo request is needed. Preserve artwork licenses and sources.
- Job filters no longer tilt. Show/Hide retains selections; remote and unspecified-experience switches have focus states and larger touch targets.

## Runtime differences that must be communicated

| Capability | GitHub Pages + Actions | Local Node mode |
| --- | --- | --- |
| Website | Static Vite output, available while laptop is off | Running Node process on owner's computer |
| Search/filter | Client-side against published JSON | Node APIs |
| Manual scan | Authenticated GitHub Run workflow; then publication | In-app source/full scan |
| Top Check updates | Reloads published data | In-app scanner trigger |
| Scheduled scans | Actions rotating batches requested every 30 minutes | Server timer plus independent page timer |
| State | atlas-data Git branch | state/state.json |
| Browser closed | Actions still runs | Server must remain alive; browser-only scans stop |
| Public accounts | No Google/LinkedIn OAuth configured | No Google/LinkedIn OAuth configured |

Scheduled/manual defaults: 400 sites per run, four workers, 20-minute dispatch budget. Push deployments use up to five sources and a two-minute dispatch budget. Standard scan settings use a, 90-second per-source budget, 28-minute workflow job timeout. At 400 completed checks per run a full 12,310-entry rotation needs at least 31 runs, about 15.5 hours at two runs/hour, before delays or failures. A 30-minute schedule is not complete global refresh every 30 minutes. Actions runs can be delayed/dropped under load, and public scheduled workflows can be disabled after repository inactivity; consult current GitHub documentation. Monitor last published time and scan cursor, not just green build status.

## SEO work included in this package

- Build-time HTML homepage with job links and individual job detail pages, not just an empty SPA root.
- Titles, descriptions, production canonical URLs, sitemap.xml, robots.txt and seo-report.json.
- JobPosting JSON-LD only for eligible recently checked physical-location rows with supplied exact publication dates and descriptions; unknown/relative dates and remote/ambiguous locations intentionally skip this markup.
- Atomic Pages publication drops generated pages for jobs removed from the current state. GitHub serves missing pages as 404. Expired jobs still present between scheduled publications disappear on the next generated publication; this is not immediate push notification to Google.
- SITE_URL comes from the actual Pages deployment configuration, with an optional repository variable override. GOOGLE_SITE_VERIFICATION accepts the new property's HTML verification content. Never reuse the hosted site's canonical hostname for the GitHub copy.

Not configured: Google Indexing API, redirects from the hosted domain, Search Console for the future domain, keyword landing pages, domain verification or guaranteed Google inclusion/ranking. Prior hosted sitemap was processed and indexing requested; that is not proof the new site is indexed. Never add JobPosting schema to a list page or invent metadata for schema eligibility.

## Outstanding requests and honest limits

1. Google and LinkedIn sign-in were requested but not implemented. Need separately registered OAuth applications, approved callback URLs, a backend/session design and user consent. Do not present placeholder login as functional.
2. LinkedIn standard sign-in does not grant the user’s connection graph. The current referral feature uses a local CSV and drafts, and does not send messages automatically. LinkedIn/Indeed listings are not directly imported.
3. Every employer in every country cannot be guaranteed. HTML/JavaScript-only boards, rate limits, blocked requests and search-based enterprise adapters can miss openings. Do not circumvent site protections or claim failures mean no hiring.
4. DuckDNS custom routing/HTTPS is not configured. DNS cannot run the worker or keep the laptop alive. Claude/Gemini subscriptions do not supply an always-on runtime for this code.
5. No account-wide synchronization of saved jobs, contacts, dismissals or preferences. A domain change/browser-storage reset can lose local selections; contacts must stay private.
6. Live cloud storage is not exported here. Seed jobs are historical and retain original check times. Do not mark the seed as a fresh scan or fabricate new discoveries. A real scan is necessary after deployment.
7. Public GitHub Actions state is public. Use only public listing data, never credentials, resumes or personal connections. Set a clear retention policy for the atlas-data branch as it grows.
8. The JS bundle is relatively large because the registry, maps and searchable directory ship together. Build emits a size warning; code-splitting and chunked datasets are future performance work. Functionality tests passed; no performance score is claimed.

## First deployment acceptance

- npm ci, npm run check, npm test, npm run publish:data and npm run build pass on Node 22.18+.
- Pages URL and a generated job-detail URL both load under the actual repository subpath. Direct Apply reaches employer, not a fabricated application screen.
- SITE_URL in dist/seo-report.json equals the real final HTTPS origin/path, and sitemap includes the generated pages with that prefix.
- First manual small scan logs real HTTP evidence. A second scan retains prior active jobs and persists cursor/history in atlas-data. Failed sources are visibly unverified.
- Search, date/experience filters, filter Show/Hide, icons and reduced motion operate normally. Test animal+flag alerts against a controlled fixture locally; do not inject test jobs into production.
- Confirm schedule enabled, workflow write permission, Pages deployment and last-published timestamp. Do not rely on a Claude session for scheduled execution.
- After stable deployment, verify the actual Search Console property, submit sitemap and validate eligible individual job schema. Google decides indexing/ranking.

## Rollback and maintenance

Keep the existing hosted site unchanged during migration. For GitHub UI regressions revert the source commit, retain atlas-data, then run the publication workflow. Never reset the state branch to fix a UI problem. Back up atlas-data before schema migrations. Do not run two local scanner processes against the same file. Review failed/limited sources separately, preserve request evidence, and report what was actually checked.
