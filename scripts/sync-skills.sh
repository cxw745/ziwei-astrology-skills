#!/bin/bash

set -euo pipefail

FORCE=false
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=true ;;
  esac
done

SKILLS_SRC="$(cd "$(dirname "$0")/../skills/ziwei-astrology" && pwd)"
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TRAE_SKILLS_DIR="$PROJECT_ROOT/.trae/skills/ziwei-astrology"
BACKUP_DIR="$(dirname "$0")/../.sync-backup/ziwei-astrology.bak.$(date +%Y%m%d%H%M%S)"

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

if [ -d "$TRAE_SKILLS_DIR" ]; then
  if [ "$FORCE" = true ]; then
    echo "[--force] 跳过备份"
  else
    echo "备份旧版到: $BACKUP_DIR"
    mkdir -p "$(dirname "$BACKUP_DIR")"
    cp -R "$TRAE_SKILLS_DIR" "$BACKUP_DIR"
    if [ $? -ne 0 ]; then
      echo "Error: 备份失败，终止同步"
      exit 1
    fi
    echo "备份完成"
  fi
fi

mkdir -p "$TRAE_SKILLS_DIR"

SRC_COUNT=$(find "$SKILLS_SRC" -type f | wc -l | tr -d ' ')

cp -R "$SKILLS_SRC/"* "$TRAE_SKILLS_DIR/"
CP_EXIT=$?

if [ $CP_EXIT -ne 0 ]; then
  echo "Error: 同步失败 (exit code: $CP_EXIT)"
  if [ -d "$BACKUP_DIR" ] && [ "$FORCE" = false ]; then
    echo "正在从备份恢复..."
    rm -rf "$TRAE_SKILLS_DIR"
    cp -R "$BACKUP_DIR" "$TRAE_SKILLS_DIR"
    echo "已从备份恢复"
  fi
  exit 1
fi

TGT_COUNT=$(find "$TRAE_SKILLS_DIR" -type f | wc -l | tr -d ' ')

echo ""
echo "=== 同步对比报告 ==="
echo ""
echo "文件总数:"
echo "  源: $SRC_COUNT"
echo "  目标: $TGT_COUNT"

if [ "$SRC_COUNT" -ne "$TGT_COUNT" ]; then
  echo "  ⚠ 警告: 文件数不一致! 差异: $((TGT_COUNT - SRC_COUNT))"
fi

echo ""
echo "关键目录对比:"
for dir in skills references scripts evals; do
  if [ -d "$SKILLS_SRC/$dir" ]; then
    D_SRC=$(find "$SKILLS_SRC/$dir" -type f 2>/dev/null | wc -l | tr -d ' ')
  else
    D_SRC=0
  fi
  if [ -d "$TRAE_SKILLS_DIR/$dir" ]; then
    D_TGT=$(find "$TRAE_SKILLS_DIR/$dir" -type f 2>/dev/null | wc -l | tr -d ' ')
  else
    D_TGT=0
  fi
  STATUS="✓"
  if [ "$D_SRC" -ne "$D_TGT" ]; then
    STATUS="⚠"
  fi
  printf "  %-15s  源: %4d  目标: %4d  %s\n" "$dir/" "$D_SRC" "$D_TGT" "$STATUS"
done

echo ""
if [ "$SRC_COUNT" -eq "$TGT_COUNT" ]; then
  echo "同步完成，文件数一致"
else
  echo "⚠ 同步完成，但文件数不一致，请检查"
fi
