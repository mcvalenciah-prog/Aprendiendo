#!/usr/bin/env bash
#
# check-links.sh — static link checker for the Aprendiendo portfolio and sibling site.
#
# Scans HTML files for href/src attributes and checks:
#   1. No root-absolute references (RD-FR-4), e.g. "/assets/...". Under the
#      GitHub Pages repo-name prefix (/Aprendiendo/) those resolve to the site
#      root and return 404, so they are always errors — also with --ignore-missing.
#   2. Every relative reference resolves to an existing file on disk. Directory
#      links (e.g. "pagina-web/") are accepted only when the directory contains
#      an index.html (that is what the server actually serves).
#   3. Anchors (#...), query-only refs, scheme URLs (mailto:, https:, http:,
#      data:, tel:) and protocol-relative (//...) URLs are skipped — external
#      URLs are never fetched.
#
# Usage:
#   scripts/check-links.sh [--ignore-missing] [file.html ...]
#
#   --ignore-missing  Report missing targets as warnings instead of errors.
#                     Use in mid-chain runs where a referenced file is created
#                     by a later PR (e.g. styles.css before PR 3 lands).
#   -h, --help        Show this help.
#
# With no file arguments, every *.html in the repo root and under pagina-web/
# is scanned, excluding node_modules (third-party test fixtures are not part
# of the deployed site). Run from the repo root. Exit status: 0 = OK,
# 1 = errors found, 2 = usage/scan setup failure.
#
set -u

ignore_missing=0
error_count=0
ref_count=0
file_count=0

usage() {
  cat <<'EOF'
Usage: scripts/check-links.sh [--ignore-missing] [file.html ...]

Scans HTML files for href/src attributes:
  - flags root-absolute references (/assets/...) as errors (RD-FR-4)
  - verifies relative references resolve to existing files
  - accepts directory links only when they contain index.html
  - skips anchors (#...), query-only refs, scheme URLs (mailto:, https:,
    data:, tel:) and protocol-relative (//...) URLs

Options:
  --ignore-missing   downgrade missing-target errors to warnings (mid-chain runs)
  -h, --help         show this help

Without file arguments, every *.html in the repo root and in pagina-web/
is scanned (node_modules excluded). Run from the repo root.
EOF
}

fail() {
  echo "ERROR: $1" >&2
  error_count=$((error_count + 1))
}

warn() {
  echo "WARN:  $1" >&2
}

check_file() {
  local file="$1"
  local refs raw ref target dir target_dir

  [ -f "$file" ] || { fail "$file: no such file"; return; }
  file_count=$((file_count + 1))

  # Extract href/src attributes, double- or single-quoted.
  refs=$(grep -oE '(href|src)="[^"]*"' "$file" 2>/dev/null
         grep -oE "(href|src)='[^']*'" "$file" 2>/dev/null)

  while IFS= read -r raw; do
    [ -n "$raw" ] || continue

    # Strip the attribute name and surrounding quotes.
    ref="${raw#*=}"
    ref="${ref#\"}"; ref="${ref%\"}"
    ref="${ref#\'}"; ref="${ref%\'}"
    ref_count=$((ref_count + 1))

    # Skip: empty / anchors / query-only / scheme URLs / protocol-relative.
    case "$ref" in
      ''|'#'*|'?'*)  continue ;;
      //*)           continue ;;
      *:*)           continue ;;
    esac

    # Root-absolute references always fail (RD-FR-4).
    case "$ref" in
      /*)
        fail "$file: root-absolute reference '$ref' (RD-FR-4: must be relative, e.g. 'assets/...')"
        continue
        ;;
    esac

    # Resolve the relative target against the HTML file's directory.
    target="${ref%%#*}"      # strip fragment
    target="${target%%\?*}"  # strip query
    target="${target//%20/ }" # light URL-decode for spaces
    [ -n "$target" ] || continue

    dir=$(dirname "$file")
    target_dir="$dir/$target"

    if [ -d "$target_dir" ]; then
      if [ -f "$target_dir/index.html" ]; then
        continue
      fi
      if [ "$ignore_missing" -eq 1 ]; then
        warn "$file: directory '$ref' has no index.html ($target_dir)"
      else
        fail "$file: directory '$ref' has no index.html ($target_dir)"
      fi
    elif [ -f "$target_dir" ]; then
      continue
    else
      if [ "$ignore_missing" -eq 1 ]; then
        warn "$file: missing target '$ref' ($target_dir)"
      else
        fail "$file: missing target '$ref' ($target_dir)"
      fi
    fi
  done <<< "$refs"
}

files=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --ignore-missing) ignore_missing=1 ;;
    -h|--help) usage; exit 0 ;;
    -*) usage >&2; exit 2 ;;
    *) files+=("$1") ;;
  esac
  shift
done

# Default scan: repo-root *.html + every *.html under pagina-web/.
if [ "${#files[@]}" -eq 0 ]; then
  shopt -s nullglob
  files=(./*.html)
  shopt -u nullglob
  while IFS= read -r -d '' f; do
    files+=("$f")
  done < <(find pagina-web -name '*.html' -not -path '*/node_modules/*' -print0 2>/dev/null)
fi

if [ "${#files[@]}" -eq 0 ]; then
  echo "No HTML files to check." >&2
  exit 2
fi

for f in "${files[@]}"; do
  check_file "$f"
done

echo
echo "$file_count file(s) checked, $ref_count reference(s) examined."

if [ "$error_count" -gt 0 ]; then
  echo "$error_count error(s) found — fix before deploy." >&2
  exit 1
fi
echo "All references OK."
exit 0