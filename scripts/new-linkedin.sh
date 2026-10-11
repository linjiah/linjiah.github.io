#!/usr/bin/env bash
# Start a new LinkedIn piece from a template.
#   scripts/new-linkedin.sh article "Why multi-agent systems fail at the handoff"
#   scripts/new-linkedin.sh post    "Termination is a predicate, not a vibe"
#   scripts/new-linkedin.sh carousel "Two SLOs, not one"
set -euo pipefail
cd "$(dirname "$0")/.."
kind="${1:-}"; title="${2:-}"
case "$kind" in article|post|carousel) ;; *) echo "usage: $0 {article|post|carousel} \"Title\"" >&2; exit 1;; esac
[ -n "$title" ] || { echo "a title is required" >&2; exit 1; }
slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-|-$//g' | cut -c1-60)"
out="linkedin/drafts/$(date +%F)-${kind}-${slug}.md"
[ -e "$out" ] && { echo "already exists: $out" >&2; exit 1; }
# drop the title into the front matter, keep everything else from the template
awk -v t="$title" 'NR==FNR && /^title: ""/ && !done { print "title: \"" t "\""; done=1; next } { print }' "linkedin/templates/${kind}.md" > "$out"
echo "created $out"
