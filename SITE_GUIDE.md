# How this site works — and how to add or publish content

This document explains the **architecture** of this repository and a **practical guide** for writing new blog posts and publishing changes.

---

## 1. What this stack is

| Piece | Role |
|--------|------|
| **[Hugo](https://gohugo.io/)** | **Static site generator.** Reads Markdown, config, layouts, and a theme, then outputs plain **HTML, CSS, JS, images, RSS, and a search JSON index** into a `public/` folder. |
| **[PaperMod](https://github.com/adityatelange/hugo-PaperMod)** | **Hugo theme** — templates, typography, dark/light mode, post lists, search (Fuse.js), TOC, breadcrumbs, etc. This project loads it as a **[Hugo Module](https://gohugo.io/hugo-modules/)** (`go.mod` + `hugo.toml`). |
| **Your content** | Mostly Markdown under `content/` plus static files under `static/`. |
| **GitHub Actions** | On every push to `main`, runs `hugo` and deploys the result to **GitHub Pages** (see `.github/workflows/deploy.yml`). |
| **GitHub Pages** | **Static hosting only** — it serves the built files. There is no server-side app or database when readers visit the site. |

**In one sentence:** you edit text and config locally → **Hugo builds a static website** → you **push to GitHub** → **Actions rebuilds and publishes** → visitors get normal HTML pages with light client-side features (search, theme toggle, etc.).

---

## 2. Repository layout (what matters day to day)

| Path | Purpose |
|------|--------|
| `hugo.toml` | Site URL (`baseURL`), title, menus, PaperMod options, search/RSS outputs, Goldmark/KaTeX-related settings. |
| `content/posts/` | **Blog posts** — each `.md` file is one article. Listed on `/posts/`, in RSS, archive, categories, tags, and search. |
| `content/_index.md` | **Homepage** body (Karpathy-style layout via `layouts/home.html`). |
| `content/about.md`, `content/resume.md`, … | Standalone **pages** (About, Résumé, Archive, Search, etc.). |
| `content/categories/` | Optional **category hub** pages and taxonomy content. |
| `layouts/` | **Your overrides** on top of PaperMod (e.g. `home.html`, `partials/extend_head.html` for KaTeX). |
| `assets/css/extended/` | Extra **CSS** merged into the theme stylesheet. |
| `static/` | Files copied **as-is** to the site root (e.g. `static/images/avatar.jpg` → `/images/avatar.jpg`). |
| `public/` | **Build output** — generated locally when you run `hugo`; **not** committed to git (see `.gitignore`). CI builds a fresh `public/` on each deploy. |

---

## 3. How publishing works (end to end)

1. You edit or add files under `content/`, `static/`, `layouts/`, `hugo.toml`, etc.
2. You commit and **push to the `main` branch** on GitHub.
3. **GitHub Actions** runs: `hugo mod get` → `hugo --gc --minify` with the Pages **base URL** from `actions/configure-pages`.
4. The built site is deployed to **GitHub Pages**. After a minute or two, the live site updates.

**Local check before push (recommended):**

```bash
cd /path/to/linjia_website
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
summary: "One-line description for listings and SEO."
tags: ["tag-one", "tag-two"]
categories: ["ML Infra and System"]   # use one of your category names; see content/categories/
math: true               # optional: load KaTeX for LaTeX on this page only
---
```

Then write the body in **Markdown** (`##` headings, lists, code fences, images).

**Categories** used in this project include (see `content/categories/`):  
`ML Infra and System`, `ML Theory Basics`, `Agentic System`, `AI Frontiers`, `Software Architecture`.

**Images:** put files under `static/images/` and reference them as `/images/your-file.png` in Markdown.

**Math (KaTeX):** set `math: true` in the post front matter; use `\(...\)` / `\[...\]` or `$$...$$` (Goldmark passthrough is configured in `hugo.toml`).

**Code:** use fenced blocks with a language tag, e.g. ` ```python `.

### Draft vs published

- `draft: true` → post is **hidden** from the production build (`buildDrafts` is `false` in `hugo.toml`).
- Set `draft: false` when you are ready to ship.
- While writing, use `hugo server -D` to preview drafts.

---

## 5. How to edit other pages

| Page | File to edit |
|------|----------------|
| Home | `content/_index.md` |
| About | `content/about.md` |
| Résumé | `content/resume.md` (PDF in `static/documents/`) |
| Site title / menus / theme options | `hugo.toml` |
| Homepage layout wrapper | `layouts/home.html` |
| Extra head (e.g. KaTeX) | `layouts/partials/extend_head.html`, `layouts/partials/math.html` |

Special layouts are set in front matter where needed, e.g. `layout: archives` for `content/archive.md`, `layout: search` for `content/search.md`.

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

## 8. Further reading

- [Hugo documentation](https://gohugo.io/documentation/)
- [Hugo quick reference (content formats)](https://gohugo.io/content-management/formats/)
- [PaperMod wiki / features](https://github.com/adityatelange/hugo-PaperMod/wiki)
- Project **README.md** — install Hugo/Go and local `hugo server -D` reminder

If something does not appear after deploy, check: **`draft: false`**, workflow **success** on GitHub **Actions**, and **GitHub Pages** source set to **GitHub Actions** under **Settings → Pages**.
