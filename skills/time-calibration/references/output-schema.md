# astro.js 输出数据结构

## 基础排盘输出（不含 `--year`）

```json
{
  "basicInfo": {
    "solarDate": "1990-5-15",
    "lunarDate": "一九九〇年四月廿一",
    "chineseDate": "庚午 辛巳 庚辰 壬午",
    "gender": "男",
    "time": "午时",
    "timeRange": "11:00~13:00",
    "zodiac": "马",
    "sign": "金牛座",
    "soulPalace": "亥",
    "bodyPalace": "亥",
    "soul": "巨门",
    "body": "火星",
    "fiveElementsClass": "土五局",
    "startingAge": 5,
    "originalPalace": { "name": "仆役", "index": 2 }
  },
  "palaces": [
    {
      "index": 0,
      "name": "田宅",
      "heavenlyStem": "戊",
      "earthlyBranch": "寅",
      "majorStars": [{"name": "廉贞", "type": "major", "brightness": "庙"}],
      "minorStars": [],
      "adjectiveStars": [...],
      "changsheng12": "病",
      "boshi12": "博士",
      "jiangqian12": "将星",
      "suiqian12": "岁驿",
      "decadal": { "range": "85~94", "heavenlyStem": "...", "earthlyBranch": "..." },
      "ages": [85],
      "isBodyPalace": false,
      "isOriginalPalace": false
    }
    // ... 共 12 个宫位
  ],
  "soulPalaceInfo": {
    "index": 9,
    "name": "命宫",
    "earthlyBranch": "亥",
    "majorStars": [{"name": "天梁", "type": "major", "brightness": "陷"}],
    "minorStars": [],
    "heavenlyStem": "丁",
    "isBodyPalace": true
  },
  "bodyPalaceInfo": {
    "index": 9,
    "name": "命宫",
    "earthlyBranch": "亥",
    "majorStars": [{"name": "天梁", "type": "major", "brightness": "陷"}],
    "minorStars": [],
    "heavenlyStem": "丁"
  },
  "birthMutagens": [
    {"mutagen": "禄", "star": "太阳", "palace": "福德", "palaceIndex": 8}
  ],
  "palaceFlyingMutagens": [
    {"sourcePalace": "命宫", "heavenlyStem": "丁", "mutagen": "禄", "targetPalace": "父母", "targetPalaceIndex": 6}
  ],
  "decadalList": [
    {"palace": "命宫", "palaceIndex": 9, "range": "5~14", "heavenlyStem": "...", "earthlyBranch": "..."}
  ]
}
```

### 关键字段速查

| 反推需求 | 取值路径 |
|---------|---------|
| 命宫主星+亮度 | `soulPalaceInfo.majorStars[0].name` + `.brightness` |
| 命宫地支 | `soulPalaceInfo.earthlyBranch` |
| 身宫位置+主星 | `bodyPalaceInfo.name` + `.majorStars` |
| 化禄落宫 | `birthMutagens` 中 `mutagen="禄"` 的 `palace` |
| 化忌落宫 | `birthMutagens` 中 `mutagen="忌"` 的 `palace` |
| 来因宫 | `basicInfo.originalPalace.name` |
| 各宫主星 | `palaces[i].majorStars` |
| 当前大限 | 见下方"当前大限计算" |

### 当前大限计算

1. 从 `decadalList` 中获取所有大限范围
2. 根据用户当前虚岁年龄匹配：
   - 虚岁 = 当前农历年 - 出生农历年 + 1
   - 匹配 `range` 字段（如 `"25~34"` 表示虚岁 25~34 岁）
3. 边界情况：如果用户年龄在两个大限交界处（如 24 岁或 25 岁），参考 `startingAge` 确定起运年龄后偏移

## 带 `--year` 的流年输出

追加 `yearlyData` 字段：

```json
"yearlyData": {
  "year": 2020,
  "yearlyPalaces": [
    {
      "palaceIndex": 0,
      "palaceName": "流年命宫",
      "originPalaceName": "田宅",
      "stars": [{"name": "紫微", "type": "major"}]
    }
    // ... 12 个流年宫位
  ],
  "yearlyMutagens": [
    {"mutagen": "禄", "star": "太阳", "yearlyPalaceName": "流年夫妻", "yearlyPalaceIndex": 3, "originPalaceName": "子女"}
  ],
  "decadalMutagens": [
    {"mutagen": "忌", "star": "天机", "decadalPalaceName": "大限命宫", "decadalPalaceIndex": 0, "originPalaceName": "命宫"}
  ],
  "yearlyHeavenlyStem": "庚",
  "decadalHeavenlyStem": "己"
}
```

### 流年验证用法

1. 用 `--year` 指定事件发生年份
2. 检查 `yearlyMutagens` 中的四化是否触发事件相关宫位
3. 检查 `decadalMutagens` 中大限四化是否参与
4. 用 `originPalaceName` 反查原始宫位名称，判断是否与事件领域相关

## 宫位索引对照

| index | 宫位名 |
|-------|--------|
| 0 | 命宫 |
| 1 | 兄弟 |
| 2 | 夫妻 |
| 3 | 子女 |
| 4 | 财帛 |
| 5 | 疾厄 |
| 6 | 迁移 |
| 7 | 仆役 |
| 8 | 官禄 |
| 9 | 田宅 |
| 10 | 福德 |
| 11 | 父母 |