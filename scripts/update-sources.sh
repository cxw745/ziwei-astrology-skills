#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCES_DIR="$PROJECT_ROOT/sources"

KEY_FILES=(
  "iztro/src/data/heavenlyStems.ts"
  "iztro/src/data/stars.ts"
  "ziwei-doushu/lib/ziwei/patterns.ts"
  "ziwei-doushu/lib/nihai/tianji.ts"
  "ziwei-doushu/lib/seo/knowledge.ts"
)

declare -A HASH_BEFORE

echo "=== 更新源仓库 ==="
echo ""

echo "记录关键文件 hash..."
for f in "${KEY_FILES[@]}"; do
  FULL_PATH="$SOURCES_DIR/$f"
  if [ -f "$FULL_PATH" ]; then
    HASH_BEFORE[$f]=$(shasum "$FULL_PATH" | awk '{print $1}')
    echo "  $f: ${HASH_BEFORE[$f]}"
  else
    HASH_BEFORE[$f]="MISSING"
    echo "  $f: 文件不存在"
  fi
done
echo ""

cd "$SOURCES_DIR/iztro" || { echo "Error: iztro directory not found"; exit 1; }
echo "更新 iztro..."
git fetch origin
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
IZTRO_COMMIT=$(git log -1 --format="%H")
IZTRO_DATE=$(git log -1 --format="%ai")
echo "  iztro: $IZTRO_COMMIT ($IZTRO_DATE)"
echo ""

cd "$SOURCES_DIR/ziwei-doushu" || { echo "Error: ziwei-doushu directory not found"; exit 1; }
echo "更新 ziwei-doushu..."
git fetch origin
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
ZIWEI_COMMIT=$(git log -1 --format="%H")
ZIWEI_DATE=$(git log -1 --format="%ai")
echo "  ziwei-doushu: $ZIWEI_COMMIT ($ZIWEI_DATE)"
echo ""

echo "对比关键文件变更..."
CHANGED=()
for f in "${KEY_FILES[@]}"; do
  FULL_PATH="$SOURCES_DIR/$f"
  if [ -f "$FULL_PATH" ]; then
    HASH_AFTER=$(shasum "$FULL_PATH" | awk '{print $1}')
    if [ "${HASH_BEFORE[$f]}" != "$HASH_AFTER" ]; then
      CHANGED+=("$f")
      echo "  ⚠ 变更: $f"
      echo "    前: ${HASH_BEFORE[$f]}"
      echo "    后: $HASH_AFTER"
    else
      echo "  ✓ 未变: $f"
    fi
  else
    echo "  ⚠ 缺失: $f"
    CHANGED+=("$f")
  fi
done
echo ""

if [ ${#CHANGED[@]} -gt 0 ]; then
  echo "========================================="
  echo "⚠ 以下关键文件发生变更，请检查 references/ 是否需要同步更新："
  for f in "${CHANGED[@]}"; do
    echo "  - $f"
  done
  echo "========================================="
  echo ""
fi

declare -A HASH_FINAL
for f in "${KEY_FILES[@]}"; do
  FULL_PATH="$SOURCES_DIR/$f"
  if [ -f "$FULL_PATH" ]; then
    HASH_FINAL[$f]=$(shasum "$FULL_PATH" | awk '{print $1}')
  else
    HASH_FINAL[$f]="MISSING"
  fi
done

HASH_ENTRIES=""
for f in "${KEY_FILES[@]}"; do
  if [ -n "$HASH_ENTRIES" ]; then
    HASH_ENTRIES="$HASH_ENTRIES,"
  fi
  HASH_ENTRIES="$HASH_ENTRIES
    \"$f\": \"${HASH_FINAL[$f]}\""
done

echo "更新 versions.json..."
cat > "$SOURCES_DIR/versions.json" << EOF
{
  "iztro": {
    "remote": "https://github.com/SylarLong/iztro",
    "commit": "$IZTRO_COMMIT",
    "date": "$(date +%Y-%m-%d)",
    "version": "latest"
  },
  "ziwei-doushu": {
    "remote": "https://github.com/Renhuai123/ziwei-doushu",
    "commit": "$ZIWEI_COMMIT",
    "date": "$(date +%Y-%m-%d)",
    "version": "latest"
  },
  "keyFileHashes": {$HASH_ENTRIES
  }
}
EOF

echo "=== 更新完成 ==="
echo ""
echo "请检查 references/ 文件是否需要同步更新。"
echo "运行以下命令验证："
echo "  node skills/ziwei-astrology/scripts/validate-report.js <report.md>"
