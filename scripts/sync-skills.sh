#!/bin/bash

set -euo pipefail

FORCE=false
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=true ;;
  esac
done

SKILLS_ROOT="$(cd "$(dirname "$0")/../skills" && pwd)"
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TRAE_SKILLS_DIR="$PROJECT_ROOT/.trae/skills"
BACKUP_ROOT="$(dirname "$0")/../.sync-backup"

if [ ! -d "$SKILLS_ROOT" ]; then
  echo "Error: Source directory not found: $SKILLS_ROOT"
  exit 1
fi

if [ ! -d "$PROJECT_ROOT/.trae" ]; then
  echo "Error: .trae directory not found: $PROJECT_ROOT/.trae"
  exit 1
fi

SYNC_SKILLS=("ziwei-astrology" "time-calibration")
OVERALL_STATUS=0

for SKILL_NAME in "${SYNC_SKILLS[@]}"; do
  SKILL_SRC="$SKILLS_ROOT/$SKILL_NAME"
  SKILL_TGT="$TRAE_SKILLS_DIR/$SKILL_NAME"
  BACKUP_DIR="$BACKUP_ROOT/${SKILL_NAME}.bak.$(date +%Y%m%d%H%M%S)"

  if [ ! -d "$SKILL_SRC" ]; then
    echo "⚠ 跳过不存在的 skill: $SKILL_NAME"
    continue
  fi

  echo "══════════════════════════════════════"
  echo "同步: $SKILL_NAME"
  echo "  源: $SKILL_SRC"
  echo "  目标: $SKILL_TGT"
  echo ""

  if [ -d "$SKILL_TGT" ]; then
    if [ "$FORCE" = true ]; then
      echo "[--force] 跳过备份"
    else
      echo "备份旧版到: $BACKUP_DIR"
      mkdir -p "$(dirname "$BACKUP_DIR")"
      cp -R "$SKILL_TGT" "$BACKUP_DIR"
      if [ $? -ne 0 ]; then
        echo "Error: 备份失败，跳过 $SKILL_NAME"
        OVERALL_STATUS=1
        continue
      fi
      echo "备份完成"
    fi
  fi

  mkdir -p "$SKILL_TGT"

  SRC_COUNT=$(find "$SKILL_SRC" -type f | wc -l | tr -d ' ')

  cp -R "$SKILL_SRC/"* "$SKILL_TGT/"
  CP_EXIT=$?

  if [ $CP_EXIT -ne 0 ]; then
    echo "Error: 同步失败 (exit code: $CP_EXIT)"
    if [ -d "$BACKUP_DIR" ] && [ "$FORCE" = false ]; then
      echo "正在从备份恢复..."
      rm -rf "$SKILL_TGT"
      cp -R "$BACKUP_DIR" "$SKILL_TGT"
      echo "已从备份恢复"
    fi
    OVERALL_STATUS=1
    continue
  fi

  TGT_COUNT=$(find "$SKILL_TGT" -type f | wc -l | tr -d ' ')

  echo ""
  echo "文件总数:"
  echo "  源: $SRC_COUNT"
  echo "  目标: $TGT_COUNT"

  if [ "$SRC_COUNT" -ne "$TGT_COUNT" ]; then
    echo "  ⚠ 警告: 文件数不一致! 差异: $((TGT_COUNT - SRC_COUNT))"
  fi

  echo ""
  echo "关键目录对比:"
  for dir in references scripts examples; do
    if [ -d "$SKILL_SRC/$dir" ]; then
      D_SRC=$(find "$SKILL_SRC/$dir" -type f 2>/dev/null | wc -l | tr -d ' ')
    else
      D_SRC=0
    fi
    if [ -d "$SKILL_TGT/$dir" ]; then
      D_TGT=$(find "$SKILL_TGT/$dir" -type f 2>/dev/null | wc -l | tr -d ' ')
    else
      D_TGT=0
    fi
    STATUS="✓"
    if [ "$D_SRC" -ne "$D_TGT" ]; then
      STATUS="⚠"
    fi
    printf "  %-15s  源: %4d  目标: %4d  %s\n" "$dir/" "$D_SRC" "$D_TGT" "$STATUS"
  done

  if [ "$SRC_COUNT" -eq "$TGT_COUNT" ]; then
    echo "✅ $SKILL_NAME 同步完成，文件数一致"
  else
    echo "⚠ $SKILL_NAME 同步完成，但文件数不一致"
  fi
  echo ""
done

echo "══════════════════════════════════════"
if [ $OVERALL_STATUS -eq 0 ]; then
  echo "✅ 所有 skill 同步完成"
else
  echo "⚠ 部分 skill 同步失败，请检查"
  exit 1
fi
