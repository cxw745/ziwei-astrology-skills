#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCES_DIR="$PROJECT_ROOT/sources"

echo "=== 更新源仓库 ==="
echo ""

echo "更新 iztro..."
if [ -d "$SOURCES_DIR/iztro" ]; then
  rm -rf "$SOURCES_DIR/iztro"
fi
git clone --depth 1 https://github.com/SylarLong/iztro.git "$SOURCES_DIR/iztro"
rm -rf "$SOURCES_DIR/iztro/.git"
echo "  iztro: 已更新"
echo ""

echo "更新 ziwei-doushu..."
if [ -d "$SOURCES_DIR/ziwei-doushu" ]; then
  rm -rf "$SOURCES_DIR/ziwei-doushu"
fi
git clone --depth 1 https://github.com/Renhuai123/ziwei-doushu.git "$SOURCES_DIR/ziwei-doushu"
rm -rf "$SOURCES_DIR/ziwei-doushu/.git"
echo "  ziwei-doushu: 已更新"
echo ""

echo "更新 versions.json..."
cat > "$SOURCES_DIR/versions.json" << EOF
{
  "iztro": {
    "remote": "https://github.com/SylarLong/iztro",
    "date": "$(date +%Y-%m-%d)",
    "version": "latest",
    "note": "源码副本，无独立git，通过重新clone更新"
  },
  "ziwei-doushu": {
    "remote": "https://github.com/Renhuai123/ziwei-doushu",
    "date": "$(date +%Y-%m-%d)",
    "version": "latest",
    "note": "源码副本，无独立git，通过重新clone更新"
  }
}
EOF

echo "=== 更新完成 ==="
echo ""
echo "请检查 references/ 文件是否需要同步更新。"
