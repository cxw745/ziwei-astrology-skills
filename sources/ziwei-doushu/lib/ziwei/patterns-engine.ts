import type { ZiweiChart, Palace, SiHua } from './types';

export type PatternLevel = 'supreme' | 'good' | 'helpful' | 'evil' | 'basic' | 'supplementary';
export type PatternResult = 'pure' | 'enhanced' | 'broken';

export interface PatternMatch {
  name: string;
  level: PatternLevel;
  result: PatternResult;
  score: number;
  requiredMet: boolean;
  bonusCount: number;
  breakingCount: number;
  description: string;
  source: string;
}

export interface PatternAnalysisResult {
  patterns: PatternMatch[];
  totalScore: number;
  goodPatterns: PatternMatch[];
  evilPatterns: PatternMatch[];
}

const SHA_HARD = ['擎羊', '陀罗', '火星', '铃星'];
const SHA_KONG = ['地空', '地劫'];
const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const SCORE_MAP: Record<PatternLevel, Record<PatternResult, number>> = {
  supreme: { pure: 80, enhanced: 100, broken: 20 },
  good: { pure: 50, enhanced: 70, broken: 10 },
  helpful: { pure: 30, enhanced: 50, broken: 5 },
  evil: { pure: -60, enhanced: -60, broken: -10 },
  basic: { pure: 15, enhanced: 25, broken: 0 },
  supplementary: { pure: 20, enhanced: 35, broken: 0 },
};

function determineResult(bonusCount: number, breakingCount: number): PatternResult {
  if (breakingCount > 0) return 'broken';
  if (bonusCount > 0) return 'enhanced';
  return 'pure';
}

function calculateScore(level: PatternLevel, result: PatternResult): number {
  return SCORE_MAP[level][result];
}

function createMatch(
  name: string,
  level: PatternLevel,
  bonusCount: number,
  breakingCount: number,
  description: string,
  source: string,
): PatternMatch {
  const result = determineResult(bonusCount, breakingCount);
  const score = calculateScore(level, result);
  return { name, level, result, score, requiredMet: true, bonusCount, breakingCount, description, source };
}

function getMingGong(chart: ZiweiChart): Palace | undefined {
  return chart.palaces.find(p => p.branch === chart.mingGongBranch);
}

function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}

function getSanfangPalaces(chart: ZiweiChart, palaceIndex: number): Palace[] {
  const branches = [palaceIndex, (palaceIndex + 4) % 12, (palaceIndex + 8) % 12, (palaceIndex + 6) % 12];
  return chart.palaces.filter(p => branches.includes(p.branch));
}

function hasStarInPalace(palace: Palace, starName: string): boolean {
  return palace.stars.some(s => s.name === starName);
}

function hasStarInSanfang(chart: ZiweiChart, palaceIndex: number, starName: string): boolean {
  return getSanfangPalaces(chart, palaceIndex).some(p => hasStarInPalace(p, starName));
}

function hasMajorStarInPalace(palace: Palace): boolean {
  return palace.stars.some(s => s.type === 'major');
}

function isStarBright(palace: Palace, starName: string): boolean {
  return palace.stars.some(s => s.name === starName && s.brightness === 'bright');
}

function isStarDim(palace: Palace, starName: string): boolean {
  return palace.stars.some(s => s.name === starName && s.brightness === 'dim');
}

function hasSihuaInPalace(palace: Palace, sihuaType: SiHua): boolean {
  return palace.stars.some(s => s.siHua === sihuaType);
}

function hasSihuaInSanfang(chart: ZiweiChart, palaceIndex: number, sihuaType: SiHua): boolean {
  return getSanfangPalaces(chart, palaceIndex).some(p => hasSihuaInPalace(p, sihuaType));
}

function countShaInSanfang(chart: ZiweiChart, palaceIndex: number): number {
  return getSanfangPalaces(chart, palaceIndex).reduce(
    (sum, p) => sum + p.stars.filter(s => SHA_HARD.includes(s.name)).length, 0,
  );
}

function isFlanked(chart: ZiweiChart, palaceIndex: number, star1: string, star2: string): boolean {
  const prev = getPalaceByBranch(chart, (palaceIndex + 11) % 12);
  const next = getPalaceByBranch(chart, (palaceIndex + 1) % 12);
  if (!prev || !next) return false;
  return (hasStarInPalace(prev, star1) && hasStarInPalace(next, star2))
    || (hasStarInPalace(prev, star2) && hasStarInPalace(next, star1));
}

function getOppositePalaceIndex(palaceIndex: number): number {
  return (palaceIndex + 6) % 12;
}

function findStarPalace(chart: ZiweiChart, starName: string): Palace | undefined {
  return chart.palaces.find(p => p.stars.some(s => s.name === starName));
}

function getStarSihua(palace: Palace, starName: string): SiHua | undefined {
  return palace.stars.find(s => s.name === starName)?.siHua;
}

function getSanfangStarSet(chart: ZiweiChart, palaceIndex: number): Set<string> {
  return new Set(getSanfangPalaces(chart, palaceIndex).flatMap(p => p.stars.map(s => s.name)));
}

function hasShaInPalace(palace: Palace, shaList: string[]): boolean {
  return palace.stars.some(s => shaList.includes(s.name));
}

function countShaInPalace(palace: Palace, shaList: string[]): number {
  return palace.stars.filter(s => shaList.includes(s.name)).length;
}

function getShenGong(chart: ZiweiChart): Palace | undefined {
  return chart.palaces.find(p => p.branch === chart.shenGongBranch);
}

function getPalaceByName(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.name === name);
}

function hasAuspiciousInSanfang(chart: ZiweiChart, palaceIndex: number): boolean {
  const starSet = getSanfangStarSet(chart, palaceIndex);
  if (starSet.has('左辅') || starSet.has('右弼')) return true;
  if (starSet.has('天魁') || starSet.has('天钺')) return true;
  if (starSet.has('文昌') || starSet.has('文曲')) return true;
  if (starSet.has('禄存')) return true;
  if (hasSihuaInSanfang(chart, palaceIndex, '禄')) return true;
  if (hasSihuaInSanfang(chart, palaceIndex, '权')) return true;
  if (hasSihuaInSanfang(chart, palaceIndex, '科')) return true;
  return false;
}

// ────────────────── 上格（8个） ──────────────────

function checkJunChenQingHui(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInPalace(ming, '紫微')) return;
  if (!hasStarInSanfang(chart, ming.branch, '左辅') || !hasStarInSanfang(chart, ming.branch, '右弼')) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('文昌') || starSet.has('文曲')) bonus++;
  if (starSet.has('天魁') || starSet.has('天钺')) bonus++;
  if (getStarSihua(ming, '紫微') === '权') bonus++;
  if (starSet.has('地空') && starSet.has('地劫')) breaking++;

  results.push(createMatch('君臣庆会', 'supreme', bonus, breaking,
    '紫微入命，左辅右弼同会，帝王得贤臣辅佐，主大富大贵、统御之命。一生贵人不绝，宜走政商高位、跨界领袖之途。',
    '《紫微斗数全书·君臣庆会格》'));
}

function checkZiFuTongGong(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const ziweiPalace = findStarPalace(chart, '紫微');
  const tianfuPalace = findStarPalace(chart, '天府');
  if (!ziweiPalace || !tianfuPalace || ziweiPalace.branch !== tianfuPalace.branch) return;
  if (ziweiPalace.branch !== ming.branch) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('左辅') && starSet.has('右弼')) bonus++;
  if (starSet.has('文昌') || starSet.has('文曲')) bonus++;
  if (hasShaInPalace(ziweiPalace, SHA_KONG)) breaking++;
  if (countShaInPalace(ziweiPalace, SHA_HARD) >= 2) breaking++;

  results.push(createMatch('紫府同宫', 'supreme', bonus, breaking,
    '紫微天府同入命宫，帝相并临，尊贵之命。主品行端正、衣食无忧、有领导才能，宜担任要职。需要左右辅弼来配合方为完整大格。',
    '《紫微斗数全书·紫府同宫格》'));
}

function checkFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const tianfu = findStarPalace(chart, '天府');
  const tianxiang = findStarPalace(chart, '天相');
  if (!tianfu || !tianxiang) return;
  if (!hasStarInSanfang(chart, ming.branch, '天府') || !hasStarInSanfang(chart, ming.branch, '天相')) return;
  if (tianfu.branch === tianxiang.branch) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (hasStarInPalace(ming, '禄存') || hasSihuaInPalace(ming, '禄')) bonus++;
  if (starSet.has('左辅')) bonus++;
  if (hasShaInPalace(ming, SHA_HARD)) breaking++;
  if (countShaInSanfang(chart, ming.branch) >= 3) breaking++;

  results.push(createMatch('府相朝垣', 'supreme', bonus, breaking,
    '天府天相分守命宫三方四正，文武并济、权印双辉，主一生衣食丰足、地位崇高。古书云"府相朝垣千钟食禄"，常见于政界、企业管理者。',
    '《紫微斗数全书·府相朝垣格》'));
}

function checkYangLiangChangLu(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  if (!starSet.has('太阳') || !starSet.has('天梁') || !starSet.has('文昌') || !starSet.has('禄存')) return;

  let bonus = 0;
  let breaking = 0;
  const sunPalace = findStarPalace(chart, '太阳')!;
  const liangPalace = findStarPalace(chart, '天梁')!;

  if (isStarBright(sunPalace, '太阳')) bonus++;
  if (isStarBright(liangPalace, '天梁')) bonus++;
  if (hasSihuaInSanfang(chart, ming.branch, '科')) bonus++;
  if (isStarDim(sunPalace, '太阳')) breaking++;
  if (countShaInSanfang(chart, ming.branch) >= 2) breaking++;

  results.push(createMatch('阳梁昌禄', 'supreme', bonus, breaking,
    '太阳、天梁、文昌、禄存四星齐会命宫三方，号称"科举之星"，主清贵显达、考运极佳，宜走学术、文教、研究、专业认证之路，一生功名易就。',
    '《紫微斗数全书·阳梁昌禄格》'));
}

function checkHuoTanLingTan(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const tanPalace = findStarPalace(chart, '贪狼');
  if (!tanPalace) return;
  if (!hasStarInSanfang(chart, ming.branch, '贪狼')) return;

  const pairs: [string, Palace | undefined][] = [
    ['火星', findStarPalace(chart, '火星')],
    ['铃星', findStarPalace(chart, '铃星')],
  ];

  for (const [shaName, shaPalace] of pairs) {
    if (!shaPalace) continue;
    const sameOrTrine = tanPalace.branch === shaPalace.branch
      || (tanPalace.branch + 4) % 12 === shaPalace.branch
      || (tanPalace.branch + 8) % 12 === shaPalace.branch
      || (tanPalace.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;

    let bonus = 0;
    let breaking = 0;

    if (isStarBright(tanPalace, '贪狼')) bonus++;
    if (getStarSihua(tanPalace, '贪狼') === '禄' || getStarSihua(tanPalace, '贪狼') === '权') bonus++;
    if (hasShaInPalace(tanPalace, ['擎羊', '陀罗'])) breaking++;
    if (hasShaInPalace(tanPalace, SHA_KONG)) breaking++;

    const patternName = shaName === '火星' ? '火贪格' : '铃贪格';
    results.push(createMatch(patternName, 'supreme', bonus, breaking,
      `贪狼遇${shaName}${tanPalace.branch === shaPalace.branch ? '同宫' : '三方会照'}，主突发横财、突如其来的机遇。古书云"贪狼遇火铃，必发横财"，但来得快去得也快，宜见好就收。`,
      '《紫微斗数骨髓赋》'));
  }
}

function checkWuTan(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const wuPalace = findStarPalace(chart, '武曲');
  const tanPalace = findStarPalace(chart, '贪狼');
  if (!wuPalace || !tanPalace) return;
  const sameOrOppose = wuPalace.branch === tanPalace.branch
    || (wuPalace.branch + 6) % 12 === tanPalace.branch;
  if (!sameOrOppose) return;
  if (!hasStarInSanfang(chart, ming.branch, '武曲') && !hasStarInSanfang(chart, ming.branch, '贪狼')) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('火星') || starSet.has('铃星')) bonus++;
  if (getStarSihua(wuPalace, '武曲') === '禄') bonus++;
  if (hasShaInPalace(wuPalace, ['擎羊', '陀罗'])) breaking++;
  if (hasShaInPalace(wuPalace, SHA_KONG)) breaking++;

  results.push(createMatch('武贪格', 'supreme', bonus, breaking,
    '武曲贪狼会命，财星与桃花欲望星交辉，古书云"武贪不发少年人"——三十岁后方能厚积薄发。主中年以后大富大贵，财源由人脉、应酬、欲望管理而来，适合金融、投机、销售、娱乐业。',
    '《紫微斗数骨髓赋》'));
}

function checkShaPoLang(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  if (!starSet.has('七杀') || !starSet.has('破军') || !starSet.has('贪狼')) return;

  let bonus = 0;
  let breaking = 0;

  if (hasSihuaInSanfang(chart, ming.branch, '禄') || hasSihuaInSanfang(chart, ming.branch, '权')) bonus++;
  if (starSet.has('左辅') && starSet.has('右弼')) bonus++;
  if (countShaInSanfang(chart, ming.branch) >= 3) breaking++;
  if (hasShaInPalace(ming, SHA_KONG)) breaking++;

  results.push(createMatch('杀破狼', 'supreme', bonus, breaking,
    '七杀、破军、贪狼三星会命，开创闯荡之命格。一生变动多、不甘平凡，宜创业、军警、业务、销售。中年后才能稳定守成，年轻时易因冲动失利。',
    '《紫微斗数全书·杀破狼》'));
}

function checkJiYueTongLiang(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  if (!starSet.has('天机') || !starSet.has('太阴') || !starSet.has('天同') || !starSet.has('天梁')) return;

  let bonus = 0;
  let breaking = 0;

  if (starSet.has('文昌') || starSet.has('文曲')) bonus++;
  if (hasSihuaInSanfang(chart, ming.branch, '科')) bonus++;
  if (countShaInSanfang(chart, ming.branch) >= 3) breaking++;
  if (hasShaInPalace(ming, SHA_HARD)) breaking++;

  results.push(createMatch('机月同梁', 'supreme', bonus, breaking,
    '天机太阴天同天梁四星齐入命迁财官，文质彬彬、聪慧善谋。最适合公职、学术、文艺、医疗、服务等需稳定累积的行业，不宜大冒险大投机。',
    '《紫微斗数全书·机月同梁格》'));
}

// ────────────────── 中格（9个） ──────────────────

function checkLianZhenTianXiang(chart: ZiweiChart, results: PatternMatch[]) {
  const lianPalace = findStarPalace(chart, '廉贞');
  const xiangPalace = findStarPalace(chart, '天相');
  if (!lianPalace || !xiangPalace || lianPalace.branch !== xiangPalace.branch) return;

  let bonus = 0;
  let breaking = 0;
  const mingIdx = getMingGong(chart)?.branch ?? -1;
  const starSet = mingIdx >= 0 ? getSanfangStarSet(chart, mingIdx) : new Set<string>();

  if (hasStarInPalace(lianPalace, '禄存') || getStarSihua(lianPalace, '廉贞') === '禄') bonus++;
  if (starSet.has('左辅')) bonus++;
  if (hasStarInPalace(lianPalace, '擎羊')) breaking++;
  if (getStarSihua(lianPalace, '廉贞') === '忌') breaking++;

  results.push(createMatch('廉贞天相格', 'good', bonus, breaking,
    '廉贞天相同宫，印绶格局，主秉公处事、清廉之名，宜任公职、行政管理、法务、企划。怕见擎羊化忌，则反主官非。',
    '《紫微斗数全书》'));
}

function checkWuQuQiSha(chart: ZiweiChart, results: PatternMatch[]) {
  const wuPalace = findStarPalace(chart, '武曲');
  const qiPalace = findStarPalace(chart, '七杀');
  if (!wuPalace || !qiPalace || wuPalace.branch !== qiPalace.branch) return;

  let bonus = 0;
  let breaking = 0;

  if (getStarSihua(wuPalace, '武曲') === '权') bonus++;
  if (getStarSihua(wuPalace, '武曲') === '禄') bonus++;
  if (getStarSihua(wuPalace, '武曲') === '忌') breaking++;
  if (hasShaInPalace(wuPalace, SHA_HARD)) breaking++;

  results.push(createMatch('武曲七杀', 'good', bonus, breaking,
    '武曲七杀同宫，将星配财星，主果决刚毅、理财能力强，适合金融、军警、创业。但忌见化忌煞星，否则凶险。一生奋斗、积财但操心。',
    '《紫微斗数全书》'));
}

function checkTianTongTianLiang(chart: ZiweiChart, results: PatternMatch[]) {
  const tongPalace = findStarPalace(chart, '天同');
  const liangPalace = findStarPalace(chart, '天梁');
  if (!tongPalace || !liangPalace || tongPalace.branch !== liangPalace.branch) return;

  let bonus = 0;
  let breaking = 0;
  const mingIdx = getMingGong(chart)?.branch ?? -1;
  const starSet = mingIdx >= 0 ? getSanfangStarSet(chart, mingIdx) : new Set<string>();

  if (starSet.has('文昌')) bonus++;
  if (getStarSihua(tongPalace, '天同') === '禄') bonus++;
  if (hasShaInPalace(tongPalace, SHA_HARD)) breaking++;

  results.push(createMatch('天同天梁格', 'good', bonus, breaking,
    '天同天梁同宫，福星与荫星共会，主宽厚和善、乐于助人，宜医疗、教育、宗教、社会公益。但偏温和保守，难成大富大贵之局。',
    '《紫微斗数全书》'));
}

function checkRiYueTongGong(chart: ZiweiChart, results: PatternMatch[]) {
  const sunPalace = findStarPalace(chart, '太阳');
  const moonPalace = findStarPalace(chart, '太阴');
  if (!sunPalace || !moonPalace || sunPalace.branch !== moonPalace.branch) return;
  if (sunPalace.branch !== 1 && sunPalace.branch !== 7) return;

  let bonus = 0;
  let breaking = 0;
  const mingIdx = getMingGong(chart)?.branch ?? -1;
  const starSet = mingIdx >= 0 ? getSanfangStarSet(chart, mingIdx) : new Set<string>();

  if (sunPalace.branch === 7) bonus++;
  if (starSet.has('文昌') && starSet.has('文曲')) bonus++;
  if (hasShaInPalace(sunPalace, SHA_HARD)) breaking++;

  results.push(createMatch('日月同宫', 'good', bonus, breaking,
    `太阳太阴于${BRANCH_NAMES[sunPalace.branch]}宫同宫，阴阳平衡，文武兼备。主异性缘佳、事业顺遂、名声远播。${sunPalace.branch === 7 ? '未宫日月双美尤佳。' : '丑宫力量较平。'}`,
    '《紫微斗数全书》'));
}

function checkRiYueJiaMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!isFlanked(chart, ming.branch, '太阳', '太阴')) return;

  let bonus = 0;
  let breaking = 0;
  const prev = getPalaceByBranch(chart, (ming.branch + 11) % 12);
  const next = getPalaceByBranch(chart, (ming.branch + 1) % 12);
  const sunPalace = prev && hasStarInPalace(prev, '太阳') ? prev : next;
  const moonPalace = prev && hasStarInPalace(prev, '太阴') ? prev : next;

  if (sunPalace && isStarBright(sunPalace, '太阳')) bonus++;
  if (moonPalace && isStarBright(moonPalace, '太阴')) bonus++;
  if ((sunPalace && isStarDim(sunPalace, '太阳')) || (moonPalace && isStarDim(moonPalace, '太阴'))) breaking++;

  results.push(createMatch('日月夹命', 'good', bonus, breaking,
    '太阳太阴分居命宫两侧夹照，光明磊落，一生贵人相助，事业蓬勃。男主官贵，女主旺夫兴家。日月须不落陷方为真夹。',
    '《紫微斗数全书·日月夹命》'));
}

function checkJuRiTongGong(chart: ZiweiChart, results: PatternMatch[]) {
  const juPalace = findStarPalace(chart, '巨门');
  const sunPalace = findStarPalace(chart, '太阳');
  if (!juPalace || !sunPalace || juPalace.branch !== sunPalace.branch) return;
  if (juPalace.branch !== 2 && juPalace.branch !== 8) return;

  let bonus = 0;
  let breaking = 0;

  if (juPalace.branch === 2) bonus++;
  if (getStarSihua(juPalace, '巨门') === '禄' || getStarSihua(juPalace, '巨门') === '权') bonus++;
  if (getStarSihua(juPalace, '巨门') === '忌') breaking++;
  if (juPalace.branch === 8) breaking++;

  results.push(createMatch('巨日同宫', 'good', bonus, breaking,
    `巨门太阳同入${BRANCH_NAMES[juPalace.branch]}宫，太阳化解巨门暗曜，主以口才、传媒、外语、专业立业。寅宫为佳，申宫力减。怕巨门化忌则官非。`,
    '《紫微斗数全书·巨日同宫》'));
}

function checkShiZhongYinYu(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInPalace(ming, '巨门')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (getStarSihua(ming, '巨门') === '禄' || getStarSihua(ming, '巨门') === '权') bonus++;
  if (starSet.has('文昌')) bonus++;
  if (getStarSihua(ming, '巨门') === '忌') breaking++;
  if (hasShaInPalace(ming, SHA_HARD)) breaking++;

  results.push(createMatch('石中隐玉', 'good', bonus, breaking,
    '巨门坐命子午，外表平凡而内蕴才学。早年默默无闻、中年方显贵气，宜走专业、研究、口才、传媒。需有禄权或文昌相助方能"凿石见玉"。',
    '《紫微斗数骨髓赋·石中隐玉》'));
}

function checkMingZhuChuHai(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (ming.branch !== 7) return;
  if (hasMajorStarInPalace(ming)) return;
  const oppPalace = getPalaceByBranch(chart, getOppositePalaceIndex(ming.branch));
  if (!oppPalace || !hasStarInPalace(oppPalace, '太阳') || !hasStarInPalace(oppPalace, '太阴')) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('文昌') || starSet.has('文曲')) bonus++;
  if (starSet.has('左辅') || starSet.has('右弼')) bonus++;
  if (countShaInSanfang(chart, ming.branch) >= 2) breaking++;

  results.push(createMatch('明珠出海', 'good', bonus, breaking,
    '命未空宫，对宫丑宫日月同辉拱照，号"明珠出海"。主出生平凡、后天努力出头，宜远赴他乡、学术研究或大公司高位，主大富大贵。',
    '《紫微斗数全集·明珠出海》'));
}

function checkZiWeiRuMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInPalace(ming, '紫微') || hasStarInPalace(ming, '天府')) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('左辅') && starSet.has('右弼')) bonus++;
  if (starSet.has('文昌') && starSet.has('文曲')) bonus++;
  if (!starSet.has('左辅') && !starSet.has('右弼')) breaking++;
  if (hasShaInPalace(ming, SHA_KONG)) breaking++;

  results.push(createMatch('紫微入命', 'good', bonus, breaking,
    '紫微独坐命宫，帝王之星，自尊心强、有领导魅力。但紫微最忌"在野孤君"——若无左右辅弼相会，反成孤高自傲、易招毁谤。',
    '《紫微斗数全书》'));
}

// ────────────────── 助力格（6个） ──────────────────

function checkFuBiJiaMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!isFlanked(chart, ming.branch, '左辅', '右弼')) return;

  let bonus = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('天魁') || starSet.has('天钺')) bonus++;

  results.push(createMatch('辅弼夹命', 'helpful', bonus, 0,
    '左辅右弼夹命，一生贵人不断、逢凶化吉。适合走仕途、大企业管理，有贵人提携之命。古书云"左辅右弼，终身福厚"。',
    '《紫微斗数全书·辅弼夹命》'));
}

function checkChangQuJiaMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!isFlanked(chart, ming.branch, '文昌', '文曲')) return;

  results.push(createMatch('昌曲夹命', 'helpful', 0, 0,
    '文昌文曲夹命宫，主聪明俊秀、文采斐然，宜走文教、学术、艺术、写作。古书云"昌曲夹命主科甲"，最利考运。',
    '《紫微斗数全书》'));
}

function checkKuiYueJiaMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!isFlanked(chart, ming.branch, '天魁', '天钺')) return;

  results.push(createMatch('魁钺夹命', 'helpful', 0, 0,
    '天魁天钺夹命，男称天乙、女称玉堂，一生贵人提携。考试、求职、关键时刻常有意外贵人相助。',
    '《紫微斗数全书》'));
}

function checkShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const hasHuaLu = hasSihuaInSanfang(chart, ming.branch, '禄');
  const hasLuCun = hasStarInSanfang(chart, ming.branch, '禄存');
  if (!hasHuaLu || !hasLuCun) return;

  let breaking = 0;
  if (hasShaInPalace(ming, SHA_KONG)) breaking++;

  results.push(createMatch('双禄朝垣', 'helpful', 0, breaking,
    '化禄、禄存同会命宫三方四正，财源涌动、衣食丰足。古书云"双禄朝垣，富比陶朱"，主一生不愁财，多有正财横财兼得。',
    '《紫微斗数全书·双禄朝垣》'));
}

function checkSanQiJiaHui(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const hasLu = hasSihuaInSanfang(chart, ming.branch, '禄');
  const hasQuan = hasSihuaInSanfang(chart, ming.branch, '权');
  const hasKe = hasSihuaInSanfang(chart, ming.branch, '科');
  if (!hasLu || !hasQuan || !hasKe) return;

  results.push(createMatch('三奇加会', 'helpful', 0, 0,
    '化禄、化权、化科三吉化齐会命宫三方四正，号称"三奇加会"。主一生功名、财富、贵人三全，是紫微斗数最高吉格之一。',
    '《紫微斗数全书·三奇加会》'));
}

function checkHuaLuRuMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === '禄' && s.type === 'major');
  if (!huaLuStar) return;

  const starDesc: Record<string, string> = {
    '武曲': '武曲化禄属正财，宜实业、金融。',
    '太阴': '太阴化禄属阴财、不动产。',
    '贪狼': '贪狼化禄属人脉财、桃花财。',
  };

  results.push(createMatch(`${huaLuStar.name}化禄入命`, 'helpful', 0, 0,
    `${huaLuStar.name}化禄坐命，主生财顺利、人缘佳、机缘多。${starDesc[huaLuStar.name] ?? ''}`,
    '《紫微斗数全书》'));
}

// ────────────────── 恶格（8个） ──────────────────

function checkHuaJiRuMingQian(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const qianBranch = getOppositePalaceIndex(ming.branch);
  const qianPalace = getPalaceByBranch(chart, qianBranch);

  for (const palace of [ming, qianPalace]) {
    if (!palace) continue;
    const jiStars = palace.stars.filter(s => s.siHua === '忌' && s.type === 'major');
    for (const jiStar of jiStars) {
      const inMing = palace.branch === ming.branch;
      results.push(createMatch(`${jiStar.name}化忌入${inMing ? '命' : '迁'}`, 'evil', 0, 0,
        inMing
          ? `${jiStar.name}化忌坐命宫，需留意自身固执、心理障碍或健康隐患，凡事退一步思考。化忌不一定坏，代表此星能量需要特别关注。`
          : `${jiStar.name}化忌坐迁移宫，外出、远行、人际关系易有波折，宜守不宜动。`,
        '《紫微斗数全书》'));
    }
  }
}

function checkYangTuoJiaJi(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const hasJiInMing = ming.stars.some(s => s.siHua === '忌');
  if (!hasJiInMing) return;
  if (!isFlanked(chart, ming.branch, '擎羊', '陀罗')) return;

  results.push(createMatch('羊陀夹忌', 'evil', 0, 0,
    '化忌坐命，左右擎羊陀罗夹命，古书云"羊陀夹忌为败局"，主一生劳碌奔波、坎坷不顺、身心俱疲。需以德行修养与积极做事化解，凡事谨慎为上。',
    '《紫微斗数骨髓赋·羊陀夹忌》'));
}

function checkHuoLingJiaMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!isFlanked(chart, ming.branch, '火星', '铃星')) return;

  results.push(createMatch('火铃夹命', 'evil', 0, 0,
    '火星铃星分居命宫前后两宫夹命，主性急、易冲动、突发意外或纠纷。需培养耐性、避免冲动决策。',
    '《紫微斗数全书》'));
}

function checkKongJieJiaMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!isFlanked(chart, ming.branch, '地空', '地劫')) return;

  results.push(createMatch('空劫夹命', 'evil', 0, 0,
    '地空地劫夹命，主财来财去、思想脱俗、易遁入宗教哲学。古书云"空劫夹命，财不聚"。宜技艺、宗教、研究等不重物质之业。',
    '《紫微斗数全书》'));
}

function checkLianShaYang(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  if (!starSet.has('廉贞') || !starSet.has('七杀') || !starSet.has('擎羊')) return;

  results.push(createMatch('廉杀羊', 'evil', 0, 0,
    '廉贞、七杀、擎羊三星会照命宫三方，古书警示之凶格。主血光、官非、意外。本命有此格不必惊慌，但流年大限再触发时需特别谨慎驾驶、避免冲突、注意手术风险。',
    '《紫微斗数全书·廉杀羊》'));
}

function checkJuHuoYang(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  if (!starSet.has('巨门') || !starSet.has('火星') || !starSet.has('擎羊')) return;

  results.push(createMatch('巨火羊', 'evil', 0, 0,
    '巨门、火星、擎羊三星会照，古书云"巨火羊，终身缢死"——古时凶格。现代理解为：易因口舌、激烈冲突而招大祸。需修身养性、慎言慎行，避免极端情绪。',
    '《紫微斗数骨髓赋·巨火羊》'));
}

function checkLingChangTuoWu(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  if (!starSet.has('铃星') || !starSet.has('文昌') || !starSet.has('陀罗') || !starSet.has('武曲')) return;

  results.push(createMatch('铃昌陀武', 'evil', 0, 0,
    '铃星、文昌、陀罗、武曲四星齐会，古书云"铃昌陀武，限至投河"——古时大凶格。本命有此组合本身不必恐慌，但流年大限触发时需高度警觉重大决策、情绪起伏、水边活动。',
    '《紫微斗数骨髓赋·铃昌陀武》'));
}

function checkMaTouDaiJian(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (ming.branch !== 6) return;
  if (!hasStarInPalace(ming, '擎羊')) return;

  let bonus = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('七杀') || starSet.has('破军')) bonus++;
  if (starSet.has('天魁') || starSet.has('天钺')) bonus++;

  results.push(createMatch('马头带箭', 'evil', bonus, 0,
    '擎羊于午宫坐命，号"马头带箭"。古书云"威镇边疆"——主刚毅果决、有冲杀之力，宜军警武职、运动员、外科医师。但同时主危险与意外，需配合杀破狼或贵人方为大格，否则反主血光。',
    '《紫微斗数骨髓赋·马头带箭》'));
}

// ────────────────── 基础格局（10个） ──────────────────

function checkLuCunShouMingShen(chart: ZiweiChart, results: PatternMatch[]) {
  const luCunPalace = findStarPalace(chart, '禄存');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;

  results.push(createMatch(inMing ? '禄存守命' : '禄存守身', 'basic', 0, 0,
    inMing
      ? '禄存坐命，主一生衣食无忧、财禄稳定。性格保守，善积累，但羊陀夹禄须防小人。最宜配化禄、左辅右弼方为大格。'
      : '禄存入身宫，主中年后财源稳定、得禄自享。倪师说「禄存入身，财气近身」——配偶或事业方向能带来稳定财禄。',
    '《紫微斗数全书·禄存星》'));
}

function checkTianMaRuMingQian(chart: ZiweiChart, results: PatternMatch[]) {
  const tianMaPalace = findStarPalace(chart, '天马');
  if (!tianMaPalace) return;
  const mingBranch = chart.mingGongBranch;
  const inMing = tianMaPalace.branch === mingBranch;
  const inQian = tianMaPalace.branch === getOppositePalaceIndex(mingBranch);
  if (!inMing && !inQian) return;

  results.push(createMatch(inMing ? '天马入命' : '天马在迁', 'basic', 0, 0,
    inMing
      ? '天马坐命，主一生奔波、动中得财，宜走商旅、外勤、跨界发展。倪师说「天马入命，无禄不发」——若再会禄存或化禄即「禄马交驰」之富格。'
      : '天马在迁移宫，主外出有利、远行得财，宜异乡发展。配化禄主异地生财，配煞星则旅途多波折。',
    '《紫微斗数全书·天马星》'));
}

function checkHuaLuRuCai(chart: ZiweiChart, results: PatternMatch[]) {
  const caiPalace = getPalaceByName(chart, '财帛');
  if (!caiPalace) return;
  const luStar = caiPalace.stars.find(s => s.type === 'major' && s.siHua === '禄');
  if (!luStar) return;

  results.push(createMatch('化禄入财', 'basic', 0, 0,
    `${luStar.name}化禄入财帛宫，主财源畅通、收入稳定。倪师讲化禄是「正财」象征——这个化禄星所代表的核心特质是你赚钱的主轴。配禄存或天马则财源更广。`,
    '《紫微斗数全书·四化论》'));
}

function checkHuaQuanRuGuan(chart: ZiweiChart, results: PatternMatch[]) {
  const guanPalace = getPalaceByName(chart, '官禄');
  if (!guanPalace) return;
  const quanStar = guanPalace.stars.find(s => s.type === 'major' && s.siHua === '权');
  if (!quanStar) return;

  results.push(createMatch('化权入官', 'basic', 0, 0,
    `${quanStar.name}化权入官禄宫，主事业有掌控力、能担当独当一面的职位。化权代表权力与执行力，说明在事业上能成为决策者或核心执行者，宜走管理或技术权威路线。`,
    '《紫微斗数全书·四化论》'));
}

function checkHuaKeRuMingShen(chart: ZiweiChart, results: PatternMatch[]) {
  const ming = getMingGong(chart);
  const shen = getShenGong(chart);
  const targets: Palace[] = [];
  if (ming) targets.push(ming);
  if (shen && (!ming || shen.branch !== ming.branch)) targets.push(shen);

  for (const palace of targets) {
    const keStar = palace.stars.find(s => s.type === 'major' && s.siHua === '科');
    if (!keStar) continue;
    const isMing = palace.branch === chart.mingGongBranch;

    results.push(createMatch(isMing ? '化科入命' : '化科入身', 'basic', 0, 0,
      `${keStar.name}化科入${isMing ? '命' : '身'}宫，主名声、文书、学术运。倪师讲化科是「贵人星」——带来的是被人看重的特质，宜从事文书、教育、研究、咨询、文创等"以名取利"的方向。`,
      '《紫微斗数全书·四化论》'));
  }
}

function checkJiYueTongLiangSanXing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const starSet = getSanfangStarSet(chart, ming.branch);
  const stars = ['天机', '太阴', '天同', '天梁'];
  const found = stars.filter(s => starSet.has(s));
  if (found.length !== 3) return;

  const missing = stars.filter(s => !starSet.has(s));

  results.push(createMatch('机月同梁三星会', 'basic', 0, 0,
    `三方四正会齐${found.join('、')}，差${missing.join('、')}未会。机月同梁不全格，文质带谋，但稳定度不如四星齐。仍宜公职、教研、医疗、服务等需要积累与稳定的行业，关键看缺位星与四化的配合。`,
    '《紫微斗数全书·机月同梁格》（降级版）'));
}

function checkChangQuZuoMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInSanfang(chart, ming.branch, '文昌') || !hasStarInSanfang(chart, ming.branch, '文曲')) return;

  const inMing = hasStarInPalace(ming, '文昌') && hasStarInPalace(ming, '文曲');

  results.push(createMatch(inMing ? '昌曲坐命' : '昌曲同会', 'basic', 0, 0,
    inMing
      ? '文昌文曲同入命宫，主聪明俊秀、文采斐然，宜文学、教育、写作、咨询。最忌化忌——昌曲化忌主文书契约暗亏。'
      : '文昌文曲同会三方四正，主才华横溢、口才文笔俱佳。宜走需要表达与文采的行业，化科加持则名声大显。',
    '《紫微斗数全书·文星论》'));
}

function checkFuBiTongHui(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInSanfang(chart, ming.branch, '左辅') || !hasStarInSanfang(chart, ming.branch, '右弼')) return;

  results.push(createMatch('辅弼同会', 'basic', 0, 0,
    '左辅右弼同会命宫三方四正，主一生贵人不绝、人缘极佳。最宜领导岗位与团队合作型工作。倪师说「辅弼夹命，平生贵人多」——你不是单打独斗的命，要善用人际网络。',
    '《紫微斗数全书·辅弼论》'));
}

function checkKuiYueTongHui(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInSanfang(chart, ming.branch, '天魁') || !hasStarInSanfang(chart, ming.branch, '天钺')) return;

  results.push(createMatch('魁钺同会', 'basic', 0, 0,
    '天魁天钺同会命宫三方四正，主"天乙贵人"加持，关键时刻总有贵人提携。倪师说「魁钺夹命，必为贵人」——遇到困难时身边会出现得力相助者，宜主动维护人脉。',
    '《紫微斗数全书·魁钺论》'));
}

function checkKeQuanShuangHui(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasSihuaInSanfang(chart, ming.branch, '科') || !hasSihuaInSanfang(chart, ming.branch, '权')) return;

  results.push(createMatch('科权双会', 'basic', 0, 0,
    '化科+化权同会三方四正，主名权双美——既有学识/名声（科），又有掌控力（权），宜走"专业权威"路线（如医生、律师、教授、技术骨干），名利双收且根基扎实。',
    '《紫微斗数全书·四化会照》'));
}

// ────────────────── 补充格局（5个） ──────────────────

function checkRiYueBingMing(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const sunPalace = findStarPalace(chart, '太阳');
  const moonPalace = findStarPalace(chart, '太阴');
  if (!sunPalace || !moonPalace) return;

  const sunBrightBranches = [3, 4, 5, 6];
  const moonBrightBranches = [9, 10, 11, 0];
  if (!sunBrightBranches.includes(sunPalace.branch) || !moonBrightBranches.includes(moonPalace.branch)) return;
  if (!isStarBright(sunPalace, '太阳') || !isStarBright(moonPalace, '太阴')) return;
  if (!hasStarInSanfang(chart, ming.branch, '太阳') || !hasStarInSanfang(chart, ming.branch, '太阴')) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (starSet.has('文昌') || starSet.has('文曲')) bonus++;
  if (starSet.has('天魁') || starSet.has('天钺')) bonus++;
  if (isStarDim(sunPalace, '太阳') || isStarDim(moonPalace, '太阴')) breaking++;
  if (countShaInSanfang(chart, ming.branch) >= 3) breaking++;

  results.push(createMatch('日月并明', 'supplementary', bonus, breaking,
    '太阳在卯辰巳午（庙旺），太阴在酉戌亥子（庙旺），且会照命宫。日月各居庙旺之地，光明普照，主显达富贵、文武双全。',
    '《紫微斗数全书·日月并明格》'));
}

function checkLuMaJiaoChi(chart: ZiweiChart, results: PatternMatch[]) {
  const luCunPalace = findStarPalace(chart, '禄存');
  const tianMaPalace = findStarPalace(chart, '天马');
  if (!luCunPalace || !tianMaPalace) return;

  const samePalace = luCunPalace.branch === tianMaPalace.branch;
  const opposite = luCunPalace.branch === getOppositePalaceIndex(tianMaPalace.branch);
  if (!samePalace && !opposite) return;

  let bonus = 0;
  let breaking = 0;

  if (samePalace && hasSihuaInPalace(luCunPalace, '禄')) bonus++;
  if (!samePalace) {
    const oppPalace = getPalaceByBranch(chart, getOppositePalaceIndex(luCunPalace.branch));
    if (oppPalace && hasSihuaInPalace(oppPalace, '禄')) bonus++;
  }
  if (hasShaInPalace(luCunPalace, SHA_KONG) || hasShaInPalace(tianMaPalace, SHA_KONG)) breaking++;

  results.push(createMatch('禄马交驰', 'supplementary', bonus, breaking,
    '禄存与天马同宫或对照，主发财迅速、动中得财。古书云"禄马交驰，发财远郡"，宜远行、商贸、物流、跨境业务。',
    '《紫微斗数全书》'));
}

function checkKeQuanLuJia(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  const prev = getPalaceByBranch(chart, (ming.branch + 11) % 12);
  const next = getPalaceByBranch(chart, (ming.branch + 1) % 12);
  if (!prev || !next) return;

  let luckySihuaCount = 0;
  let hasJi = false;

  for (const palace of [prev, next]) {
    for (const star of palace.stars) {
      if (star.siHua === '禄' || star.siHua === '权' || star.siHua === '科') luckySihuaCount++;
      if (star.siHua === '忌') hasJi = true;
    }
  }

  if (luckySihuaCount < 2) return;

  let bonus = 0;
  let breaking = 0;

  if (luckySihuaCount >= 3) bonus++;
  if (hasJi) breaking++;

  results.push(createMatch('科权禄夹', 'supplementary', bonus, breaking,
    '化科、化权、化禄夹命（命宫前后两宫含三化中两化以上），主功名显达、权禄双全。三化全夹为最高配置。',
    '《紫微斗数全书》'));
}

function checkShuangLuJiaoLiu(chart: ZiweiChart, results: PatternMatch[]) {
  const huaLuPalaces: Palace[] = [];
  for (const palace of chart.palaces) {
    if (palace.stars.some(s => s.siHua === '禄')) {
      huaLuPalaces.push(palace);
    }
  }

  const luCunPalace = findStarPalace(chart, '禄存');
  if (!luCunPalace || huaLuPalaces.length === 0) return;

  let matched = false;
  for (const huaLuPalace of huaLuPalaces) {
    const samePalace = huaLuPalace.branch === luCunPalace.branch;
    const opposite = huaLuPalace.branch === getOppositePalaceIndex(luCunPalace.branch);
    if (!samePalace && !opposite) continue;
    matched = true;

    let bonus = 0;
    let breaking = 0;
    const starSet = getSanfangStarSet(chart, huaLuPalace.branch);

    if (starSet.has('天马')) bonus++;
    if (hasShaInPalace(huaLuPalace, SHA_KONG) || hasShaInPalace(luCunPalace, SHA_KONG)) breaking++;

    results.push(createMatch('双禄交流', 'supplementary', bonus, breaking,
      '化禄与禄存同宫或对照，主财源广进、富贵双全。与"双禄朝垣"不同，此格强调化禄与禄存直接交会（同宫或对宫），力量更集中。',
      '《紫微斗数全书》'));
    break;
  }

}

function checkQiShaChaoDou(chart: ZiweiChart, ming: Palace, results: PatternMatch[]) {
  if (!hasStarInPalace(ming, '七杀')) return;
  if (ming.branch !== 2 && ming.branch !== 8) return;
  if (!isStarBright(ming, '七杀')) return;
  if (!hasAuspiciousInSanfang(chart, ming.branch)) return;

  let bonus = 0;
  let breaking = 0;
  const starSet = getSanfangStarSet(chart, ming.branch);

  if (hasSihuaInSanfang(chart, ming.branch, '禄') || hasStarInSanfang(chart, ming.branch, '禄存')) bonus++;
  if (starSet.has('左辅') && starSet.has('右弼')) bonus++;
  if (countShaInSanfang(chart, ming.branch) >= 3) breaking++;
  if (isStarDim(ming, '七杀')) breaking++;

  results.push(createMatch('七杀朝斗', 'supplementary', bonus, breaking,
    '七杀入命于寅申宫（庙旺），三方有吉星会照，主威权出众、武职显贵。古书云"七杀朝斗，爵禄荣昌"，宜军警、企业高管、创业领袖。',
    '《紫微斗数全书·七杀朝斗格》'));
}

// ────────────────── 主入口 ──────────────────

export function analyzePatterns(chart: ZiweiChart): PatternAnalysisResult {
  const patterns: PatternMatch[] = [];
  const ming = getMingGong(chart);
  if (!ming) return { patterns, totalScore: 0, goodPatterns: [], evilPatterns: [] };

  checkJunChenQingHui(chart, ming, patterns);
  checkZiFuTongGong(chart, ming, patterns);
  checkFuXiangChaoYuan(chart, ming, patterns);
  checkYangLiangChangLu(chart, ming, patterns);
  checkHuoTanLingTan(chart, ming, patterns);
  checkWuTan(chart, ming, patterns);
  checkShaPoLang(chart, ming, patterns);
  checkJiYueTongLiang(chart, ming, patterns);

  checkLianZhenTianXiang(chart, patterns);
  checkWuQuQiSha(chart, patterns);
  checkTianTongTianLiang(chart, patterns);
  checkRiYueTongGong(chart, patterns);
  checkRiYueJiaMing(chart, ming, patterns);
  checkJuRiTongGong(chart, patterns);
  checkShiZhongYinYu(chart, ming, patterns);
  checkMingZhuChuHai(chart, ming, patterns);
  checkZiWeiRuMing(chart, ming, patterns);

  checkFuBiJiaMing(chart, ming, patterns);
  checkChangQuJiaMing(chart, ming, patterns);
  checkKuiYueJiaMing(chart, ming, patterns);
  checkShuangLuChaoYuan(chart, ming, patterns);
  checkSanQiJiaHui(chart, ming, patterns);
  checkHuaLuRuMing(chart, ming, patterns);

  checkHuaJiRuMingQian(chart, ming, patterns);
  checkYangTuoJiaJi(chart, ming, patterns);
  checkHuoLingJiaMing(chart, ming, patterns);
  checkKongJieJiaMing(chart, ming, patterns);
  checkLianShaYang(chart, ming, patterns);
  checkJuHuoYang(chart, ming, patterns);
  checkLingChangTuoWu(chart, ming, patterns);
  checkMaTouDaiJian(chart, ming, patterns);

  checkLuCunShouMingShen(chart, patterns);
  checkTianMaRuMingQian(chart, patterns);
  checkHuaLuRuCai(chart, patterns);
  checkHuaQuanRuGuan(chart, patterns);
  checkHuaKeRuMingShen(chart, patterns);
  checkJiYueTongLiangSanXing(chart, ming, patterns);
  checkChangQuZuoMing(chart, ming, patterns);
  checkFuBiTongHui(chart, ming, patterns);
  checkKuiYueTongHui(chart, ming, patterns);
  checkKeQuanShuangHui(chart, ming, patterns);

  checkRiYueBingMing(chart, ming, patterns);
  checkLuMaJiaoChi(chart, patterns);
  checkKeQuanLuJia(chart, ming, patterns);
  checkShuangLuJiaoLiu(chart, patterns);
  checkQiShaChaoDou(chart, ming, patterns);

  const totalScore = patterns.reduce((sum, p) => sum + p.score, 0);
  const goodPatterns = patterns.filter(p => p.score > 0);
  const evilPatterns = patterns.filter(p => p.score < 0);

  return { patterns, totalScore, goodPatterns, evilPatterns };
}
