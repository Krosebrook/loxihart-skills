#!/usr/bin/env bash
# verify-series.sh — pre-delivery adversarial scan for a branded essay series.
# Usage: verify-series.sh <dir-or-glob-or-files...>
#   verify-series.sh /home/claude
#   verify-series.sh lb-essay-*.html
# Scans shipped HTML essays for forbidden terms (hard-rule + memoir + banned-word
# leaks) and structural defects, printing context for every hit so a human can
# resolve substring false positives. Exits non-zero if any hit needs review.
set -uo pipefail

# Forbidden-term list: memoir/clinical, day-job/title, fabrication-inflation,
# retired brands, banned voice words, leaked editorial notes.
# Built as an array and joined with | so the regex stays ONE line — literal
# backslash-newline continuations inside a quoted string silently break -E
# alternation and make the scan pass everything (false-negative).
TERMS=(
  'percentile' 'amen clinic' '\bSPECT\b' 'hypoxia' 'opioid' 'sedative' '[PERSON]'
  'Staff Engineer' 'Senior Engineer' 'Principal Engineer' 'Software Engineer' 'AI SME'
  'certified' '240\+' '244 tools' 'ChaosClubCo' 'Chaos Collective' '\bButler\b'
  'leverage' 'game-changer' 'paradigm shift' '\bdelve' 'dive in' 'unlock your potential'
  'cut-form' 'NEEDS MATERIAL' '\[GATED\]' '\bTODO\b'
)
PATTERN="$(IFS='|'; echo "${TERMS[*]}")"

# Collect target files (accept dirs, globs, or explicit files).
files=()
for arg in "$@"; do
  if [[ -d "$arg" ]]; then
    while IFS= read -r f; do files+=("$f"); done < <(find "$arg" -maxdepth 1 -name '*.html' -type f)
  elif [[ -f "$arg" ]]; then
    files+=("$arg")
  fi
done

if [[ ${#files[@]} -eq 0 ]]; then
  echo "verify-series.sh: no HTML files found in: $*" >&2
  exit 2
fi

# Prefer ripgrep; fall back to grep.
if command -v rg >/dev/null 2>&1; then
  SCAN() { rg -i -o -N "$1" "$2" 2>/dev/null; }
  CTX()  { rg -i -n "$1" "$2" 2>/dev/null; }
else
  SCAN() { grep -io -E "$1" "$2" 2>/dev/null; }
  CTX()  { grep -in -E "$1" "$2" 2>/dev/null; }
fi

hits=0
for f in "${files[@]}"; do
  found="$(SCAN "$PATTERN" "$f" | sort -u)"
  # Structural checks.
  title_ok=$(grep -c '<title>[^<]\+ — ' "$f")
  badge_ok=$(grep -c 'series-badge">Essay <span>' "$f")

  if [[ -n "$found" || "$title_ok" -eq 0 || "$badge_ok" -eq 0 ]]; then
    echo "=== REVIEW: $f ==="
    if [[ -n "$found" ]]; then
      echo "  forbidden-term hits (resolve each — substrings are common false positives):"
      echo "$found" | sed 's/^/    - /'
      echo "  context:"
      CTX "$PATTERN" "$f" | sed 's/^/    /'
      hits=$((hits+1))
    fi
    [[ "$title_ok" -eq 0 ]] && { echo "  ! title missing ' — <brand>' pattern"; hits=$((hits+1)); }
    [[ "$badge_ok" -eq 0 ]] && { echo "  ! series-badge missing or malformed"; hits=$((hits+1)); }
    echo
  else
    echo "OK: $f"
  fi
done

echo "----"
if [[ "$hits" -gt 0 ]]; then
  echo "$hits item(s) need human resolution before delivery."
  echo "A hit is not automatically a violation — print context, confirm intent,"
  echo "then re-run. Do NOT ship until every hit is explained."
  exit 1
fi
echo "All files clean of scanned terms and structural defects."
echo "Reminder: a clean scan catches terms, not tone. Read the voice too."
exit 0
