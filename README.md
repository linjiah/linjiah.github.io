# linjiah.github.io

Personal technical blog built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, deployed to [GitHub Pages](https://pages.github.com/) at `https://linjiah.github.io/`.

## Prerequisites

- **Hugo** Extended 0.161.x or newer (match [.github/workflows/deploy.yml](.github/workflows/deploy.yml) when possible).
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

### If you see 404 after refresh

Usually the published **`baseURL` did not match where the site is actually hosted** (for example, the repo is `github.com/you/my-blog` but `hugo.toml` still points at `https://you.github.io/`). The workflow above fixes that in CI. After pushing, wait for the **Pages** workflow to finish, then hard-refresh (or clear cache). If you preview a **project** site locally, run:

`hugo server -D --baseURL "https://YOUR_USER.github.io/YOUR_REPO/"`

## Site architecture and authoring

See **[SITE_GUIDE.md](SITE_GUIDE.md)** for how Hugo + PaperMod + GitHub Pages fit together, and how to add posts and publish.

## Customize

- **Site metadata and PaperMod options**: [hugo.toml](hugo.toml)
- **Profile photo**: replace [static/images/avatar.jpg](static/images/avatar.jpg)
- **Posts**: add Markdown under [content/posts/](content/posts/)
