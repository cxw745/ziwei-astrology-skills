# astro.js 输出数据结构

astro.js 输出一个 JSON 对象，包含基础排盘数据与可选的流年数据。以下按顶层字段逐一说明。

---

## 1. basicInfo

基本信息对象，记录命盘的出生与排盘元数据。

| 字段 | 类型 | 说明 |
|------|------|------|
| `solarDate` | string | 阳历日期，格式 `"YYYY-M-D"`，如 `"1990-5-15"` |
| `lunarDate` | string | 农历日期中文表示，如 `"一九九〇年四月廿一"` |
| `chineseDate` | string | 四柱干支，格式 `"年柱 月柱 日柱 时柱"`，如 `"庚午 辛巳 庚辰 壬午"` |
| `gender` | string | 性别，`"男"` 或 `"女"` |
| `time` | string | 时辰名称，如 `"午时"` |
| `timeRange` | string | 时辰对应的时间范围，如 `"11:00~13:00"` |
| `zodiac` | string | 生肖，如 `"马"` |
| `sign` | string | 西方星座，如 `"金牛座"` |
| `soulPalace` | string | 命宫地支，如 `"亥"` |
| `bodyPalace` | string | 身宫地支，如 `"亥"` |
| `soul` | string | 命主星，如 `"巨门"` |
| `body` | string | 身主星，如 `"火星"` |
| `fiveElementsClass` | string | 五行局，取值：`"水二局"` / `"木三局"` / `"金四局"` / `"土五局"` / `"火六局"` |
| `startingAge` | number \| null | 起运年龄，由五行局推导：水二局=2、木三局=3、金四局=4、土五局=5、火六局=6 |
| `originalPalace` | object | 来因宫信息，见下方 |

### originalPalace 子对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 来因宫宫位名，如 `"仆役"` |
| `index` | number | 来因宫在 palaces 数组中的索引 |

---

## 2. palaces

12 个宫位的数组，索引 0~11 依次对应：命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、仆役、官禄、田宅、福德、父母。

### 宫位对象字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `index` | number | 宫位索引，0~11 |
| `name` | string | 宫位名称，如 `"命宫"`、`"财帛"` |
| `heavenlyStem` | string | 宫位天干，如 `"戊"` |
| `earthlyBranch` | string | 宫位地支，如 `"寅"` |
| `majorStars` | Star[] | 主星数组 |
| `minorStars` | Star[] | 辅星数组 |
| `adjectiveStars` | Star[] | 杂曜数组 |
| `changsheng12` | string | 长生十二神，如 `"病"` |
| `boshi12` | string | 博士十二神，如 `"博士"` |
| `jiangqian12` | string | 将前十二星，如 `"将星"` |
| `suiqian12` | string | 岁前十二星，如 `"岁驿"` |
| `decadal` | object | 大限信息，见下方 |
| `ages` | number[] | 该宫位大限覆盖的虚岁年龄列表 |
| `isBodyPalace` | boolean | 是否为身宫所在 |
| `isOriginalPalace` | boolean | 是否为来因宫 |

### Star 星曜对象

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 星曜名称，如 `"廉贞"` |
| `type` | string | 是 | 星曜类型：`"major"`（主星）/ `"minor"`（辅星）/ `"adjective"`（杂曜） |
| `brightness` | string | 否 | 亮度，如 `"庙"`、`"旺"`、`"得"`、`"利"`、`"平"`、`"不"`、`"陷"` |
| `mutagen` | string | 否 | 生年四化标记：`"禄"` / `"权"` / `"科"` / `"忌"`，仅被四化的星曜才有此字段 |

### decadal 大限子对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `range` | string | 大限年龄范围，如 `"85~94"` |
| `heavenlyStem` | string | 大限天干 |
| `earthlyBranch` | string | 大限地支 |

---

## 3. birthMutagens

生年四化数组。遍历所有宫位的主星和辅星，收集带有 `mutagen` 标记的星曜。

### 数组元素字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutagen` | string | 四化类型：`"禄"` / `"权"` / `"科"` / `"忌"` |
| `star` | string | 被化星曜名称，如 `"太阳"` |
| `palace` | string | 该星曜所在宫位名，如 `"福德"` |
| `palaceIndex` | number | 该星曜所在宫位在 palaces 数组中的索引 |

数组固定包含 4 个元素，依次为禄、权、科、忌。

---

## 4. palaceFlyingMutagens

宫干飞化数组。12 个宫位各自按其天干飞出四化（禄权科忌），共 12×4=48 条记录。

### 数组元素字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `sourcePalace` | string | 飞化来源宫位名，如 `"命宫"` |
| `sourcePalaceIndex` | number | 来源宫位在 palaces 数组中的索引 |
| `heavenlyStem` | string | 来源宫位的天干，如 `"丁"` |
| `mutagen` | string | 四化类型：`"禄"` / `"权"` / `"科"` / `"忌"` |
| `targetPalace` | string | 飞化落入的宫位名，如 `"父母"`；若目标为空则为 `""` |
| `targetPalaceIndex` | number | 落入宫位在 palaces 数组中的索引；若目标为空则为 `-1` |

---

## 5. decadalList

大限列表数组。仅包含有大限范围（`decadal.range` 存在）的宫位，通常为 12 条。

### 数组元素字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `palace` | string | 大限命宫所在的原盘宫位名，如 `"命宫"` |
| `palaceIndex` | number | 对应 palaces 数组中的索引 |
| `range` | string | 大限年龄范围，如 `"5~14"` |
| `heavenlyStem` | string | 大限天干 |
| `earthlyBranch` | string | 大限地支 |

---

## 6. soulPalaceInfo

命宫详细信息对象。根据 `basicInfo.soulPalace`（命宫地支）从 palaces 中匹配。

| 字段 | 类型 | 说明 |
|------|------|------|
| `index` | number | 命宫在 palaces 数组中的索引 |
| `name` | string | 命宫宫位名（通常为 `"命宫"`） |
| `earthlyBranch` | string | 命宫地支 |
| `majorStars` | Star[] | 命宫主星数组 |
| `minorStars` | Star[] | 命宫辅星数组 |
| `heavenlyStem` | string | 命宫天干 |
| `isBodyPalace` | boolean | 命宫是否同时为身宫 |

若未找到匹配宫位，值为 `null`。

---

## 7. bodyPalaceInfo

身宫详细信息对象。根据 `basicInfo.bodyPalace`（身宫地支）从 palaces 中匹配。

| 字段 | 类型 | 说明 |
|------|------|------|
| `index` | number | 身宫在 palaces 数组中的索引 |
| `name` | string | 身宫所在宫位名 |
| `earthlyBranch` | string | 身宫地支 |
| `majorStars` | Star[] | 身宫主星数组 |
| `minorStars` | Star[] | 身宫辅星数组 |
| `heavenlyStem` | string | 身宫天干 |

若未找到匹配宫位，值为 `null`。

注意：身宫可能与命宫重合（`bodyPalaceInfo.index === soulPalaceInfo.index`），此时命宫同时为身宫。

---

## 8. yearlyData

仅当使用 `--year YYYY` 参数时才输出。包含指定年份的流年数据。

| 字段 | 类型 | 说明 |
|------|------|------|
| `year` | number | 查询的年份 |
| `yearlyPalaces` | object[] | 流年十二宫位数据 |
| `yearlyMutagens` | object[] | 流年四化数组 |
| `decadalMutagens` | object[] | 大限四化数组 |
| `yearlyHeavenlyStem` | string | 流年天干 |
| `decadalHeavenlyStem` | string | 大限天干 |

若获取失败，则返回 `{ "year": YYYY, "error": "错误信息" }`。

### yearlyPalaces 数组元素

| 字段 | 类型 | 说明 |
|------|------|------|
| `palaceIndex` | number | 宫位索引，0~11 |
| `palaceName` | string | 流年宫位名，如 `"流年命宫"`、`"流年夫妻"` |
| `originPalaceName` | string | 对应原盘宫位名，如 `"田宅"`、`"子女"` |
| `stars` | object[] | 流年宫位内的星曜，每项含 `name` 和 `type` |

### yearlyMutagens 数组元素

流年四化，遍历流年各宫位星曜中带 `mutagen` 标记的。

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutagen` | string | 四化类型：`"禄"` / `"权"` / `"科"` / `"忌"` |
| `star` | string | 被化星曜名称 |
| `yearlyPalaceName` | string | 流年宫位名，如 `"流年夫妻"` |
| `yearlyPalaceIndex` | number | 流年宫位索引 |
| `originPalaceName` | string | 对应原盘宫位名，如 `"子女"` |

### decadalMutagens 数组元素

大限四化，遍历大限各宫位星曜中带 `mutagen` 标记的。

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutagen` | string | 四化类型：`"禄"` / `"权"` / `"科"` / `"忌"` |
| `star` | string | 被化星曜名称 |
| `decadalPalaceName` | string | 大限宫位名，如 `"大限命宫"` |
| `decadalPalaceIndex` | number | 大限宫位索引 |
| `originPalaceName` | string | 对应原盘宫位名，如 `"命宫"` |

---

## 宫位索引对照表

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

## 关键字段速查

| 反推需求 | 取值路径 |
|---------|---------|
| 命宫主星+亮度 | `soulPalaceInfo.majorStars[0].name` + `.brightness` |
| 命宫地支 | `soulPalaceInfo.earthlyBranch` |
| 身宫位置+主星 | `bodyPalaceInfo.name` + `.majorStars` |
| 生年化禄落宫 | `birthMutagens` 中 `mutagen="禄"` 的 `palace` |
| 生年化忌落宫 | `birthMutagens` 中 `mutagen="忌"` 的 `palace` |
| 来因宫 | `basicInfo.originalPalace.name` |
| 各宫主星 | `palaces[i].majorStars` |
| 宫干飞化 | `palaceFlyingMutagens` 中按 `sourcePalace` 筛选 |
| 当前大限 | `decadalList` 中匹配当前虚岁的 `range` |
| 流年四化 | `yearlyData.yearlyMutagens` |
| 大限四化 | `yearlyData.decadalMutagens` |

## 当前大限计算

1. 从 `decadalList` 中获取所有大限范围
2. 根据用户当前虚岁年龄匹配：
   - 虚岁 = 当前农历年 - 出生农历年 + 1
   - 匹配 `range` 字段（如 `"25~34"` 表示虚岁 25~34 岁）
3. 边界情况：如果用户年龄在两个大限交界处，参考 `startingAge` 确定起运年龄后偏移
