#!/bin/bash
set -e
cd ~/src/github.com/kentaro/kugutsushi-web
npx tsx scripts/generate-data.ts
if git diff --quiet public/data/graph.json; then
  echo "No changes"
  exit 0
fi
git add public/data/graph.json
git commit -m "📊 データ更新: $(date '+%Y-%m-%d')"
git push
echo "Updated and pushed"
