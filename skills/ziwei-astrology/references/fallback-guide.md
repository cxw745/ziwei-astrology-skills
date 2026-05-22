# Skill 独立使用精简模式指南

> 当用户仅安装 `skills/ziwei-astrology/` 目录（不含 `sources/` 仓库本地副本）时，按以下精简模式运行。精简模式下排盘功能不受影响，仅断语来源的验证深度有所降低。

## 检测条件

如果以下路径不存在，则进入精简模式：
- `sources/iztro/`
- `sources/ziwei-doushu/`

## 精简模式规则

### 排盘（不受影响）

排盘仍通过代码执行，两种方式均可：
1. **推荐**：`node scripts/astro.js "YYYY-M-D" hourIndex gender [outputDir]`（需 iztro 已安装）
2. **备选**：`npm install iztro` 后直接调用 `astro.bySolar()`

排盘准确性在精简模式下与完整模式完全一致。

### 断语来源

| 完整模式 | 精简模式 |
|---------|---------|
| 优先查 references/，回源验证 sources/ | 仅依赖 references/ + index.json |
| 来源标注 `[来源: iztro/src/data/stars.ts]` | 来源标注 `[来源: references/star-rules.md]` |
| 不确定时查阅 sources/ 原文验证 | 不确定时标注"AI推断"或触发网页搜索 |

### 回源验证

完整模式下 SKILL.md Step 0 要求的回源验证在精简模式下跳过：
- ~~格局判断 → 对照 sources/ziwei-doushu/lib/ziwei/patterns.ts~~ → 直接使用 references/patterns.md
- ~~倪师断语 → 对照 sources/ziwei-doushu/lib/nihai/tianji.ts~~ → 直接使用 references/nihai-quotes.md
- ~~古籍引用 → 对照 sources/ziwei-doushu/lib/classics/data/~~ → 直接使用 references/classics-excerpts.md
- ~~四化数据 → 对照 sources/iztro/src/data/heavenlyStems.ts~~ → 直接使用 references/sihua-rules.md
- ~~亮度数据 → 对照 sources/iztro/src/data/stars.ts~~ → 直接使用 references/star-rules.md

### 结构化索引

精简模式下 `references/index.json` 仍可用，提供星曜/宫位/格局/四化的快速索引，提升检索效率。

### 网页搜索

精简模式下网页搜索的触发频率会提高，因为 references 的覆盖度不如 sources + references 组合。搜索原则不变：
1. 仓库优先（精简模式下即 references 优先）
2. 搜索结果与 references 冲突时以 references 为准
3. 搜索补充内容保存到 `references/web-cache/` 避免重复搜索
4. 搜索补充内容标注 `[来源: 网络搜索-缓存]`

### 验证脚本

精简模式下可用的验证脚本：
- `scripts/validate-report.js`：报告结构验证（24项检查）✅ 可用
- `scripts/lint-md.js`：MD格式规范检查 ✅ 可用
- `scripts/verify-astro.js`：排盘准确性校验 ✅ 可用（需 chart-data.json）
- `scripts/md2html.js`：MD转HTML ✅ 可用

### 自检清单

精简模式下自检清单第8条"每条断语有来源标注"调整为：
- references 中有对应条目的 → 标注 `[来源: references/xxx.md]`
- 网页搜索补充的 → 标注 `[来源: 网络搜索-缓存]`
- 无法追溯的 → 标注"AI推断"

### 质量声明

精简模式生成的报告必须在尾部声明中追加：

```
📋 本报告在精简模式下生成（未加载源仓库本地副本），断语来源为精简参考文档而非原始仓库代码验证。排盘数据经过代码验证，准确性不受影响。建议安装完整项目以获得更高质量的排盘分析。
```

## 安装完整项目

如需从精简模式升级到完整模式，将 `sources/` 目录复制到与 `skills/` 同级即可：

```
ziwei-astrology-skills/
├── sources/          ← 添加此目录
│   ├── iztro/
│   └── ziwei-doushu/
│   └── versions.json
└── skills/
    └── ziwei-astrology/
```

或运行更新脚本获取最新源仓库：
```bash
bash scripts/update-sources.sh
```
