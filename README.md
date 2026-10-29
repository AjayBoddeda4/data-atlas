# Start here

Read **START-HERE.md** for the deployment steps and **HANDOVER.md** for the current project status. Claude Code should read **CLAUDE.md** before editing. This package was updated on 29 October 2026 to include the live site’s v24 country flags and filter fixes, plus portable SEO export.

# Data Atlas — GitHub Pages and Claude Code edition

This is a portable source export of Data Atlas, updated on 29 October 2026. It contains the job portal, 12,310 tracked career sources, India and worldwide filters, experience filters, MAANG and featured employers, direct company application links, source evidence, persistent discovered postings, and country animal discovery alerts. It does not depend on a ChatGPT or Claude API key.

Two supported modes:

| Mode | Website | Job scanner | Manual scan |
| --- | --- | --- | --- |
| GitHub Pages | Static React app | GitHub Actions, scheduled at minutes 7 and 37 of each hour | Open **Run scan in GitHub**, then **Run workflow** as an authorized repository user |
| Local / Claude Code | Node.js serves the same app | Node server batches every 30 minutes while its process runs | **Trigger now** inside the app |

Claude Code can read and maintain this project. Claude chat is not the server that keeps it online. See `CLAUDE.md` for the handoff prompt and commands.

## Publish on GitHub Pages

1. Create a **public** GitHub repository named `data-atlas`, with default branch `main`. Standard Actions runners are free for public repositories, subject to GitHub's terms and limits. Source code and the public job snapshots will be visible.
2. Extract this ZIP. Open a terminal in the extracted `data-atlas-portable` folder. Upload the **contents**, including `.github/workflows`, to your repository. For example, replace YOUR-USERNAME below with your own username:

```sh
git init -b main
git add .
git commit -m "Add portable Data Atlas"
git remote add origin https://github.com/YOUR-USERNAME/data-atlas.git
git push -u origin main
```

3. In your repository open **Settings → Pages → Build and deployment → Source → GitHub Actions**. Keep Actions enabled. If your organization restricts workflow permissions, allow the included workflow to write contents and deploy Pages.
4. Open **Actions → Scan career sites and publish Data Atlas → Run workflow**. The first run can take over 20 minutes; it scans a bounded batch, builds, and deploys the site. The deployment job shows your actual Pages URL. Do not use this package's previous ChatGPT URL as your GitHub URL.
5. The workflow runs around **every 30 minutes** thereafter. GitHub can delay or drop scheduled runs. Scheduled workflows on public repos can be disabled after 60 days of inactivity; check Actions if updates stop.
6. On the website, **Check updates** loads completed, published results. **Run scan in GitHub** opens the workflow controls. No GitHub token is stored in browser code. A public static page cannot securely dispatch an authenticated workflow by itself.

The schedule starts runs, not a complete scan of all 12,310 sites every half hour. Each run checks up to **400 sites** with four workers and a 20-minute dispatch budget. The persistent cursor advances to the next sites each run. At 400 sites per run, a full rotation takes at least 31 runs (roughly 15.5 hours), and slow or failing sites can extend that. The UI reports actual checks, timestamps, failures and limited coverage. Increase `SCAN_BATCH_SIZE` only after measuring runtime and source limits; do not evade provider restrictions.

The page checks for a newly published report every minute while it is open. Its selectable top countdown also reloads published data; it is not the background scheduler. Live source requests and live in-progress scan logs are not served by GitHub Pages. Use the Actions logs to inspect an ongoing run; completed evidence appears on the site after deployment.

## What stays saved

- `atlas-data` is a separate Git branch containing `state.json`: job snapshots, scan cursor, persistent discovered postings, and the latest batch evidence. Do not delete that branch unless you intend to reset collected history.
- A new batch replaces **Refresh activity**. It does not clear **Explore jobs** or **Found open postings**.
- Complete successful feeds replace that source's previous listings, removing missing jobs. Explicit expiry dates are excluded. Limited career pages retain unseen jobs, but explicit expiry, closure notices, and HTTP 404/410 on checked posting pages remove them. Posting checks rotate through up to 12 jobs per limited source refresh.
- Timeout, HTTP 403/429, and other uncertain failures preserve old jobs as unverified. A missing job in keyword search is not independent proof of closure; the employer remains the final authority.
- The country animal appears for discoveries published while you have the website open, or discoveries made by the local browser scan. Opening the app does not announce all historical jobs as new.
- The supplied `state/seed.json` is the original collected index, **not a new live crawl or a guarantee of current availability**. Sources update as batches reach them. Previously saved data in the hosted ChatGPT site's storage and browser bookmarks/contacts are not automatically migrated into this separate site.
- LinkedIn contacts and saved hearts stay in the browser. Different domains have different browser storage. LinkedIn CSV import and referral drafting remain available; Google/LinkedIn login and automatic connection sync are not configured.

## Run locally (including with Claude Code)

Install Node.js **22.18 or newer** and npm, then run in this folder:

```sh
npm ci
npm test
npm run publish:data
npm start
```

Open **http://127.0.0.1:8787/**. `npm start` builds local mode and starts the Node server. Leave the terminal running. The server starts a rotating batch after 30 minutes and repeats after each interval when it is idle; closing the browser does not stop that server timer. Turning off the browser countdown does not disable the server timer.

For a single manual batch from the terminal:

```sh
npm run scan
```

Do not run a separate scanner process at the same time as the local server: both would write the same state file. The server's own timer and browser requests use the same in-process locks. Stop the server before running a standalone scan. `state/state.json` holds local persistence; back it up.

Optional environment variables:

| Variable | Default | Meaning |
| --- | --- | --- |
| `AUTO_SCAN_MINUTES` | `30` | Local server batch interval; `0` disables the server timer |
| `SCAN_BATCH_SIZE` | `400` | Sites selected per scheduled or CLI batch |
| `SCAN_CONCURRENCY` | `4` | CLI worker count, maximum 8 |
| `SCAN_MINUTES` | `20` | CLI dispatch budget in minutes |
| `PORT` | `8787` | Local web server port |
| `HOST` | `127.0.0.1` | Bind locally by default |

A single source gets a 90-second request budget. Remaining source jobs are preserved on failure. The local in-page **Trigger now** scans the directory while the page remains open; the server batch timer scans rotating batches independently. For unattended operation use the server batch timer and a process manager. Do not put this local server on the public internet unchanged: it has no visitor authentication or production request-rate controls. Ask Claude to add those and TLS/reverse-proxy configuration before a public server deployment.

## Static build / other hosting

```sh
npm ci
npm run publish:data
npm run build
```

The generated `dist/` directory can be deployed to a static host. Relative asset and data paths support both `username.github.io/repository/` and a custom-domain root. `npm run build:local` instead builds the browser for the local Node APIs. Do not publish that local-mode build to Pages.

`npm run dev` previews the static-data UI with Vite. It does not start the job scanner. For a full local app use `npm start`.

## Maintenance and verification

- `npm run check`: TypeScript checks.
- `npm test`: parser, pagination, reconciliation, expiry, found-posting, and portable persistence tests.
- `npm run scan`: real outbound career-site checks; uses no LLM.
- `npm run publish:data`: creates the static index, found-postings file and evidence report.
- `npm run build`: builds the Pages frontend.
- GitHub deployment workflow uses `npm ci`, so keep `package-lock.json` committed.
- A custom domain and Google Search Console ownership/indexing need setup for the new hostname. The previous site's verification does not transfer automatically.
- The current hosted Data Atlas website is unchanged. This archive prepares a separate deployment; no GitHub repository or hosting account has been created for you.

Official references:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows
- https://docs.github.com/en/billing/concepts/product-billing/github-actions

## Employer posting dates (29 October 2026 update)

Explore and Found open postings include employer posting dates, a Posted today / past 7 days / past 30 days filter, and Newest posted ordering. Today uses India time. Discovery/check dates are separate. Workday labels such as Posted 21 Days Ago are preserved and show an approximate calendar date; 30+ days remains imprecise. Unknown dates are never treated as today. Existing saved snapshots gain missing employer-date metadata when their source is next checked. No collection date or modification date is substituted for publication.

## Shared character alerts and background tabs (29 October 2026)

Newly discovered jobs now carry a shared discovery timestamp. Opening another device loads the shared published discoveries and shows recent unseen alerts; each browser keeps its own received-alert and pending-popup queue. Historical rows without a discovery timestamp are not fabricated as new. On Pages, another device sees results after the next Actions deployment; local-server clients see persisted server results. Popups wait while the browser tab is hidden and resume one by one on return. Pending popups persist through reloads when browser storage is available. Background tabs may be throttled or suspended, especially on phones; GitHub Actions or the running Node server is required for reliable work while the browser is suspended.

The job location chooses the country map and animal. Product/technology companies use a very joyful expression; IT services/consulting use laughter; banking/finance use a confident smile; real estate/operations use a cheerful wave; unmapped employers use a friendly smile. Company categories are curated and may simplify diversified businesses. They are not guessed from job titles. The shared endpoint returns the latest 500 active discoveries; all indexed jobs remain in Explore.

## Country animal notifications (29 October 2026)

Only a new-job discovery popup shows the country map and original cartoon animal based on the job location. Explore, saved jobs and found-posting cards have no animal graphics. Product-company mascots are very joyful; service-company mascots laugh; banking mascots give a confident smile; operations mascots wave. There is no mascot preview panel; animals appear only for eligible actual discoveries.

The lookup covers 250 country/territory entries, with 235 simplified map outlines and geographic locators for the rest. There are 84 sourced animal associations, including national birds and traditional symbols; other locations use a labeled original Atlas fox. See public/mascot-sources.txt for sources and licenses. Multi-country and uncertain locations use a globe. Company categories remain curated, so unknown employers get a friendly neutral expression.

A new browser silently loads historical discoveries, keeping all jobs available in Explore and Found postings. Only discoveries after its first visit can generate animations. A returning browser remembers shown notifications and resumes unseen ones, one at a time, after becoming visible. This uses browser storage, not account-wide dismissal sync. Clearing storage or using private browsing starts a new silent baseline.

Fresh audited discoveries from an in-page full trigger or company check are announced directly, independently of the silent shared-history date filter. Already-offered alerts are deduplicated. The popup renders in a body portal above the page layout. Checks with zero new jobs do not create announcements.

## First-visit guide and professional 3D motion

The top of the page shows actual shared feed coverage immediately; this total is not reset for each visitor. A dismissible first-visit guide explains Trigger now (local scanner) or Check updates / GitHub Actions (Pages).

A lightweight CSS/SVG illustration shows career feeds, a layered jobs index and a direct application card. Card depth and moving data packets provide restrained 3D motion. It pauses off-screen, respects the existing 3D switch, reduced motion and data saver, and does not require a 3D engine. Its illustrated activity is not a source-check log. No character entrance or image download remains.

## Company icons everywhere

Job cards, featured employers, the company directory, found postings and refresh activity all display a company icon. Curated exact employer names and aliases use locally hosted company website logos; all remaining companies receive a deterministic color-coded initials icon. Unavailable logos fall back to initials. This guarantees an icon for each employer without guessing its official brand identity or making external logo-service requests. public/company-logos/sources.json records the downloaded logos' origins. Logos load lazily in fixed-size boxes. Hosted job-detail pages also show the company icon.


## Country flags and stable filters (latest update)

Discovery popups keep the country animal/map and now show locally bundled SVG flags for all 250 supported country/territory entries. Multi-country listings show multiple flags; uncertain locations use a globe, never an invented country. Flags are selected from job location, not employer headquarters. Public flag artwork is MIT licensed; see public/country-flags/LICENSE.txt.

The filter panel no longer tilts under the pointer. Show/Hide preserves your selections; the experience and remote switches have clear states, visible keyboard focus and touch targets.

## Search visibility / SEO export

`npm run build` now generates a crawlable homepage and individual HTML job pages, `sitemap.xml`, `robots.txt`, and `seo-report.json` in dist. The interactive portal still filters client-side; static job pages include descriptions and employer application links without requiring JavaScript. Entirely expired or removed jobs are omitted on the next successful publication; failures retain jobs with an unverified notice. Job title links on Pages open the generated detail page; Apply still opens the employer. Local Node mode keeps job title links directed to the employer.

In GitHub Actions, the Pages configuration supplies the production base URL. Optionally set repository **Settings → Secrets and variables → Actions → Variables → SITE_URL** to the exact HTTPS production URL, including the repository path if applicable and a trailing slash. Do not set it to the old ChatGPT hostname or a DuckDNS name until routing and HTTPS have been verified. For a local export, `SITE_URL=https://YOUR-HOST/YOUR-REPOSITORY/ npm run build`. If SITE_URL and GITHUB_REPOSITORY are both missing, canonical tags and sitemap entries are omitted and the SEO report explains why.

Set the public repository variable `GOOGLE_SITE_VERIFICATION` only to the HTML-tag content value provided for your new Search Console property. This is not an API credential. The old hosted property’s verification and indexing do not automatically transfer. After deployment inspect the sitemap, submit it in Search Console, and inspect the homepage plus a real job page.

Conservative JobPosting JSON-LD is generated only for recently checked successful physical-location listings with a known employer publication date, a supplied description and recognized country. Estimated/unknown dates, remote/ambiguous locations, stale snapshots and failed checks do not receive JobPosting markup. No employer date, salary, work arrangement or closure date is invented to satisfy structured-data fields. Broader schema eligibility needs better source metadata. Validate examples with Google’s Rich Results Test; eligibility is not guaranteed indexing or ranking.

No Google Indexing API integration, paid SEO service or AI subscription is configured. Organic visibility is not a promise of first position or results for all data-related keywords. Pick one production address before submitting sitemaps; if moving later, configure redirects on the old host where possible.
