# How this site works — and how to add or publish content

This document explains the **architecture** of this repository and a **practical guide** for writing new blog posts and publishing changes.

---

## 1. What this stack is

| Piece | Role |
|--------|------|
| **[Hugo](https://gohugo.io/)** | **Static site generator.** Reads Markdown, config, layouts, and a theme, then outputs plain **HTML, CSS, JS, images, and RSS** into a `public/` folder. |
| **[PaperMod](https://github.com/adityatelange/hugo-PaperMod)** | **Hugo theme** — templates, typography, dark/light mode, post lists, TOC, breadcrumbs, etc. This project loads it as a **[Hugo Module](https://gohugo.io/hugo-modules/)** (`go.mod` + `hugo.toml`). |
| **Your content** | Mostly Markdown under `content/` plus static files under `static/`. |
| **GitHub Actions** | On every push to `main`, runs `hugo` and deploys the result to **GitHub Pages** (see `.github/workflows/deploy.yml`). |
| **GitHub Pages** | **Static hosting only** — it serves the built files. There is no server-side app or database when readers visit the site. |

**In one sentence:** you edit text and config locally → **Hugo builds a static website** → you **push to GitHub** → **Actions rebuilds and publishes** → visitors get normal HTML pages with light client-side features (theme toggle, KaTeX math, code copy buttons).

> **Prerequisite, one time only:** in the repo under **Settings → Pages → Build and deployment**, **Source** must be **GitHub Actions**. If it is set to *Deploy from a branch*, GitHub builds the repo with legacy Jekyll and serves `README.md` as the homepage — none of the Hugo output below ever reaches the live site.

---

## 2. Repository layout (what matters day to day)

| Path | Purpose |
|------|--------|
| `hugo.toml` | Site URL (`baseURL`), title, menus, PaperMod options, taxonomies, RSS output, Goldmark/KaTeX settings. |
| `content/posts/` | **Blog posts** — each `.md` file is one article. Listed on `/posts/`, on the homepage, in RSS, and under tags. |
| `data/home/en.yaml` | **Landing page copy**: hero, career timeline and headline numbers, selected work, videos block, positions, focus areas, contact. Rendered by `layouts/home.html`; the writing and video lists come from `content/` automatically. One file per language. |
| `content/videos/` | **Videos** — one `.md` per YouTube video (id, summary, chapters, related posts, show notes). Drafted automatically by `scripts/sync_youtube.py` via `.github/workflows/sync-youtube.yml`. |
| `content/subscribe.md`, `content/community.md` | The **Subscribe** and **Community** pages. |
| `i18n/en.yaml` | UI strings used by the custom layouts, so a Chinese edition is a translation file rather than a template edit. |
| `content/_index.md` | Homepage **front matter only** (title, description). Its body is not rendered. |
| `content/about.md`, `content/resume.md` | Standalone **pages** (About, Résumé). |
| `layouts/` | **Your overrides** on top of PaperMod: `home.html`, `404.html`, `videos/` (list + single), `partials/newsletter.html` (email signup), `partials/comments.html` (GitHub Discussions via giscus), `partials/extend_post_content.html` (updated line, citation, signup), `partials/video_card.html`, `partials/extend_head.html` (font preloads, KaTeX, analytics), `partials/math.html`, `shortcodes/newsletter.html`. |
| `assets/css/extended/` | Extra **CSS** merged into the theme stylesheet: `fonts.css` (`@font-face` for the self-hosted webfonts), `typography.css` (font stacks, type scale) and `home.css` (homepage, SVG diagrams, tables). |
| `static/` | Files copied **as-is** to the site root (e.g. `static/images/avatar.jpg` → `/images/avatar.jpg`). Includes the webfont files under `static/fonts/`. |
| `design/` | Sources and provenance for generated assets (Open Graph card, favicons, webfonts). Not part of the build. |
| `public/` | **Build output** — generated locally when you run `hugo`; **not** committed to git (see `.gitignore`). CI builds a fresh `public/` on each deploy. |

### The landing page

The homepage is a single long page with anchored sections, in this order: hero
(headline, intro, two buttons, profile links, portrait) → **Journey** (four
headline numbers and a numbered career timeline) → **Selected work** (cards with
an employer label, a title, a one-paragraph summary, and metric chips) →
**Writing** (every post with date, reading time, summary, and tags) →
**Positions** (one-sentence claims, each linking to the post that argues it) →
**Focus** (four areas with skill chips) → **Contact**.

Everything except the writing and video lists is plain YAML in `data/home/en.yaml`:

- `hero.headline` is a list of lines; the last line is rendered in the accent colour.
- `journey.stats` takes exactly four `{value, label, note}` entries; `journey.timeline` is newest first.
- `work.items` are `{label, title, summary, metrics[]}`; six items make a clean 3×2 grid.
- `positions.items` are `{claim, post}` where `post` is the content path, e.g. `/posts/tool-calling-loop`; the title and date are looked up at build time.
- `expertise.items` are `{title, summary, skills[]}`; four items make a 2×2 grid.
- `videos` only supplies the heading; the block appears automatically once the first non-draft video exists.

Sections are numbered with a running counter, so the optional Videos block slots in without renumbering. The email signup card sits between Writing and Positions and is the same partial used at the end of every post.

Every number on the landing page is also in `content/resume.md`. When one
changes, change both. The portrait is `static/images/avatar.jpg`, shown at
152px; a 320px-square source would look sharper on high-density screens.

### Navigation is deliberately small

The menu is **Work / Journey / Writing / Community / Subscribe / About**. Work and Journey are anchors
into the landing page (`/#work`, `/#journey`); the header is sticky so they stay
reachable while scrolling. Categories, Tags, Archive, and Search pages were
removed: with a handful of posts, one hub page per post reads as an empty
archive. Tags still exist in front matter and still generate `/tags/...` pages
reachable from each post's footer and from the landing page — they are just not
in the top nav.

**Résumé is not in the nav either.** It is one click away from the hero button,
the Work section, the contact block, and `content/about.md`, and still builds at
`/resume/`; to surface it in the menu as well, add a `[[menu.main]]` block for it
in `hugo.toml`.

To bring back a fuller structure once post volume justifies it: add
`category = "categories"` under `[taxonomies]` in `hugo.toml`, re-add the
`[[menu.main]]` entries, and for search re-add `"JSON"` to `[outputs].home`
plus a `content/search.md` with `layout: search`.

### Typography

Body copy is **Merriweather** (serif), headings and UI chrome are **Raleway**
(sans) — the shape borrowed from eugeneyan.com. Both are **self-hosted**: the
woff2 files (latin and latin-ext subsets, SIL Open Font License) live in
`static/fonts/`, the `@font-face` rules in `assets/css/extended/fonts.css`, and
`layouts/partials/extend_head.html` preloads the two faces used above the fold.
No request goes to Google Fonts. The stacks and size/leading overrides live in
`assets/css/extended/typography.css`, which also defines `--font-heading` (used
by the SVG diagram styles in `home.css`).

Every stack falls back to a system font, so the site is fully readable if a font
file fails to load. To drop the webfonts entirely, delete `fonts.css`, the
`static/fonts/` directory, and the two `<link rel="preload">` lines in
`extend_head.html`; the fallbacks take over with no other CSS changes. To add a
weight, see `design/README.md`.

---

## 3. How publishing works (end to end)

1. You edit or add files under `content/`, `static/`, `layouts/`, `hugo.toml`, etc.
2. You commit and **push to the `main` branch** on GitHub.
3. **GitHub Actions** runs: `hugo mod get` → `hugo --gc --minify` with the Pages **base URL** from `actions/configure-pages`.
4. The built site is deployed to **GitHub Pages**. After a minute or two, the live site updates.

**Local check before push (recommended):**

```bash
cd /path/to/linjiah.github.io
hugo mod get
hugo server -D
```

Open the URL Hugo prints (usually `http://localhost:1313/`). `-D` includes **draft** posts so you can preview them before publishing.

**Production build locally (optional sanity check):**

```bash
hugo mod get
hugo --gc --minify
# output in public/
```

---

## 4. How to add a new blog post

### Option A — `hugo new` (uses the archetype)

```bash
hugo new content posts/my-new-article.md
```

This creates a file from `archetypes/default.md` (starts as **`draft: true`** in TOML front matter). Edit the file, then either:

- Switch front matter to YAML to match existing posts, **or** keep TOML — both work in Hugo.

### Option B — copy an existing post

Duplicate something like `content/posts/batch-inference-slo.md`, rename the file, and change the front matter and body.

### Front matter checklist (posts)

Use **YAML** front matter at the top of the file (between `---` lines), for example:

```yaml
---
title: "Your Post Title"
date: 2026-05-15        # controls ordering; use real publish date
draft: false             # must be false for production (hugo.toml has buildDrafts = false)
summary: "One-line description — used on the homepage list, /posts/, and for SEO."
tags: ["tag-one", "tag-two"]
math: true               # optional: load KaTeX for LaTeX on this page only
---
```

Then write the body in **Markdown** (`##` headings, lists, code fences, images).

There is **no `categories:` field** — that taxonomy is disabled (see §2). Use `tags:` only.

**Images:** put files under `static/images/` and reference them as `/images/your-file.png` in Markdown.

**Diagrams:** prefer **inline SVG** over screenshots — it stays sharp, needs no asset, and adapts to dark mode. Wrap it so the shared styling applies, and use `stroke="currentColor"` / `fill="currentColor"` so it inherits the theme's text colour:

```html
<figure class="diagram">
<svg viewBox="0 0 640 300" role="img" aria-labelledby="my-title" xmlns="http://www.w3.org/2000/svg">
  <title id="my-title">Describe the diagram for screen readers</title>
  <rect x="16" y="60" width="120" height="52" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="76" y="91" fill="currentColor" font-size="14" text-anchor="middle">Box</text>
</svg>
<figcaption>Caption explaining what the reader should take away.</figcaption>
</figure>
```

Inline HTML works because `markup.goldmark.renderer.unsafe = true` is set. See any existing post for a worked example.

**Math (KaTeX):** set `math: true` in the post front matter; use `\(...\)` / `\[...\]` or `$$...$$` (Goldmark passthrough is configured in `hugo.toml`). Single-dollar `$...$` is deliberately **not** a math delimiter, so dollar amounts in prose are safe. If you ever bump the KaTeX version in `layouts/partials/math.html`, regenerate the three `integrity` hashes — the comment at the top of that file shows how.

> **Escaping gotcha:** inline math needs a **single** backslash — `\( x \)`, not `\\( x \\)`. A double backslash is a LaTeX line break and will render wrong. Check with `grep -c '\\\\' content/posts/*.md` — it should print `0` for every file.

**Code:** use fenced blocks with a language tag, e.g. ` ```python `.

### Draft vs published

- `draft: true` → post is **hidden** from the production build (`buildDrafts` is `false` in `hugo.toml`).
- Set `draft: false` when you are ready to ship.
- While writing, use `hugo server -D` to preview drafts.

---

## 5. How to edit other pages

| Page | File to edit |
|------|----------------|
| Home (landing page copy) | `data/home/en.yaml` |
| Subscribe / Community pages | `content/subscribe.md`, `content/community.md` |
| Videos | `content/videos/*.md` (see §9) |
| About | `content/about.md` |
| Résumé | `content/resume.md` (PDF in `static/documents/`) |
| Writing index blurb | `content/posts/_index.md` |
| Site title / menus / theme options | `hugo.toml` |
| Landing page structure | `layouts/home.html` |
| 404 page | `layouts/404.html` |
| Extra head (font preloads, KaTeX) | `layouts/partials/extend_head.html`, `layouts/partials/math.html` |
| Webfont files / `@font-face` | `static/fonts/`, `assets/css/extended/fonts.css` |
| Fonts / body + heading type | `assets/css/extended/typography.css` |
| Landing page, sticky header, diagram, and table CSS | `assets/css/extended/home.css` |
| Favicon | `static/favicon.svg`, plus the monochrome `static/safari-pinned-tab.svg` for Safari pinned tabs (wired up via `[params.assets]`) |
| Social preview card | `static/images/og-default.jpg` — regenerate from `design/og-default.svg`, see `design/README.md` |

Special layouts are set in front matter where needed, e.g. `layout: home` on `content/_index.md` selects `layouts/home.html`. PaperMod's `archives` and `search` layouts are unused — see §2 for how to bring them back.

The standalone pages (`about.md`, `resume.md`) carry `hiddenInRss: true` so the home feed at `/index.xml` lists posts only. Give any new non-post page the same flag.

---

## 6. New menu item (optional)

In `hugo.toml`, duplicate a `[[menu.main]]` block, set `identifier`, `name`, `url` (usually trailing `/`), and `weight` for ordering.

---

## 7. After you change content

```bash
git add -A
git status                    # review
git commit -m "Add post: your title"
git push origin main
```

Wait for the **Actions** workflow to finish green, then reload the live site.

---

## 8. Audience plumbing: newsletter, community, videos, analytics, domain

Everything in this section is wired up in templates and config already. Each
item needs one account or setting on your side; until then it degrades
gracefully (RSS link instead of a form, a plain Discussions link instead of
embedded threads, a coming-soon note instead of videos).

### Newsletter (Buttondown)

1. Create a free account at <https://buttondown.com> and pick a username.
2. Put it in `hugo.toml` under `[params.newsletter]` → `username`.
3. Signup forms then render in the hero-adjacent card on the landing page, at
   the end of every post and video, on `/subscribe/`, and on `/videos/`. Each
   form sends a `tag` (`home`, `posts-end`, `videos-end`, `subscribe-page`,
   `videos-list`) so Buttondown shows which placement converts.
4. Optional: in Buttondown, set the sending domain to your custom domain once
   you have one, and turn off open tracking to match the privacy promise on
   `/subscribe/`.

### Community (GitHub Discussions + giscus)

1. On GitHub: repository **Settings → General → Features → Discussions** → enable.
   Create categories named **Ask** (format: Q&A), **Show and tell**, **Ideas**,
   **Corrections**, and one called **Comments** (format: Announcements, so only
   the site can open threads) for the per-page threads.
2. Install the giscus app on the repository: <https://github.com/apps/giscus>.
3. Open <https://giscus.app>, enter `linjiah/linjiah.github.io`, choose the
   **Comments** category and *pathname* mapping. Copy `data-category` and
   `data-category-id` into `hugo.toml` under `[params.giscus]`. `repoId` is
   already filled in.
4. Threads now embed under every post and video and follow the site's light/dark
   toggle. Readers sign in with GitHub; you moderate from the Discussions tab.
   `/community/` explains the categories and the house rules.

### Videos (YouTube)

- Each video is a page under `content/videos/`. Create one by hand with
  `hugo new content videos/my-video.md` (the archetype has every field) or let
  the sync job draft it.
- **Automatic drafts:** set the repository variable `YOUTUBE_CHANNEL_ID`
  (Settings → Secrets and variables → Actions → Variables) to the channel's
  `UC…` id. The workflow runs daily, reads the channel's public feed, and
  commits a `draft: true` page for every new upload with title, date, id and
  the first paragraph of the description. Drafts never deploy. Add show notes,
  `duration`, `chapters` and `related` posts, set `draft: false`, push.
- Pages use a click-to-load player on the privacy domain (no YouTube cookies
  until the reader presses play), list chapters as deep links, and share the
  post tail (signup, discussion).
- When the first video is live: add a `Videos` menu entry in `hugo.toml`
  (`url = "/videos/"`, weight 35), set `[params.youtube].channel_url`, and add a
  `youtube` entry to `[[params.socialIcons]]` and to `hero.socials` in
  `data/home/en.yaml`. The landing page block appears on its own.

### Analytics (GoatCounter)

Create a site at <https://www.goatcounter.com> and put its code in
`[params.analytics].goatcounter`. The script loads only in production builds.
No cookies, no personal data, so no consent banner is needed.

### Custom domain

A brand entrance should not live on a `github.io` address. When you have a
domain: add a `static/CNAME` file containing it (for example `linjiahu.com`),
set `baseURL` in `hugo.toml` to `https://linjiahu.com/`, and in the repository
**Settings → Pages → Custom domain** enter the same name and enable *Enforce
HTTPS*. At the DNS provider, add `A` records for the apex pointing at GitHub
Pages' four IPs and a `CNAME` for `www` → `linjiah.github.io`. The old address
redirects automatically.

### Chinese edition (later)

The site is English-first but structured for a second language:

1. In `hugo.toml`, add `[languages.zh]` with `languageName = "中文"`,
   `weight = 2`, and `contentDir`-free translation by filename.
2. Translate copy into `data/home/zh.yaml` (same keys) and UI strings into
   `i18n/zh.yaml` (same ids as `i18n/en.yaml`).
3. Add translated pages as `about.zh.md`, `posts/<slug>.zh.md`, and so on.
   Untranslated posts simply do not appear in the Chinese edition.
4. PaperMod shows a language switch in the header automatically, and the
   landing page picks `data/home/zh.yaml` by language.

## 9. Further reading

- [Hugo documentation](https://gohugo.io/documentation/)
- [Hugo quick reference (content formats)](https://gohugo.io/content-management/formats/)
- [PaperMod wiki / features](https://github.com/adityatelange/hugo-PaperMod/wiki)
- Project **README.md** — install Hugo/Go and local `hugo server -D` reminder

If something does not appear after deploy, check: **`draft: false`**, workflow **success** on GitHub **Actions**, and **GitHub Pages** source set to **GitHub Actions** under **Settings → Pages**.
