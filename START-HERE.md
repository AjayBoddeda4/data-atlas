# Data Atlas — GitHub deployment and Claude handover

Updated 29 October 2026. This is a source-code package, not confirmation of a GitHub deployment.

## Give Claude Code this first

Open this folder in Claude Code and say:

> Read CLAUDE.md, HANDOVER.md, START-HERE.md and README.md. Maintain the existing Data Atlas website and preserve all implemented features. Run npm ci, npm run check, npm test, npm run publish:data and npm run build. Help me deploy this folder to a GitHub repository using GitHub Pages and the supplied GitHub Actions workflow. Preserve the atlas-data state branch. Verify one real small scan, persistent jobs, published filters, flags and animal popups before enabling the regular scan schedule. Use the normal GitHub authentication flow; keep credentials out of source and browser code. Configure SEO for the actual final HTTPS address and help me submit its sitemap in Search Console. Do not claim exhaustive job coverage or a complete 12,310-site scan every 30 minutes. Explain any paid resource before provisioning it. Do not change or switch off my current ChatGPT site during this migration.

Claude's subscription assists development. Node and GitHub Actions execute scans without an LLM API key.

## Deploy in GitHub

1. Create a repository you own. For the documented free Pages/standard Actions setup, use a **public repository**. The source and any stored job data on atlas-data will be public; do not include contacts, resumes or credentials.
2. Put this folder’s **contents** at the repository root, including `.github/workflows/scan-and-publish.yml`, package.json and package-lock.json. Use main as the default branch. Do not upload node_modules or dist. For Git uploads, dotfiles must be included.
3. In repository Settings → Pages, set Source to **GitHub Actions**. Enable Actions if disabled. Organization policies may additionally restrict workflows or write permissions.
4. Use GitHub’s normal sign-in/CLI/browser authentication. No personal access token is needed inside the app. The workflow uses GitHub’s temporary GITHUB_TOKEN for state persistence and deployment.
5. Push to main or open Actions → Scan career sites and publish Data Atlas → Run workflow. For a quick first smoke scan, use batch_size **1**. Check the real logs; a failed source check is not a verified zero-job result. Push events run up to five sources with a two-minute dispatch budget for a quicker deployment. Scheduled/manual runs default to 400 sources and 20 minutes; individual requests may finish after the dispatch budget.
6. Confirm the deploy job succeeds and open the exact URL GitHub returns. Check manual scan link, search and filters. Trigger another small scan; verify atlas-data remains and the cursor advances. Existing active jobs should survive.
7. Regular scheduled batches are requested at minute 7 and 37 of every hour. GitHub controls execution and can delay runs. This works while your laptop is off; no browser tab or Claude session needs to remain open.
8. Use the GitHub Actions URL for a secure manual **Run workflow**. The Pages **Check updates** button reloads published data; it does not start a server scan. Never embed a GitHub token to make that button dispatch publicly.
9. After the final domain is chosen, configure SITE_URL if needed, deploy, verify HTTPS, inspect /sitemap.xml and /robots.txt under the correct repository path, and submit the sitemap to a new Google Search Console property.

## DuckDNS

Your chosen name is datatlasjobs.duckdns.org. It has not been connected by this package. DuckDNS is DNS, not hosting or a scheduler. GitHub’s documented custom-subdomain setup uses a CNAME, while DuckDNS exposes IP and TXT updates. Treat custom-domain routing and HTTPS as unverified until actually tested. Start with the free GitHub Pages address. Do not point the hostname to your home IP for an unattended cloud deployment. Do not publish a DuckDNS token. A token was previously shared in conversation; rotate it in DuckDNS before further use.

## Run on your own computer instead

Install Node 22.18+ and run `npm ci`, then `npm start`. The local URL defaults to http://127.0.0.1:8787. The local Node server has a rotating background batch timer and real manual scans. Your computer must stay powered on, awake, connected and running the process. Sleep, shutdown or closing the process stops it. The default local server is not a hardened public hosting endpoint.

## What is not automatically transferred

The hosted application remains at https://ajay-global-data-job-radar.ajayboddeda3643.chatgpt.site/ . Its live cloud database is separate. This ZIP includes historical seed snapshots, not an export of every latest production snapshot, the live cloud discovery history, browser saved jobs or private LinkedIn CSV contacts. A fresh deployment updates the seed by scanning. Ask Claude for a deliberate storage migration if you need continuity of the exact hosted data.

No GitHub account/repository, custom-domain binding, OAuth app or Google Search Console property has been created by preparing this ZIP.
