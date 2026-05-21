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
- **交互式HTML** — 排盘图可视化、明暗主题、体系切换、三方四正连线
- **快捷指令** — `\money` `\health` `\love` `\career` `\year` `\dash` `\flow` `\month` `\question` `\switch` `\help`

## 依赖仓库

| 仓库 | 用途 | 地址 |
|------|------|------|
| iztro | 排盘算法核心 | https://github.com/SylarLong/iztro |
| ziwei-doushu | 倪海厦《天纪》体系解读知识库 | https://github.com/Renhuai123/ziwei-doushu |

**冲突规则**：两仓库内容有冲突时，以 ziwei-doushu（倪海厦体系）为准。

## 快速开始

安装后，直接对 AI 说：

- "帮我排盘，我是2002年8月25日丑时出生的男生"
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
| `\question` | 随机提问 |
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
├── evals/
│   └── evals.json
├── examples/
│   ├── 命盘详析_1999年9月9日巳时男.md
│   └── 命盘详析_1999年9月9日巳时男.html
├── ziwei-output/                    # 排盘输出目录（与skills同级，不影响技能定义）
│   └── {日期}_{出生信息}/
│       ├── 命盘详析.md / .html
│       ├── {专项解读}.md / .html
│       ├── 大限/第N大限_{年龄}.md / .html
│       ├── 流年/{YYYY}年{干支}.md / .html
│       └── 流月/{YYYY}年{MM}月.md / .html
├── scripts/
│   └── md2html.js
└── skills/
    └── ziwei-astrology/
        ├── SKILL.md
        └── references/
            ├── time-mapping.md
            ├── star-rules.md
            ├── sihua-rules.md
            ├── patterns.md
            ├── palace-interpretation.md
            ├── heming-knowledge.md
            └── report-template.md
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

- [命盘详析_1999年9月9日巳时男.md](./examples/命盘详析_1999年9月9日巳时男.md) — Markdown 完整报告
- [命盘详析_1999年9月9日巳时男.html](./examples/命盘详析_1999年9月9日巳时男.html) — 交互式 HTML 版本

## HTML 转换工具

将命盘详析 Markdown 文件转换为交互式 HTML：

```bash
node scripts/md2html.js <input.md> [output.html]
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
