#!/usr/bin/env bash
# big-bang-deploy.sh — One-shot deploy for the 100+-commit backlog
# After PAT renewal: source new creds, run this.
# Usage: bash scripts/big-bang-deploy.sh

set -euo pipefail

C_BOLD='\033[1m'
C_GREEN='\033[0;32m'
C_AMBER='\033[0;33m'
C_RED='\033[0;31m'
C_RESET='\033[0m'

echo -e "${C_BOLD}╔═══════════════════════════════════════╗${C_RESET}"
echo -e "${C_BOLD}║  Big-Bang Deploy (100-commit backlog) ║${C_RESET}"
echo -e "${C_BOLD}╚═══════════════════════════════════════╝${C_RESET}"
echo ""

# 1. Check git remote auth
echo -e "${C_AMBER}[1/5]${C_RESET} Checking git remote authentication..."
if git fetch --dry-run 2>&1 | grep -qi "failed\|error\|denied\|could not read from remote"; then
  echo -e "  ${C_RED}✗${C_RESET} Remote auth failed. Source credentials before running:"
  echo "    source ~/.openclaw/credentials/github.sh"
  exit 1
fi
echo -e "  ${C_GREEN}✓${C_RESET} Remote reachable"
echo ""

# 2. Count pending
echo -e "${C_AMBER}[2/5]${C_RESET} Counting pending commits..."
AHEAD=$(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "unknown")
echo -e "  ${C_GREEN}→${C_RESET} $AHEAD commits to push"
echo ""

# 3. Push everything
echo -e "${C_AMBER}[3/5]${C_RESET} Pushing all branches..."
git push origin main --atomic 2>&1
echo -e "  ${C_GREEN}✓${C_RESET} Push complete"
echo ""

# 4. Deploy to Vercel
echo -e "${C_AMBER}[4/5]${C_RESET} Deploying to Vercel production..."
if command -v vercel &> /dev/null; then
  vercel deploy --prod --yes 2>&1
  echo -e "  ${C_GREEN}✓${C_RESET} Vercel deploy triggered"
elif [ -f "package.json" ] && grep -q '"vercel"' package.json; then
  echo -e "  ${C_GREEN}→${C_RESET} vercel CLI not installed — push alone triggers Vercel auto-deploy from main branch"
  echo "    Run manually: npx vercel deploy --prod"
else
  echo -e "  ${C_AMBER}→${C_RESET} No Vercel CLI found — push alone may trigger auto-deploy from main branch"
fi
echo ""

# 5. Verify
echo -e "${C_AMBER}[5/5]${C_RESET} Verifying..."
AHEAD_AFTER=$(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "unknown")
if [ "$AHEAD_AFTER" = "0" ] || [ "$AHEAD_AFTER" = "unknown" ]; then
  echo -e "  ${C_GREEN}✓${C_RESET} All commits pushed (0 ahead)${C_RESET}"
else
  echo -e "  ${C_AMBER}⚠${C_RESET} Still $AHEAD_AFTER commits ahead — check remote for errors"
fi
echo ""
echo -e "${C_GREEN}${C_BOLD}Done.${C_RESET}"
echo "Next: visit https://alpha-home-phi.vercel.app to verify live."
