# linjiah.github.io

Personal technical blog built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, deployed to [GitHub Pages](https://pages.github.com/) at `https://linjiah.github.io/`.

## Prerequisites

- **Hugo** Extended **0.165.x** — match the version pinned in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
- **Go** 1.23+ (used by Hugo Modules to fetch the theme).

Install example (macOS, Homebrew):

```bash
brew install hugo go
```

## Run locally

From the repository root:

```bash
hugo mod get
hugo server -D
```

Then open the URL Hugo prints (usually `http://localhost:1313/`). The `-D` flag serves **draft** pages so you can preview work in progress.

## Production build

```bash
hugo mod get
hugo --gc --minify
```

Output is written to `public/`.

## GitHub Pages

1. Create a repository named **`linjiah.github.io`** under the **`linjiah`** GitHub account (user Pages requires this naming convention).
2. Push this project to the **`main`** branch.
3. In the repo on GitHub: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
4. The workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds on every push to `main` and publishes the `public/` output to Pages. It runs **`actions/configure-pages`** and passes the real Pages **`base_url`** into `hugo --baseURL`, so links and assets stay correct for both **user sites** (`https://USER.github.io/`) and **project sites** (`https://USER.github.io/REPO/`).

> **Step 3 is not optional.** If **Source** is left on *Deploy from a branch*, GitHub ignores the workflow and builds the repo with **legacy Jekyll** instead — which renders this `README.md` as your homepage and 404s every Hugo route (`/posts/`, `/index.xml`). Symptom to look for in the served HTML:
>
> ```html
> <meta name="generator" content="Jekyll v3.10.0" />
> ```
>
> If you see that, the site you are looking at is not Hugo output. Fix the **Source** setting and re-run the workflow.

### If you see 404 after refresh

Usually the published **`baseURL` did not match where the site is actually hosted** (for example, the repo is `github.com/you/my-blog` but `hugo.toml` still points at `https://you.github.io/`). The workflow above fixes that in CI. After pushing, wait for the **Pages** workflow to finish, then hard-refresh (or clear cache). If you preview a **project** site locally, run:

`hugo server -D --baseURL "https://YOUR_USER.github.io/YOUR_REPO/"`

## Site architecture and authoring

See **[SITE_GUIDE.md](SITE_GUIDE.md)** for how Hugo + PaperMod + GitHub Pages fit together, and how to add posts and publish.

## Customize

- **Site metadata, menus, and PaperMod options**: [hugo.toml](hugo.toml)
- **Landing page content**: [data/home/en.yaml](data/home/en.yaml) — introduction, writing section, selected work, background, and contact. [layouts/home.html](layouts/home.html) adds the latest published articles and any published videos automatically. Keep professional facts consistent with [content/resume.md](content/resume.md).
- **Newsletter, community, videos, analytics, custom domain**: optional integrations. Until configured, follow and discussion links use RSS and LinkedIn. See [SITE_GUIDE.md](SITE_GUIDE.md) §8.
- **Videos**: one page per video under [content/videos/](content/videos/); [sync-youtube.yml](.github/workflows/sync-youtube.yml) drafts them from the channel feed once `YOUTUBE_CHANNEL_ID` is set.
- **Posts**: add Markdown under [content/posts/](content/posts/)
- **Profile photo**: replace [static/images/avatar.jpg](static/images/avatar.jpg)
- **Favicon**: [static/favicon.svg](static/favicon.svg), plus the monochrome [static/safari-pinned-tab.svg](static/safari-pinned-tab.svg) for Safari pinned tabs
- **Social preview card**: [static/images/og-default.jpg](static/images/og-default.jpg) — regenerate from [design/og-default.svg](design/og-default.svg), see [design/README.md](design/README.md)
- **Fonts and type scale**: [assets/css/extended/typography.css](assets/css/extended/typography.css) (Merriweather body / Raleway headings). The woff2 files are self-hosted in [static/fonts/](static/fonts/) and declared in [assets/css/extended/fonts.css](assets/css/extended/fonts.css); [layouts/partials/extend_head.html](layouts/partials/extend_head.html) preloads the two above-the-fold faces. No third-party font requests.
- **Homepage, diagram, and table CSS**: [assets/css/extended/home.css](assets/css/extended/home.css)

The navigation is **Writing / Work / About / Résumé**. Work links to the homepage section; the other entries open dedicated pages. The older `/subscribe/` and `/community/` URLs remain available with working follow/contact options. Add more navigation only when there is content or a configured service behind it.

## Keep the résumé PDF current

Edit [content/resume.md](content/resume.md), then regenerate the downloadable PDF from the same Markdown:

```bash
node scripts/generate-resume.mjs
```

This requires Node.js 22+, Hugo, and Chrome or Chromium, with no npm packages. The print layout lives in [scripts/resume-print.html](scripts/resume-print.html). Review the PDF's page breaks after content changes; `--html-output /tmp/linjia-resume.html` also saves a browser preview. Commit the regenerated PDF alongside the Markdown.
