"""Build predictions/ledger.json: every locked prediction, the commit that locked it, and its current grade.

The website's prediction-ledger page reads this file. Re-run after re-pulling data:
    .venv/bin/python scripts/export_ledger.py
"""

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PREDICTIONS = [
    {"id": "2026-postseason", "title": "2026 postseason", "file": "predictions/2026_postseason.md",
     "grader": ["scripts/grade_postseason.py"]},
    {"id": "2027-season", "title": "2027 season", "file": "predictions/2027_season.md",
     "grader": ["scripts/grade_2027.py"]},
]


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()


def owner_quote(md):
    """The blockquote under '(owner's words)'."""
    block = md.split("(owner's words)", 1)[1].split("\n## ", 1)[0]
    return " ".join(line.lstrip("> ").strip() for line in block.splitlines() if line.startswith(">"))


def grade(cmd):
    out = subprocess.run([sys.executable, *cmd], cwd=ROOT, capture_output=True, text=True)
    text = (out.stdout + out.stderr).strip()
    if "yet" in text and "No " in text:
        return "pending", []
    parts = []
    for line in text.splitlines():
        m = re.search(r"->\s*(HIT|MISS[^\n]*|insufficient sample[^\n]*|not gradeable[^\n]*)", line)
        if m:
            parts.append(m.group(1).strip())
    status = "graded" if parts else "pending"
    return status, parts


ledger = []
for p in PREDICTIONS:
    md = (ROOT / p["file"]).read_text()
    commit = git("log", "--diff-filter=A", "--format=%H|%cI", "--", p["file"]).splitlines()[-1]
    sha, when = commit.split("|")
    status, parts = grade(p["grader"])
    ledger.append({"id": p["id"], "title": p["title"], "file": p["file"], "prediction": owner_quote(md),
                   "locked_commit": sha, "locked_at": when, "status": status, "parts": parts,
                   "grader": " ".join(p["grader"])})

(ROOT / "predictions" / "ledger.json").write_text(json.dumps(ledger, indent=2) + "\n")
print(json.dumps(ledger, indent=2))
