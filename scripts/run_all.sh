#!/usr/bin/env bash
# Reproduce the whole project: (optionally) re-pull data, then execute every notebook in order.
#   bash scripts/run_all.sh            # use the committed data/raw files
#   bash scripts/run_all.sh --pull     # re-pull Statcast, game logs and batter xwOBA first
set -euo pipefail
cd "$(dirname "$0")/.."
uv sync -q

if [[ "${1:-}" == "--pull" ]]; then
  uv run python scripts/pull_statcast.py
  uv run python scripts/pull_game_logs.py
  uv run python -c "
from pybaseball import statcast_batter_expected_stats
for y in [2024, 2025, 2026]:
    statcast_batter_expected_stats(y, minPA=1).to_csv(f'data/raw/batter_xwoba_{y}.csv', index=False)
"
fi

for nb in notebooks/0[1-7]_*.ipynb; do
  echo "running $nb"
  uv run jupyter nbconvert --to notebook --execute --inplace --ExecutePreprocessor.timeout=1800 "$nb" 2>&1 | tail -1
done
uv run python scripts/export_ledger.py > /dev/null
echo "done: figures/, data/processed/ and predictions/ledger.json regenerated"
