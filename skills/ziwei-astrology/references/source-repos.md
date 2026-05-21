# 源仓库本地索引

本 Skill 的两个依赖仓库已作为 `sources/` 子目录包含在项目中，作为事实索引数据库。生成报告时，每条内容必须标注来源文件，确保可追溯、不虚构。

## 本地路径

| 仓库 | 本地路径 | 远程地址 |
|------|---------|---------|
| iztro | `sources/iztro/` | https://github.com/SylarLong/iztro |
| ziwei-doushu | `sources/ziwei-doushu/` | https://github.com/Renhuai123/ziwei-doushu |

---

## iztro 文件索引（排盘算法）

### 核心排盘

| 文件路径 | 内容 | 对应 references |
|---------|------|----------------|
| `sources/iztro/src/astro/astro.ts` | 排盘入口与主流程（bySolar方法） | - |
| `sources/iztro/src/astro/palace.ts` | 命身宫、五行局、大限计算 | - |
| `sources/iztro/src/astro/FunctionalAstrolabe.ts` | 星盘功能方法（四化、飞化） | - |
| `sources/iztro/src/astro/FunctionalPalace.ts` | 宫位功能方法（飞化、三方四正） | - |
| `sources/iztro/src/astro/FunctionalHoroscope.ts` | 运限功能方法（大限/流年/流月） | - |
| `sources/iztro/src/astro/analyzer.ts` | 星盘分析器 | - |

### 星耀安星

| 文件路径 | 内容 | 对应 references |
|---------|------|----------------|
| `sources/iztro/src/star/location.ts` | 各星位置计算核心（907行） | star-rules.md |
| `sources/iztro/src/star/majorStar.ts` | 十四主星安法 | star-rules.md |
| `sources/iztro/src/star/minorStar.ts` | 辅星安法 | star-rules.md |
| `sources/iztro/src/star/adjectiveStar.ts` | 杂耀安法 | star-rules.md |
| `sources/iztro/src/star/decorativeStar.ts` | 长生十二神/博士十二神 | star-rules.md |
| `sources/iztro/src/star/horoscopeStar.ts` | 运限星耀 | - |
| `sources/iztro/src/star/FunctionalStar.ts` | 星耀功能方法 | - |

### 数据定义

| 文件路径 | 内容 | 对应 references |
|---------|------|----------------|
| `sources/iztro/src/data/heavenlyStems.ts` | 天干四化定义 | sihua-rules.md |
| `sources/iztro/src/data/earthlyBranches.ts` | 地支数据（命主身主等） | star-rules.md |
| `sources/iztro/src/data/stars.ts` | 星耀亮度表 | star-rules.md |
| `sources/iztro/src/data/constants.ts` | 常量定义 | - |

### 类型定义

| 文件路径 | 内容 |
|---------|------|
| `sources/iztro/src/data/types/astro.ts` | 星盘类型（229行） |
| `sources/iztro/src/data/types/palace.ts` | 宫位类型 |
| `sources/iztro/src/data/types/star.ts` | 星耀类型 |

### 中文本地化

| 文件路径 | 内容 |
|---------|------|
| `sources/iztro/src/i18n/locales/zh-CN/` | 中文翻译（星耀名/宫位名/亮度名等） |

---

## ziwei-doushu 文件索引（倪海厦知识库）

### 核心排盘与格局

| 文件路径 | 内容 | 对应 references |
|---------|------|----------------|
| `sources/ziwei-doushu/lib/ziwei/algorithm.ts` | 排盘流程（基于iztro封装） | - |
| `sources/ziwei-doushu/lib/ziwei/patterns.ts` | 格局识别规则（1118行，46个格局） | patterns.md |
| `sources/ziwei-doushu/lib/ziwei/sihua.ts` | 四化系统与宫干自化 | sihua-rules.md |
| `sources/ziwei-doushu/lib/ziwei/constants.ts` | 常量与星耀描述 | star-rules.md |
| `sources/ziwei-doushu/lib/ziwei/heming-knowledge.ts` | 倪海厦合盘与夫妻宫断语 | heming-knowledge.md |

### 倪海厦知识体系

| 文件路径 | 内容 |
|---------|------|
| `sources/ziwei-doushu/lib/nihai/tianji.ts` | 天纪（紫微斗数/易经/堪舆/面相等，548行） | nihai-quotes.md |
| `sources/ziwei-doushu/lib/nihai/renji.ts` | 人纪（针灸/内经/本草/伤寒等，659行） |
| `sources/ziwei-doushu/lib/nihai/diji.ts` | 地纪（地理志/风水与国运，183行） |

### 古籍原文

| 文件路径 | 内容 |
|---------|------|
| `sources/ziwei-doushu/lib/classics/gusuifu.ts` | 骨髓赋（紫微斗数核心歌诀，218行） | classics-excerpts.md |
| `sources/ziwei-doushu/lib/classics/quanji.ts` | 紫微斗数全集（清代古本，195行） |
| `sources/ziwei-doushu/lib/classics/quanshu.ts` | 紫微斗数全书（陈希夷传本，146行） |

### SEO知识图谱

| 文件路径 | 内容 |
|---------|------|
| `sources/ziwei-doushu/lib/seo/knowledge.ts` | 14主星×12宫位结构化知识数据 | star-palace-matrix.md |

---

## 引用标注格式

生成报告时，每条事实性内容必须标注来源。格式如下：

### 行内标注（推荐）

```
太阳为官禄主，主贵不主富 [来源: iztro/src/data/stars.ts]
```

### 表格内标注

```
| 四化 | 星曜 | 来源 |
|------|------|------|
| 甲干化禄 | 廉贞 | [iztro/src/data/heavenlyStems.ts] |
```

### 断语标注

```
> 倪师断语：夫妻宫武曲星，婚姻必晚 [来源: ziwei-doushu/lib/nihai/tianji.ts]
```

### 格局标注

```
紫府同宫格：必须条件紫微天府同宫 [来源: ziwei-doushu/lib/ziwei/patterns.ts]
```

### 标注规范

1. **格式**：`[来源: 仓库名/文件路径]` 或 `[来源: 仓库名/文件路径#行号]`
2. **仓库名**：`iztro` 或 `ziwei-doushu`（对应 `sources/` 下的目录名）
3. **文件路径**：相对于 `sources/` 目录的路径，如 `iztro/src/data/stars.ts`
4. **行号**：可选，精确到行号时用 `#L123` 格式
5. **必须标注的场景**：
   - 星耀亮度数据
   - 四化对照表
   - 格局识别规则
   - 倪师断语
   - 古籍引用
   - 宫位解读规则
   - 倪师天纪断语（引用 nihai-quotes.md 时仍标注 sources 路径）
   - 古籍原文摘录（引用 classics-excerpts.md 时仍标注 sources 路径）
6. **不需要标注的场景**：
   - 基本数学推算（如五行局推算过程）
   - AI综合分析（标注"AI综合分析"即可）
   - 常识性描述

---

## 倪师体系核心立场（与飞星派差异）

| 项目 | 倪师体系 | 飞星派 |
|------|---------|--------|
| 大限四化 | 不使用 | 使用 |
| 宫干自化 | 不主张 | 常用 |
| 亮度分级 | 三级（庙旺/平/陷） | 七级 |
| 格局判断 | 三层结构（必须/加分/破格） | 无统一标准 |
| 婚姻判断 | 必须同时看夫妻宫+福德宫 | 主要看夫妻宫 |

---

## 查阅原则

1. **sources/ 为事实基准**：所有事实性内容必须可追溯到 sources/ 中的具体文件
2. **references 为提炼版**：references 文件是从 sources/ 提炼的精简规则，优先使用。当前共12个 references 文件
3. **sources/ 用于验证**：对 references 内容有疑问时，查阅 sources/ 原文验证
4. **标注即验证**：每条标注都是对内容事实性的背书，无法标注的内容需声明"AI推断"
