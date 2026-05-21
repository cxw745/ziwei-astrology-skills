# 源仓库文件映射

本 Skill 的 references 文件从以下两个开源仓库提炼而来。当 references 中的规则不足以覆盖特殊情况时，可按需查阅源仓库对应文件进行验证。

## iztro 仓库（排盘算法）

仓库地址：`https://github.com/SylarLong/iztro`

| 源文件 | 对应 references | 内容 |
|--------|----------------|------|
| src/astro/astro.ts | - | 排盘入口与主流程 |
| src/astro/palace.ts | - | 命身宫、五行局、大限计算 |
| src/star/majorStar.ts | star-rules.md | 十四主星安法 |
| src/star/minorStar.md | star-rules.md | 辅星安法 |
| src/star/adjectiveStar.ts | star-rules.md | 杂耀安法 |
| src/star/location.ts | star-rules.md | 各星位置计算 |
| src/data/heavenlyStems.ts | sihua-rules.md | 天干四化定义 |
| src/data/earthlyBranches.ts | - | 地支数据（命主身主等） |
| src/data/stars.ts | star-rules.md | 星耀亮度表 |
| src/astro/FunctionalAstrolabe.ts | - | 星盘功能方法 |
| src/astro/FunctionalPalace.ts | - | 宫位功能方法（飞化等） |
| src/astro/FunctionalHoroscope.ts | - | 运限功能方法 |

## ziwei-doushu 仓库（解读知识库）

仓库地址：`https://github.com/Renhuai123/ziwei-doushu`

| 源文件 | 对应 references | 内容 |
|--------|----------------|------|
| lib/ziwei/algorithm.ts | - | 排盘流程（基于iztro封装） |
| lib/ziwei/patterns.ts | patterns.md | 格局识别规则（1100+行） |
| lib/ziwei/sihua.ts | sihua-rules.md | 四化系统与宫干自化 |
| lib/ziwei/heming-knowledge.ts | heming-knowledge.md | 倪海厦合盘与夫妻宫断语 |
| lib/ziwei/constants.ts | - | 常量与星耀描述 |
| lib/classics/gusuifu.ts | - | 骨髓赋古籍原文 |
| lib/classics/quanji.ts | - | 紫微斗数全集 |
| lib/classics/quanshu.ts | - | 紫微斗数全书 |

## 倪师体系核心立场（与飞星派差异）

| 项目 | 倪师体系 | 飞星派 |
|------|---------|--------|
| 大限四化 | 不使用 | 使用 |
| 宫干自化 | 不主张 | 常用 |
| 亮度分级 | 三级（庙旺/平/陷） | 七级 |
| 格局判断 | 三层结构（必须/加分/破格） | 无统一标准 |
| 婚姻判断 | 必须同时看夫妻宫+福德宫 | 主要看夫妻宫 |

## 查阅原则

1. **优先使用 references**：本 Skill 的 references 已提炼源仓库的核心规则，日常使用无需查阅源仓库
2. **按需查阅**：遇到 references 未覆盖的边界情况时，再查阅源仓库对应文件
3. **不强制每次克隆**：源仓库较大，每次排盘都克隆会浪费上下文和时间
4. **验证时对照**：若对排盘结果有疑问，对照 heavenlyStems.ts 验证四化、stars.ts 验证亮度
