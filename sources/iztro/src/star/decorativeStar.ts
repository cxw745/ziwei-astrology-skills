import { getHeavenlyStemAndEarthlyBranchBySolarDate } from 'lunar-lite';
import { getConfig, getFiveElementsClass, getSoulAndBody } from '../astro';
import { GENDER, earthlyBranches, FiveElementsClass } from '../data';
import {
  StarName,
  t,
  EarthlyBranchKey,
  kot,
  FiveElementsClassKey,
  EarthlyBranchName,
  FiveElementsClassName,
  GenderName,
  GenderKey,
  StarKey,
} from '../i18n';
import { fixEarthlyBranchIndex, fixIndex } from '../utils';
import { getLuYangTuoMaIndex } from './location';
import { AstrolabeParam } from '../data/types';
/**
 * 获取长生12神开始的宫位索引
 */
export const getChangesheng12StartIndex = (fiveElementClassName: FiveElementsClassName) => {
  const fiveElementClass = kot<FiveElementsClassKey>(fiveElementClassName);
  let startIdx = 0;
  switch (FiveElementsClass[fiveElementClass]) {
    case 2: {
      startIdx = fixEarthlyBranchIndex('shen');
      break;
    }
    case 3: {
      startIdx = fixEarthlyBranchIndex('hai');
      break;
    }
    case 4: {
      startIdx = fixEarthlyBranchIndex('si');
      break;
    }
    case 5: {
      startIdx = fixEarthlyBranchIndex('shen');
      break;
    }
    case 6: {
      startIdx = fixEarthlyBranchIndex('yin');
      break;
    }
  }
  return startIdx;
};
/**
 * 长生12神。
 *
 * 阳男阴女顺行，阴男阳女逆行，安长生、沐浴、冠带、临官、帝旺、衰、病、死、墓、绝 、胎、养。
 */
export const getchangsheng12 = (param: AstrolabeParam): StarName[] => {
  const { solarDate, gender } = param;
  const changsheng12: StarName[] = [];
  const genderKey = kot<GenderKey>(gender!);
  const { yearly } = getHeavenlyStemAndEarthlyBranchBySolarDate(solarDate, 0, {
    year: getConfig().yearDivide,
  });
  const [, earthlyBranchNameOfYear] = yearly;
  const earthlyBranchOfYear = kot<EarthlyBranchKey>(earthlyBranchNameOfYear, 'Earthly');
  const { heavenlyStemOfSoul, earthlyBranchOfSoul } = getSoulAndBody(param);
  const fiveElementClass = getFiveElementsClass(heavenlyStemOfSoul, earthlyBranchOfSoul);
  const stars: StarKey[] = [
    'changsheng',
    'muyu',
    'guandai',
    'linguan',
    'diwang',
    'shuai',
    'bing',
    'si',
    'mu',
    'jue',
    'tai',
    'yang',
  ];
  const startIdx = getChangesheng12StartIndex(fiveElementClass);
  for (let i = 0; i < stars.length; i++) {
    let idx = 0;
    if (GENDER[genderKey] === earthlyBranches[earthlyBranchOfYear].yinYang) {
      idx = fixIndex(i + startIdx);
    } else {
      idx = fixIndex(startIdx - i);
    }
    changsheng12[idx] = t(stars[i]);
  }
  return changsheng12;
};
/**
 * 博士12神。
 */
export const getBoShi12 = (solarDateStr: string, gender: GenderName): StarName[] => {
  const genderKey = kot<GenderKey>(gender);
  const { yearly } = getHeavenlyStemAndEarthlyBranchBySolarDate(solarDateStr, 0, {
    year: getConfig().yearDivide,
  });
  const [heavenlyStemNameOfYear, earthlyBranchNameOfYear] = yearly;
  const earthlyBranchOfYear = kot<EarthlyBranchKey>(earthlyBranchNameOfYear, 'Earthly');
  const stars: StarKey[] = [
    'boshi',
    'lishi',
    'qinglong',
    'xiaohao',
    'jiangjun',
    'zhoushu',
    'faylian',
    'xishen',
    'bingfu',
    'dahao',
    'fubing',
    'guanfu',
  ];
  const { luIndex } = getLuYangTuoMaIndex(heavenlyStemNameOfYear, earthlyBranchNameOfYear);
  const boshi12: StarName[] = [];
  for (let i = 0; i < stars.length; i++) {
    const idx = fixIndex(
      GENDER[genderKey] === earthlyBranches[earthlyBranchOfYear].yinYang ? luIndex + i : luIndex - i,
    );
    boshi12[idx] = t(stars[i]);
  }
  return boshi12;
};
/**
 * 安流年将前诸星（按流年地支起将星）
 */
export const getJiangqian12StartIndex = (earthlyBranchName: EarthlyBranchName) => {
  let jqStartIdx = -1;
  const earthlyBranchOfYear = kot<EarthlyBranchKey>(earthlyBranchName, 'Earthly');
  if (['yinEarthly', 'wuEarthly', 'xuEarthly'].includes(earthlyBranchOfYear)) {
    jqStartIdx = fixEarthlyBranchIndex('woo');
  } else if (['shenEarthly', 'ziEarthly', 'chenEarthly'].includes(earthlyBranchOfYear)) {
    jqStartIdx = fixEarthlyBranchIndex('zi');
  } else if (['siEarthly', 'youEarthly', 'chouEarthly'].includes(earthlyBranchOfYear)) {
    jqStartIdx = fixEarthlyBranchIndex('you');
  } else if (['haiEarthly', 'maoEarthly', 'weiEarthly'].includes(earthlyBranchOfYear)) {
    jqStartIdx = fixEarthlyBranchIndex('mao');
  }
  return fixIndex(jqStartIdx);
};
/**
 * 流年诸星。
 */
export const getYearly12 = (solarDateStr: string | Date): { suiqian12: StarName[]; jiangqian12: StarName[] } => {
  const jiangqian12: StarName[] = [];
  const suiqian12: StarName[] = [];
  const { algorithm } = getConfig();
  const { yearly } = getHeavenlyStemAndEarthlyBranchBySolarDate(solarDateStr, 0, {
    year: getConfig().horoscopeDivide,
  });
  const ts12shen: StarKey[] =
    algorithm === 'zhongzhou'
      ? [
          'suijian',
          'huiqi',
          'sangmen',
          'guansuo',
          'gwanfu',
          'xiaohao',
          'suipo',
          'longde',
          'baihu',
          'tiande',
          'diaoke',
          'bingfu',
        ]
      : [
          'suijian',
          'huiqi',
          'sangmen',
          'guansuo',
          'gwanfu',
          'xiaohao',
          'dahao',
          'longde',
          'baihu',
          'tiande',
          'diaoke',
          'bingfu',
        ];
  for (let i = 0; i < ts12shen.length; i++) {
    const idx = fixIndex(fixEarthlyBranchIndex(yearly[1]) + i);
    suiqian12[idx] = t(ts12shen[i]);
  }
  const jq12shen: StarKey[] = [
    'jiangxing',
    'panan',
    'suiyi',
    'xiishen',
    'huagai',
    'jiesha',
    'zhaisha',
    'tiansha',
    'zhibei',
    'xianchi',
    'yuesha',
    'wangshen',
  ];
  const jiangqian12StartIndex = getJiangqian12StartIndex(yearly[1]);
  for (let i = 0; i < jq12shen.length; i++) {
    const idx = fixIndex(jiangqian12StartIndex + i);
    jiangqian12[idx] = t(jq12shen[i]);
  }
  return { suiqian12, jiangqian12 };
};
