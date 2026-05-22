#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCES_DIR="$PROJECT_ROOT/sources"

echo "=== 更新源仓库 ==="
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
  }
}
EOF

echo "=== 更新完成 ==="
echo ""
echo "请检查 references/ 文件是否需要同步更新。"
echo "运行以下命令验证："
echo "  node skills/ziwei-astrology/scripts/validate-report.js <report.md>"
