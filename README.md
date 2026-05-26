# ziwei-astrology-skills

紫微斗数排盘与命盘详析 AI Skill —— 融合 [iztro](https://github.com/SylarLong/iztro) 排盘引擎与 [ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) 倪海厦《天纪》知识库，支持三模式解读切换和快捷指令。

## 功能

- **单人排盘解读** — 输入出生日期、时辰、性别，自动排出完整紫微斗数命盘并详析
- **合盘分析** — 双人命盘比对，婚姻/事业合作匹配度评级（五星制）
- **流年专项解读** — 特定年份运势深度分析（事业/财运/感情/健康）
- **择日择时** — 结婚、搬家、开业等吉日推荐
- **继续提问** — 首次输出完整报告后，可基于已排命盘深入追问
- **三模式解读** — iztro标准 / 倪海厦天纪 / 综合模式（默认），冲突以倪师为准
- **双层输出** — 专业解读（术语严谨）+ 通俗解析（轻松易懂）
- **飞星分析** — 宫干四化、自化检测、飞化链追踪（最多4层）、三方四正飞化汇总
- **格局判断** — 46种吉凶格局自动识别（上格/中格/助力格/恶格/基础格/补充格），含评分机制
- **运限完整链路** — 大限→小限→流年→流月→流日→流时，每层四化与流耀星
- **神煞系统** — 长生12神、博士12神、岁前12神、将前12神
- **星曜亮度** — 十四主星12宫亮度表（庙旺/平/陷）
- **真太阳时** — 基于出生地经度的真太阳时校正，显式时区支持
- **验前事校验** — 排盘后推导可证伪断语，校准命盘可信度（灵感来源：vedic-astro-skills）
- **盲审原则** — 分析阶段只看排盘数据，禁止反向推导和确认偏误（灵感来源：vedic-astro-skills）
- **大限硬约束** — 可计算判定条件+禁止美化凶象+格局激活验证（灵感来源：vedic-astro-skills）
- **写作质量铁律** — 禁止错误归因/绝对论断/滥用句式，审查制逐条检查
- **交互式HTML** — 排盘图可视化、明暗主题、体系切换、三方四正连线
- **快捷指令** — `\money` `\health` `\love` `\career` `\year` `\dash` `\flow` `\month` `\question` `\deep` `\switch` `\help`

## 依赖仓库

| 仓库 | 用途 | 地址 | 本地路径 |
|------|------|------|---------|
| iztro | 排盘算法核心 | https://github.com/SylarLong/iztro | `sources/iztro/` |
| ziwei-doushu | 倪海厦《天纪》体系解读知识库 | https://github.com/Renhuai123/ziwei-doushu | `sources/ziwei-doushu/` |

**冲突规则**：两仓库内容有冲突时，以 ziwei-doushu（倪海厦体系）为准。

**来源标注**：生成报告时，每条事实性内容均标注来源文件（如 `[来源: iztro/src/data/stars.ts]`），确保可追溯、不虚构。标注在 Markdown 源文件中可见，HTML 中自动隐藏。

## 快速开始

安装后，直接对 AI 说：

- "帮我排盘，我是1990年6月15日酉时出生的女生"
- "帮我看看命盘，1990年6月15日酉时女"
- "我和我对象合不合？我是XXX，她是XXX"
- "2026年我事业运怎么样？"
- "我打算明年结婚，哪个月比较好？"
- "帮我看看命"

排盘完成后可使用快捷指令深入探索：

**专项解读**

| 指令 | 功能 |
|------|------|
| `\money` | 财运详解 |
| `\health` | 健康详解 |
| `\love` | 感情详解 |
| `\career` | 事业详解 |
| `\year` | 流年运势 |

**时运选择**

| 指令 | 功能 |
|------|------|
| `\dash` | 大限选择（列出所有大限，选择后详解） |
| `\dash N` | 直接查看第N大限详解 |
| `\flow` | 流年选择（列出流年，选择后详解） |
| `\flow YYYY` | 直接查看指定年份详解 |
| `\month` | 流月选择（列出12月，选择后详解） |
| `\month YYYY-MM` | 直接查看指定月份详解 |

**辅助工具**

| 指令 | 功能 |
|------|------|
| `\question` | 随机提问（无上下文，5段格式） |
| `\deep` | 深度内省（8大话题自选，三大专业体系融合） |
| `\switch` | 切换体系 |
| `\help` | 查看帮助 |

## 安装

### Claude Code

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/cxw745/ziwei-astrology-skills.git /tmp/ziwei-skill
cp -r /tmp/ziwei-skill/skills/ziwei-astrology ~/.claude/skills/ziwei-astrology
```

### Trae

```bash
mkdir -p .trae/skills
git clone https://github.com/cxw745/ziwei-astrology-skills.git /tmp/ziwei-skill
cp -r /tmp/ziwei-skill/skills/ziwei-astrology .trae/skills/ziwei-astrology
```

### Cursor

```bash
mkdir -p .cursor/skills
git clone https://github.com/cxw745/ziwei-astrology-skills.git /tmp/ziwei-skill
cp -r /tmp/ziwei-skill/skills/ziwei-astrology .cursor/skills/ziwei-astrology
```

### Codex (OpenAI)

```bash
mkdir -p .codex/skills
git clone https://github.com/cxw745/ziwei-astrology-skills.git /tmp/ziwei-skill
cp -r /tmp/ziwei-skill/skills/ziwei-astrology .codex/skills/ziwei-astrology
```

### 通用方式

将 `skills/ziwei-astrology/` 目录复制到你所用 AI 工具的 skills 目录下即可。核心文件是 `SKILL.md`，AI 工具会自动识别 frontmatter 中的 `name` 和 `description` 来决定何时触发。

## 目录结构

```
ziwei-astrology-skills/
├── README.md
├── LICENSE
├── PROJECT_CONTEXT.md
├── evals/                           # 开发者评测用例（非Skill运行时部分）
│   └── evals.json
├── sources/                         # 源仓库本地副本（事实索引数据库）
│   ├── iztro/                       # iztro 排盘引擎源码
│   └── ziwei-doushu/                # 倪海厦知识库源码
├── ziwei-output/                    # 排盘输出目录（与skills同级）
│   └── {日期时分}_{出生信息}/
└── skills/
    └── ziwei-astrology/
        ├── SKILL.md                  # 核心指令文件
        ├── scripts/
        │   ├── md2html.js            # MD转HTML脚本（模块化薄编排层）
        │   ├── validate-report.js    # 报告结构验证脚本（24项检查）
        │   ├── validate-and-fix.js   # 验证反馈闭环脚本（整合3个验证+修正建议）
        │   ├── section-validator.js  # 章节级验证器（10种章节类型）
        │   ├── generate-section.js   # 分段生成辅助器（数据切片+模板片段）
        │   ├── preview.js            # 本地预览服务器（支持--watch自动刷新）
        │   └── lib/                  # 模块化拆分
        │       ├── parser.js         # Markdown解析
        │       ├── chart.js          # 排盘图渲染
        │       ├── styles.js         # CSS样式（明暗主题+排盘图+响应式+打印）
        │       ├── interaction.js    # 客户端交互JS（体系切换+拖拽缩放等）
        │       └── toc.js            # 目录生成
        ├── examples/
        │   ├── 命盘详析_1999年9月9日巳时男.md
        │   └── 命盘详析_1999年9月9日巳时男.html
        └── references/
            ├── time-mapping.md
            ├── star-rules.md
            ├── sihua-rules.md
            ├── patterns.md
            ├── palace-interpretation.md
            ├── heming-knowledge.md
            ├── nihai-quotes.md
            ├── nihai-medicine.md      # 倪师健康断语
            ├── fallback-guide.md     # 独立使用降级策略
            ├── validation-protocol.md # 验前事校验协议
            ├── period-constraints.md  # 大限/流年硬约束规则
            ├── star-constraints.md    # 星曜联合判定约束
            ├── qa-rules.md           # Q&A正反双审规则
            ├── classics-excerpts.md
            ├── star-palace-matrix.md
            ├── report-template.md
            ├── shortcuts.md
            └── source-repos.md
```

## 三模式解读

| 模式 | 数据来源 | 亮度分级 | 大限四化 | 说明 |
|------|---------|---------|---------|------|
| [iztro] | 严格基于iztro数据 | 七级 | 使用 | 纯数据，不做主观断语 |
| [倪师] | 倪师知识库 | 三级（庙旺/平/陷） | 不使用 | 倪海厦《天纪》体系 |
| 综合（默认） | 两体系综合 | 双标注 | 标注差异 | 冲突以倪师为准 |

HTML界面中可通过工具栏按钮或键盘快捷键（1/2/3）实时切换，正文内容随体系变化。

**亮度映射规则**（iztro七级 → 倪师三级）：

| iztro | 倪师 |
|-------|------|
| 庙、旺 | 庙旺 |
| 得、利、平 | 平 |
| 不、陷 | 陷 |

## 倪海厦体系核心立场

本 Skill 严格遵循倪海厦《天纪》体系，与飞星派有以下关键差异：

| 项目 | 倪师体系 | 飞星派 |
|------|---------|--------|
| 大限四化 | 不使用（"四化星永远固定不动"） | 使用大限宫干四化 |
| 宫干自化 | 不主张 | 常用 |
| 亮度分级 | 三级（庙旺/平/陷） | 七级（庙旺得利平不陷） |
| 格局判断 | 三层结构（必须/加分/破格） | 无统一标准 |
| 婚姻判断 | 必须同时看夫妻宫+福德宫 | 主要看夫妻宫 |

## 示例输出

- [命盘详析_1999年9月9日巳时男.md](./skills/ziwei-astrology/examples/命盘详析_1999年9月9日巳时男.md) — Markdown 完整报告
- [命盘详析_1999年9月9日巳时男.html](./skills/ziwei-astrology/examples/命盘详析_1999年9月9日巳时男.html) — 交互式 HTML 版本

## HTML 转换工具

将命盘详析 Markdown 文件转换为交互式 HTML：

```bash
node skills/ziwei-astrology/scripts/md2html.js <input.md> [output.html]
```

HTML 特性：
- 明亮/黑暗双主题切换（自动记忆偏好，快捷键 T）
- 侧边栏目录导航（自动高亮当前章节）
- 四化标签彩色标注（化禄绿/化权橙/化科蓝/化忌红）
- 星耀亮度彩色标签（庙旺绿/平橙/陷红）
- 交互式排盘图（12宫格、三方四正SVG连线、可拖拽/缩放、悬停详情+四化徽章）
- 三体系切换（iztro/倪师/综合，快捷键 1/2/3，正文内容实时变化）
- 快捷指令帮助面板（快捷键 ?）
- 章节折叠（状态保存）
- 渐变色阅读进度条
- 响应式布局（移动端自动折叠侧边栏）
- 打印友好样式
- 键盘快捷键（T/1/2/3/?/Esc）
- 报告结构自动验证（`node scripts/validate-report.js <report.md>`，24项检查）
- 验证反馈闭环（`node scripts/validate-and-fix.js <chart-data.json> <report.md> --json`，整合3个验证+修正建议）
- 章节级验证（`node scripts/section-validator.js <section-type> <content>`，10种章节类型）
- 分段生成辅助（`node scripts/generate-section.js <chart-data.json> <section-type>`，数据切片+模板片段）
- 本地预览服务器（`node scripts/preview.js [--watch]`，支持文件监听自动刷新）
- 模块化架构（parser/chart/styles/interaction/toc五个模块，便于维护）

## 输出文件

排盘结果自动保存到 `ziwei-output/` 目录（与 skills 同级，不影响技能定义文件），按日期和出生信息分类：

```
ziwei-output/
├── 2026-05-21_1999年9月9日巳时男/
│   ├── 命盘详析.md
│   ├── 命盘详析.html
│   ├── 财运详解.md
│   ├── 财运详解.html
│   ├── 大限/
│   │   ├── 第3大限_22~31岁.md
│   │   └── 第3大限_22~31岁.html
│   ├── 流年/
│   │   ├── 2026年丙午.md
│   │   └── 2026年丙午.html
│   └── 流月/
│       ├── 2026年05月.md
│       └── 2026年05月.html
└── ...
```

## 许可证

MIT License

## 致谢

- [iztro](https://github.com/SylarLong/iztro) — 紫微斗数排盘引擎
- [ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) — 倪海厦《天纪》体系知识库
- 倪海厦老师 — 《天纪》紫微斗数讲义
- [vedic-astro-skills](https://github.com/CNWU16/vedic-astro-skills) — 验前事校验、盲审原则、大限硬约束、星曜联合判定、Q&A双审等分析严谨性机制的灵感来源
