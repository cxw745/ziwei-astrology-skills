#!/bin/bash

SKILLS_SRC="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
TRAE_SKILLS_DIR="$PROJECT_ROOT/.trae/skills/ziwei-astrology"

if [ ! -d "$SKILLS_SRC" ]; then
  echo "Error: Source directory not found: $SKILLS_SRC"
  exit 1
fi

if [ ! -d "$PROJECT_ROOT/.trae" ]; then
  echo "Error: .trae directory not found: $PROJECT_ROOT/.trae"
  exit 1
fi

echo "Syncing skills from:"
echo "  Source: $SKILLS_SRC"
echo "  Target: $TRAE_SKILLS_DIR"
echo ""

mkdir -p "$TRAE_SKILLS_DIR"

cp -R "$SKILLS_SRC/"* "$TRAE_SKILLS_DIR/"

echo "Sync complete!"
echo ""
echo "Files synced:"
find "$TRAE_SKILLS_DIR" -type f | sed "s|$TRAE_SKILLS_DIR/||" | sort
