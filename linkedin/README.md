# LinkedIn writing workspace

Working folder for the technical pieces published on LinkedIn. It sits outside
`content/`, so Hugo never builds it and nothing here reaches the website until
you copy it into `content/posts/`.

> **This repository is public.** `drafts/` is ignored by git so unfinished work
> never appears on GitHub. Finished pieces go in `published/` and are tracked.
> To version drafts anyway, delete the `linkedin/drafts/*` line in `.gitignore`.

## Layout

| Path | What goes there |
|------|-----------------|
| `ideas.md` | Backlog of pieces, grouped by pillar, with a one-line angle each. Pull from here. |
| `drafts/` | Work in progress. One file per piece, named `YYYY-MM-DD-slug.md`. Not tracked. |
| `published/` | The exact text as published, plus the URLs. Move a draft here on publish day. |
| `assets/` | Diagrams, carousel PDFs, cover images. Name them after the piece's slug. |
| `templates/article.md` | Long-form LinkedIn article: 800–1,500 words, the version of an essay that lives on LinkedIn. |
| `templates/post.md` | Short native feed post: under 3,000 characters, one idea, link in the first comment. |
| `templates/carousel.md` | Outline for a slide carousel built from an essay's diagrams. |
| `log.yaml` | Publishing log: what went out, where, when, and how it did. |

Start a new piece with:

```bash
scripts/new-linkedin.sh article "Why multi-agent systems fail at the handoff"
scripts/new-linkedin.sh post    "Termination is a predicate, not a vibe"
```

## The pipeline for one essay

1. **Draft the essay** in `drafts/` using the article template. Write the full
   argument once; everything else is derived from it.
2. **Publish on the site first, or the same morning.** Copy the body into
   `content/posts/<slug>.md` (the site's archetype has the matching front
   matter), set `draft: false`, push. The site is the permanent copy.
3. **Publish the LinkedIn version the same day.** Either the article in full
   through LinkedIn's article editor, or a feed post built from `templates/post.md`
   that carries the argument natively. Put the site link at the end or in the
   first comment; the feed suppresses posts whose body is mostly a link.
4. **Close the loop.** Paste the LinkedIn URL into the site post's `linkedin:`
   front-matter field so readers can join that thread, move the draft to
   `published/`, and add a row to `log.yaml`.
5. **Derive the follow-ups.** Three to five feed posts, one per section of the
   essay, scheduled over the next two weeks. One carousel from the diagrams.
   The video script, when the channel is live, is the essay's outline.

## Checklist before you press publish

- The first two lines state the claim or the number. Everything before
  "…see more" is the whole pitch; about 210 characters on desktop, fewer on mobile.
- One idea per feed post. If there are two, it is two posts.
- Every number is one that already appears on the résumé or in a published
  essay. Patterns and public figures only; no internal names or unreleased work.
- The piece ends with a real question, not "thoughts?".
- Link goes in the first comment or at the very end, never in the first line.
- Three to five hashtags, the same ones every time, so they act as a channel:
  `#AIEngineering #AgenticAI #LLMOps #MLSystems #Inference`.
- Plain text only in feed posts. Unicode bold and italics break screen readers
  and look spammy; use line breaks and short paragraphs for structure.
- Articles support headings, images and links. Use one diagram near the top.
- Publish Tuesday to Thursday morning, Pacific time, and reply to every comment
  in the first hour. Comments drive reach more than reactions do.

## Pillars, for tagging each piece

| Pillar | Covers |
|--------|--------|
| `agents` | Control flow, termination, multi-agent coordination, evaluation gates, post-training loops, human-in-the-loop rollout |
| `inference` | Batching, KV cache, SLOs, engines on new silicon, edge constraints, cost per token |
| `science` | Scaling laws, bias and variance, evaluator agreement, calibration, RL intuitions |
| `product` | Earning trust, release gates, migrations, platform guardrails, build versus buy, leading AI teams |
| `trends` | A new release or paper, explained by mechanism, with a dated position on what it changes for people running agents in production |
