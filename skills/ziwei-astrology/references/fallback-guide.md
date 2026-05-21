# Skill 独立使用降级策略

> 当用户仅安装 `skills/ziwei-astrology/` 目录（不含 `sources/` 仓库本地副本）时，按以下降级策略运行。

## 检测条件

如果以下路径不存在，则进入降级模式：
- `sources/iztro/`
- `sources/ziwei-doushu/`

## 降级模式规则

### 排盘

排盘仍通过 iztro 代码执行（`npm install iztro` 即可），不受降级影响。

### 断语来源

| 正常模式 | 降级模式 |
|---------|---------|
| 优先查 references/，回源验证 sources/ | 仅依赖 references/ |
| 来源标注 `[来源: iztro/src/data/stars.ts]` | 来源标注 `[来源: references/star-rules.md]` |
| 不确定时查阅 sources/ 原文验证 | 不确定时标注"AI推断"或触发网页搜索 |

### 回源验证

正常模式下 SKILL.md Step 0 要求的回源验证在降级模式下跳过：
- ~~格局判断 → 对照 sources/ziwei-doushu/lib/ziwei/patterns.ts~~ → 直接使用 references/patterns.md
- ~~倪师断语 → 对照 sources/ziwei-doushu/lib/nihai/tianji.ts~~ → 直接使用 references/nihai-quotes.md
- ~~古籍引用 → 对照 sources/ziwei-doushu/lib/classics/data/~~ → 直接使用 references/classics-excerpts.md
- ~~四化数据 → 对照 sources/iztro/src/data/heavenlyStems.ts~~ → 直接使用 references/sihua-rules.md
- ~~亮度数据 → 对照 sources/iztro/src/data/stars.ts~~ → 直接使用 references/star-rules.md

### 网页搜索

降级模式下网页搜索的触发频率会提高，因为 references 的覆盖度不如 sources + references 组合。搜索原则不变：
1. 仓库优先（降级模式下即 references 优先）
2. 搜索结果与 references 冲突时以 references 为准
3. 搜索补充内容标注 `[来源: 网络搜索]`

### 自检清单

降级模式下自检清单第8条"每条断语有来源标注"调整为：
- references 中有对应条目的 → 标注 `[来源: references/xxx.md]`
- 网页搜索补充的 → 标注 `[来源: 网络搜索]`
- 无法追溯的 → 标注"AI推断"

### 质量声明

降级模式生成的报告必须在尾部声明中追加：

```
⚠️ 本报告在降级模式下生成（未加载源仓库本地副本），断语来源为精简参考文档而非原始仓库代码验证。建议安装完整项目以获得更高质量的排盘分析。
```

## 安装完整项目

如需从降级模式升级到完整模式，将 `sources/` 目录复制到与 `skills/` 同级即可：

```
ziwei-astrology-skills/
├── sources/          ← 添加此目录
│   ├── iztro/
│   └── ziwei-doushu/
└── skills/
    └── ziwei-astrology/
```
