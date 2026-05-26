import type { ZiweiChart, Palace, SiHua } from './types';
import { SI_HUA_TABLE, STEMS, BRANCHES } from './constants';
import { getSiHuaByStem, buildStarSiHuaMap } from './sihua';

// ─── 类型定义 ─────────────────────────────────────────────────

export interface PalaceFlyingSihuaResult {
  sourcePalaceIndex: number;
  sourceStem: number;
  sourceStemName: string;
  sihuaType: SiHua;
  starName: string;
  targetPalaceIndex: number;
  targetPalaceName: string;
}

export interface SelfSihuaDetail {
  sihuaType: SiHua;
  starName: string;
  nature: string;
}

export interface FlyingChainStep {
  palaceIndex: number;
  stem: number;
  stemName: string;
  sihuaType: SiHua;
  starName: string;
  targetPalaceIndex: number;
  targetPalaceName: string;
}

export interface FlyingChain {
  steps: FlyingChainStep[];
  returnsToOrigin: boolean;
}

export interface IncomingFlying {
  sourcePalaceIndex: number;
  sourcePalaceName: string;
  sourceStem: number;
  sourceStemName: string;
  sihuaType: SiHua;
  starName: string;
}

export interface SanfangFlyingResult {
  palaceIndex: number;
  palaceName: string;
  sanfangPalaceIndices: number[];
  incomingFlying: IncomingFlying[];
  outgoingFlying: PalaceFlyingSihuaResult[];
  selfSihua: Record<number, SelfSihuaDetail[]>;
}

// ─── 内部常量 ─────────────────────────────────────────────────

const SIHUA_TYPES: SiHua[] = ['禄', '权', '科', '忌'];

const SELF_SIHUA_NATURE: Record<SiHua, string> = {
  '禄': '自化禄，禄出，该宫位能量外流，有也等于无',
  '权': '自化权，权出，该宫位主观意识强但难以持久',
  '科': '自化科，科出，该宫位表面风光但实质不足',
  '忌': '自化忌，忌出，该宫位自我纠结，缘起缘灭皆在本宫',
};

// ─── 辅助函数 ─────────────────────────────────────────────────

function findStarPalaceIndex(chart: ZiweiChart, starName: string): number {
  for (const palace of chart.palaces) {
    if (palace.stars.some(s => s.name === starName)) {
      return palace.branch;
    }
  }
  return -1;
}

function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === branch);
}

function getSanfangIndices(palaceIndex: number): number[] {
  return [
    palaceIndex,
    (palaceIndex + 4) % 12,
    (palaceIndex + 8) % 12,
    (palaceIndex + 6) % 12,
  ];
}

// ─── 1) 宫干四化计算 ──────────────────────────────────────────

export function getPalaceFlyingSihua(chart: ZiweiChart): PalaceFlyingSihuaResult[] {
  const results: PalaceFlyingSihuaResult[] = [];

  for (const palace of chart.palaces) {
    const transforms = getSiHuaByStem(palace.stem);

    for (const sh of SIHUA_TYPES) {
      const starName = transforms[sh];
      if (!starName) continue;

      const targetIndex = findStarPalaceIndex(chart, starName);
      if (targetIndex === -1) continue;

      const targetPalace = getPalaceByBranch(chart, targetIndex);

      results.push({
        sourcePalaceIndex: palace.branch,
        sourceStem: palace.stem,
        sourceStemName: STEMS[palace.stem] ?? '',
        sihuaType: sh,
        starName,
        targetPalaceIndex: targetIndex,
        targetPalaceName: targetPalace?.name ?? '',
      });
    }
  }

  return results;
}

// ─── 2) 自化检测增强 ──────────────────────────────────────────

export function detectAllSelfSihua(chart: ZiweiChart): Record<number, SelfSihuaDetail[]> {
  const result: Record<number, SelfSihuaDetail[]> = {};

  for (const palace of chart.palaces) {
    const starMap = buildStarSiHuaMap(palace.stem);
    const details: SelfSihuaDetail[] = [];

    for (const star of palace.stars) {
      const sihuaType = starMap[star.name];
      if (sihuaType) {
        details.push({
          sihuaType,
          starName: star.name,
          nature: SELF_SIHUA_NATURE[sihuaType],
        });
      }
    }

    if (details.length > 0) {
      result[palace.branch] = details;
    }
  }

  return result;
}

// ─── 3) 飞化链追踪 ────────────────────────────────────────────

export function traceFlyingChain(
  chart: ZiweiChart,
  startPalaceIndex: number,
  sihuaType: SiHua,
  maxDepth: number = 4,
): FlyingChain[] {
  const chains: FlyingChain[] = [];

  const startPalace = getPalaceByBranch(chart, startPalaceIndex);
  if (!startPalace) return chains;

  const steps: FlyingChainStep[] = [];
  const visited = new Set<number>([startPalaceIndex]);
  let currentPalaceIndex = startPalaceIndex;

  for (let depth = 0; depth < maxDepth; depth++) {
    const currentPalace = getPalaceByBranch(chart, currentPalaceIndex);
    if (!currentPalace) break;

    const transforms = getSiHuaByStem(currentPalace.stem);
    const starName = transforms[sihuaType];
    if (!starName) break;

    const targetIndex = findStarPalaceIndex(chart, starName);
    if (targetIndex === -1) break;

    const targetPalace = getPalaceByBranch(chart, targetIndex);

    steps.push({
      palaceIndex: currentPalaceIndex,
      stem: currentPalace.stem,
      stemName: STEMS[currentPalace.stem] ?? '',
      sihuaType,
      starName,
      targetPalaceIndex: targetIndex,
      targetPalaceName: targetPalace?.name ?? '',
    });

    const returnsToOrigin = targetIndex === startPalaceIndex;

    chains.push({
      steps: [...steps],
      returnsToOrigin,
    });

    if (returnsToOrigin) break;

    if (visited.has(targetIndex)) break;
    visited.add(targetIndex);
    currentPalaceIndex = targetIndex;
  }

  return chains;
}

// ─── 4) 飞化落宫分析 ──────────────────────────────────────────

export function analyzeIncomingFlying(
  chart: ZiweiChart,
  targetPalaceIndex: number,
): IncomingFlying[] {
  const results: IncomingFlying[] = [];

  const targetPalace = getPalaceByBranch(chart, targetPalaceIndex);
  if (!targetPalace) return results;

  const targetStarNames = new Set(targetPalace.stars.map(s => s.name));

  for (const palace of chart.palaces) {
    if (palace.branch === targetPalaceIndex) continue;

    const transforms = getSiHuaByStem(palace.stem);

    for (const sh of SIHUA_TYPES) {
      const starName = transforms[sh];
      if (starName && targetStarNames.has(starName)) {
        results.push({
          sourcePalaceIndex: palace.branch,
          sourcePalaceName: palace.name,
          sourceStem: palace.stem,
          sourceStemName: STEMS[palace.stem] ?? '',
          sihuaType: sh,
          starName,
        });
      }
    }
  }

  return results;
}

// ─── 5) 三方四正飞化 ──────────────────────────────────────────

export function analyzeSanfangFlying(
  chart: ZiweiChart,
  palaceIndex: number,
): SanfangFlyingResult {
  const sanfangIndices = getSanfangIndices(palaceIndex);
  const palace = getPalaceByBranch(chart, palaceIndex);

  const allFlying = getPalaceFlyingSihua(chart);
  const allSelfSihua = detectAllSelfSihua(chart);

  const incomingFlying: IncomingFlying[] = [];
  for (const idx of sanfangIndices) {
    const incoming = analyzeIncomingFlying(chart, idx);
    incomingFlying.push(...incoming);
  }

  const outgoingFlying = allFlying.filter(
    f => sanfangIndices.includes(f.sourcePalaceIndex),
  );

  const selfSihua: Record<number, SelfSihuaDetail[]> = {};
  for (const idx of sanfangIndices) {
    if (allSelfSihua[idx]) {
      selfSihua[idx] = allSelfSihua[idx];
    }
  }

  return {
    palaceIndex,
    palaceName: palace?.name ?? '',
    sanfangPalaceIndices: sanfangIndices,
    incomingFlying,
    outgoingFlying,
    selfSihua,
  };
}
