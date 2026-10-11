#!/usr/bin/env python3
"""Create draft video pages for new uploads on a YouTube channel.

Reads the channel's public Atom feed (no API key needed), skips videos that
already have a page under content/videos/, and writes one draft Markdown file
per new video with the title, date, summary and id filled in. You then add
show notes, chapters and related posts, flip ``draft: false``, and push.

Run by .github/workflows/sync-youtube.yml daily; run locally with:

    python3 scripts/sync_youtube.py --channel UCxxxxxxxxxxxxxxxxxxxxxx --out content/videos

Standard library only.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import textwrap
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "a": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}
FEED = "https://www.youtube.com/feeds/videos.xml?channel_id={}"


def slugify(title: str, limit: int = 60) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return s[:limit].rstrip("-") or "video"


def known_ids(out: Path) -> set[str]:
    ids = set()
    for md in out.glob("*.md"):
        m = re.search(r'^youtube_id:\s*"?([A-Za-z0-9_-]{11})"?', md.read_text(encoding="utf-8"), re.M)
        if m:
            ids.add(m.group(1))
    return ids


def first_paragraph(text: str, limit: int = 220) -> str:
    para = next((p.strip() for p in re.split(r"\n\s*\n", text or "") if p.strip()), "")
    para = re.sub(r"\s+", " ", para)
    para = re.sub(r"https?://\S+", "", para).strip(" -–—:")
    if len(para) > limit:
        para = para[: limit - 1].rsplit(" ", 1)[0] + "…"
    return para


def render(video: dict) -> str:
    fm = {
        "title": video["title"],
        "date": video["published"][:10],
        "draft": True,
        "youtube_id": video["id"],
        "summary": video["summary"],
        "duration": "",
        "tags": [],
        "chapters": [],
        "related": [],
    }
    lines = ["---"]
    for k, v in fm.items():
        if isinstance(v, bool):
            lines.append(f"{k}: {'true' if v else 'false'}")
        elif isinstance(v, list):
            lines.append(f"{k}: []")
        else:
            lines.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
    lines[lines.index("draft: true")] = "draft: true          # add show notes below, then set to false"
    lines.append("---")
    lines.append("")
    lines.append(
        "<!-- Show notes: what the video covers, links mentioned, corrections.\n"
        "     Fill in duration, chapters ({ time: \"00:00\", title: \"Intro\" }) and\n"
        "     related post paths (e.g. /posts/tool-calling-loop) in the front matter.\n"
        "     The YouTube description is below as a starting point. -->"
    )
    lines.append("")
    lines.append(textwrap.fill(video["description"].strip(), 80) if video["description"].strip() else "")
    return "\n".join(lines).rstrip() + "\n"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "linjiah.github.io video sync"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def parse(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    videos = []
    for e in root.findall("a:entry", NS):
        g = e.find("media:group", NS)
        desc = (g.findtext("media:description", default="", namespaces=NS) if g is not None else "") or ""
        videos.append(
            {
                "id": e.findtext("yt:videoId", default="", namespaces=NS),
                "title": (e.findtext("a:title", default="", namespaces=NS) or "").strip(),
                "published": e.findtext("a:published", default="", namespaces=NS) or "",
                "description": desc,
                "summary": first_paragraph(desc),
            }
        )
    return [v for v in videos if v["id"] and v["title"]]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--channel", help="YouTube channel id (starts with UC)")
    ap.add_argument("--feed-file", help="read a saved feed XML instead of fetching (testing)")
    ap.add_argument("--out", default="content/videos", help="directory for video pages")
    ap.add_argument("--limit", type=int, default=0, help="only process the N newest entries (0 = all)")
    args = ap.parse_args()
    if not args.channel and not args.feed_file:
        ap.error("--channel or --feed-file is required")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    xml_bytes = Path(args.feed_file).read_bytes() if args.feed_file else fetch(FEED.format(args.channel))
    videos = parse(xml_bytes)
    if args.limit:
        videos = videos[: args.limit]
    seen = known_ids(out)
    created = 0
    for v in videos:
        if v["id"] in seen:
            continue
        path = out / f"{slugify(v['title'])}.md"
        if path.exists():
            path = out / f"{slugify(v['title'])}-{v['id'].lower()}.md"
        path.write_text(render(v), encoding="utf-8")
        print(f"created {path}  ({v['id']})")
        created += 1
    print(f"{created} new video page(s); {len(seen)} already present")
    return 0


if __name__ == "__main__":
    sys.exit(main())
