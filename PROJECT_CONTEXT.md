# 紫微斗数 AI Skill 项目文档

> 本文档供新 AI 快速了解项目背景、当前进度和文件结构。

---

## 一、项目概述

基于 [iztro](https://github.com/SylarLong/iztro) 排盘引擎和 [ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) 倪海厦《天纪》体系知识库，构建一个紫微斗数排盘与命盘详析 AI Skill，让没有仓库背景的 AI 也能给出专业详细的命理解读。

**目标仓库**：`https://github.com/cxw745/ziwei-astrology-skills`

---

## 二、核心设计决策

| 决策项 | 结论 | 原因 |
|--------|------|------|
| 解读体系 | 三模式解读（默认综合模式） | iztro数据+倪师知识库双体系，冲突以倪师为准 |
| 冲突规则 | 以 ziwei-doushu 为准 | 倪师体系有明确师承立场 |
| 大限四化 | 不使用 | 倪师原话"四化星永远固定不动" |
| 宫干自化 | 不主张 | 倪师体系与飞星派的核心差异 |
| 亮度分级 | 三级制（庙旺/平/陷） | 倪师体系简化，iztro 七级映射到三级 |
| 亮度映射 | 庙旺→庙旺，得利平→平，不陷→陷 | iztro七级到倪师三级的映射规则 |
| 输出风格 | 双层：专业解读+通俗解析 | 覆盖零基础到专业用户 |
| 功能模块 | 5个：单人排盘/合盘（婚配）/友情合盘/流年/择日 | 用户需求全覆盖 |
| Skill规范 | 遵循 Anthropic skill-creator 方法论 | SKILL.md<500行，渐进式披露references |
| 盲审原则 | 8条，分析阶段只看排盘数据 | 灵感来源：vedic-astro-skills blind-audit，对抗确认偏误和圆场本能 |
| 验前事校验 | Step 2.5，排盘后报告前的可信度守门员 | 灵感来源：vedic-astro-skills past-validation |
| 大限硬约束 | 可计算判定条件+5条禁止推导错误 | 灵感来源：vedic-astro-skills Dasha hard-constraint |
| 星曜联合判定 | 信号分诊+冲突仲裁4规则 | 灵感来源：vedic-astro-skills PAC联合判定 |
| Q&A双审 | 判断性问题正反双审 | 灵感来源：vedic-astro-skills dual-review Q&A |
| 写作质量铁律 | 禁止错误归因/绝对论断/滥用"不是…而是…" | 审查制逐条检查，不恰当的改写为直接表述 |
| 输出隔离 | ziwei-output/只写，.md/.html禁止回读分析 | 防止旧报告锚定新分析 |
| \question | 随机提问，5段格式，无上下文 | 固化格式防止不同AI表现不一致 |
| \deep | 苏格拉底式引导内省，三大专业体系融合 | MI OARS+叙事治疗外化+苏格拉底6方向 |
| 反推时辰 | 独立 skill，与排盘分析物理隔离 | 盲审原则隔离：反推过程允许反向验证，但信息不带入排盘分析 |

---

## 三、功能模块

### 模块A：单人排盘解读（默认触发）
- 输入：出生日期+时辰+性别
- 输出：完整十一章节命盘报告（MD+HTML双格式）

### 模块B：合盘分析（婚配）
- 输入：两人出生信息
- 输出：合盘五步法分析+五星匹配度评级
- 核心：倪师"看婚姻必须同时看福德宫"

### 模块B2：友情合盘
- 输入：两人出生信息
- 输出：友情六步法分析+友情五星评级
- 核心：对方命宫落入法+兄弟宫仆役宫互参
- 与婚配合盘宫位侧重完全不同

### 模块C：流年专项解读
- 输入：出生信息+特定年份
- 输出：流年四化+宫位交互+主题解读

### 模块D：择日择时
- 输入：出生信息+事件类型+目标时段
- 输出：推荐吉日+选择理由+局限性说明

### 继续提问功能
- 首次输出完整报告后，用户可基于已排命盘深入追问
- 回溯命盘数据不重新排盘

### 排盘可视化
- HTML输出中包含交互式排盘图
- 可拖拽、可缩放、可关闭
- 鼠标悬停显示宫位详情
- 四化彩色标注
- 三方四正SVG连线

---

## 四、解读体系（三模式）

| 模式 | 名称 | 数据来源 | 亮度分级 | 大限四化 | 说明 |
|------|------|---------|---------|---------|------|
| 模式一 | [iztro] | 严格基于iztro排盘数据 | 七级亮度 | 使用 | 原始数据，不做体系转换 |
| 模式二 | [倪师] | 基于倪师知识库 | 三级亮度（庙旺/平/陷） | 不使用 | 倪海厦《天纪》体系 |
| 模式三 | 综合（默认） | 两体系综合 | 双标注 | 标注差异 | 冲突以倪师为准 |

- 默认使用模式三（综合模式）
- 用户可通过指定模式名切换解读体系
- HTML界面中可通过工具栏按钮实时切换，正文内容随体系变化
- iztro七级亮度映射到三级：庙旺→庙旺、得利平→平、不陷→陷

---

## 五、当前文件结构

```
ziwei-astrology-skills/
├── README.md
├── LICENSE                            # MIT License
├── CLAUDE.md                          # Claude Code 项目指引（确保CC能发现和触发skill）
├── PROJECT_CONTEXT.md                 # 本文档
├── package.json                       # 项目依赖与脚本命令
├── scripts/
│   ├── sync-skills.sh                 # 同步skills到.trae目录
│   └── update-sources.sh             # 更新源仓库到最新版本
├── evals/
│   └── evals.json                     # 开发者评测用例（非Skill运行时部分）
├── sources/                           # 源仓库本地副本（事实索引数据库）
│   ├── iztro/                         # iztro 排盘引擎源码（~7300行）
│   ├── ziwei-doushu/                  # 倪海厦知识库源码（~12900行）
│   └── versions.json                  # 源仓库版本追踪
├── ziwei-output/                     # 排盘输出目录（与skills同级）
│   └── {日期时分}_{出生信息}/
│       ├── chart-data.json            # 排盘结果持久化
│       ├── 命盘详析.md / .html
│       └── {专项解读}.md / .html
└── skills/
    ├── ziwei-astrology/
    │   ├── SKILL.md                   # 核心指令文件（含铁律速查卡+内嵌检查点+来源标注+知识准备+网页搜索策略+降级方案）
    │   ├── scripts/
    │   │   ├── astro.js              # 排盘脚本（封装iztro bySolar）
    │   │   ├── md2html.js             # MD转HTML脚本（模块化薄编排层，~420行）
    │   │   ├── validate-report.js     # 报告结构验证脚本（24项检查）
    │   │   ├── validate-html.js       # HTML完整性验证脚本
    │   │   ├── verify-astro.js        # 排盘准确性校验脚本
    │   │   ├── lint-md.js             # MD格式规范检查脚本（10项检查）
    │   │   ├── validate-and-fix.js    # 验证反馈闭环脚本（整合3个验证+修正建议）
    │   │   ├── section-validator.js   # 章节级验证器（10种章节类型）
    │   │   ├── generate-section.js    # 分段生成辅助器（数据切片+模板片段）
    │   │   ├── preview.js             # 本地预览服务器（支持--watch自动刷新）
    │   │   ├── run-evals.js           # 自动化评测脚本
    │   │   └── lib/                   # md2html模块化拆分
    │   │       ├── parser.js          # Markdown解析逻辑
    │   │       ├── chart.js           # 排盘图渲染逻辑
    │   │       ├── styles.js          # CSS样式定义（含明暗主题+排盘图+响应式+打印）
    │   │       ├── interaction.js     # 客户端交互JS（排盘图渲染+体系切换+拖拽缩放等）
    │   │       └── toc.js             # 目录生成逻辑
    │   ├── examples/
    │   │   ├── 命盘详析_1999年9月9日巳时男.md
    │   │   └── 命盘详析_1999年9月9日巳时男.html
    │   └── references/                # 渐进式披露参考文档（18个+索引+缓存）
    │       ├── index.json             # 结构化索引（14主星×12宫×46格局×十天干四化）
    │       ├── time-mapping.md
    │       ├── star-rules.md
    │       ├── sihua-rules.md
    │       ├── patterns.md            # 格局识别规则（46个格局）
    │       ├── palace-interpretation.md
    │       ├── heming-knowledge.md
    │       ├── nihai-quotes.md        # 倪师天纪断语（三维结构：星曜×宫位×四化）
    │       ├── classics-excerpts.md   # 古典完整原文（骨髓赋/全集/全书）
    │       ├── star-palace-matrix.md  # 14主星×12宫深度断语（含庙旺/四化/煞星三维）
    │       ├── nihai-medicine.md      # 倪师人纪地纪健康断语（疾厄宫联动）
    │       ├── fallback-guide.md      # Skill独立使用精简模式指南
    │       ├── validation-protocol.md # 验前事校验协议（灵感来源：vedic-astro-skills）
    │       ├── period-constraints.md  # 大限/流年硬约束规则（灵感来源：vedic-astro-skills）
    │       ├── star-constraints.md    # 星曜联合判定约束（灵感来源：vedic-astro-skills）
    │       ├── qa-rules.md            # Q&A正反双审规则（灵感来源：vedic-astro-skills）
    │       ├── report-template.md     # 含24项自检清单+分级制
    │       ├── shortcuts.md
    │       ├── source-repos.md        # 源仓库本地文件索引+引用标注格式
    │       └── web-cache/             # 网页搜索缓存目录
    └── time-calibration/              # 反推时辰独立 skill（与排盘分析物理隔离）
        ├── SKILL.md                   # 反推时辰核心指令（4轮渐进对话+事件验证）
        ├── package.json               # 独立依赖（iztro）
        ├── scripts/
        │   └── astro.js              # 排盘脚本（独立副本）
        └── references/
            ├── calibration-protocol.md  # 反推时辰完整协议
            ├── event-palace-mapping.md  # 事件类型与宫位映射（5领域详细提问）
            ├── comparison-strategy.md   # 多时辰对比策略（14主星多角度描述表）
            └── time-mapping.md         # 时辰映射表
```

---

## 六、SKILL.md 关键结构

按 Anthropic skill-creator 方法论设计：

1. **Frontmatter**：name + description（20+触发关键词，防undertrigger）
2. **核心原则**：6条，含"实事求是，拒绝讨好"
3. **铁律速查卡**：8条最高频违反铁律（含写作质量3条），每个Step前强制回顾
3. **星耀处理规范**：空宫处理规范（借星规则、minorStars归属）
4. **输出风格**：三模式（iztro/倪师/综合）+双层（专业+通俗），含完整示例
5. **文件优先输出**：所有完整内容写入文件，对话中只输出摘要+文件路径。Q&A超过20行追加写入问答记录.md
6. **输出隔离**：ziwei-output/是只写目录，.md/.html禁止回读用于分析，只读chart-data.json
7. **功能模块**：4个模块+排盘可视化，每个含输入示例
8. **工作流**：Step 0（知识准备+按需回源验证）→ Step 1（收集输入）→ Step 2（排盘）→ Step 2.5（验前事校验）→ Step 3（格局识别）→ Step 4（生成报告MD+HTML）→ Step 5（继续提问，正反双审）→ Step 6（全面核查+自检清单+验证反馈闭环）
9. **参考索引**：18个references按需加载+8个脚本工具
10. **常见陷阱**：25条+正反对比示例，含内容丰富度分级制要求（重点宫7子节/普通宫5子节/轻量宫3子节、宫干飞四化48条、内容以示例为标准、差异化指引防公式化）
11. **知识补充**：网页搜索策略（仓库优先、冲突以仓库为准）、排盘失败降级方案、来源标注决策树

---

## 七、HTML 转换脚本特性

`scripts/md2html.js` — 纯 Node.js 实现，无外部依赖，模块化架构（主文件~420行 + lib/模块）：

- **lib/styles.js**（~2066行）：完整CSS样式（明暗主题+排盘图+响应式+打印）
- **lib/interaction.js**（~1004行）：客户端交互JS（排盘图渲染+三方四正SVG连线+体系切换+拖拽缩放）
- **lib/parser.js**（~287行）：Markdown→HTML转换逻辑
- **lib/chart.js**（~198行）：排盘图数据提取和SVG渲染
- **lib/toc.js**（~42行）：目录生成

功能特性：
- 明亮/黑暗双主题切换（localStorage记忆偏好）
- 侧边栏目录导航（IntersectionObserver自动高亮）
- 四化标签彩色标注（化禄绿/化权橙/化科蓝/化忌红）
- 星耀亮度彩色标签（庙旺绿/平橙/陷红）
- 三体系切换（iztro/倪师/综合，正文内容实时变化）
- 交互式排盘图（12宫格、三方四正SVG连线、可拖拽/缩放、悬停详情+四化徽章）
- 快捷指令帮助面板（❓按钮或键盘 ? 触发）
- 键盘快捷键（T切换主题、1/2/3切换体系、?帮助、Esc关闭弹窗）
- 章节折叠（状态保存）
- 渐变色阅读进度条
- 响应式布局（移动端折叠侧边栏+浮动目录按钮+底部目录抽屉）
- 打印友好样式

用法：`node scripts/md2html.js <input.md> [output.html]`

验证工具链：
- 报告结构验证：`node scripts/validate-report.js <report.md>`（24项检查）
- 排盘准确性校验：`node scripts/verify-astro.js <chart-data.json> <report.md>`（7项校验）
- MD格式检查：`node scripts/lint-md.js <report.md>`（10项检查）
- 验证反馈闭环：`node scripts/validate-and-fix.js <chart-data.json> <report.md> [--json]`（整合3个验证+修正建议）
- 章节级验证：`node scripts/section-validator.js <section-type> <content>`（10种章节类型）
- 分段生成辅助：`node scripts/generate-section.js <chart-data.json> <section-type>`（数据切片+模板片段）
- 本地预览：`node scripts/preview.js [--port PORT] [--file PATH] [--watch]`

---

## 八、倪海厦体系与飞星派关键差异

| 项目 | 倪师体系 | 飞星派 |
|------|---------|--------|
| 大限四化 | 不使用 | 使用 |
| 宫干自化 | 不主张 | 常用 |
| 亮度分级 | 三级 | 七级 |
| 格局判断 | 三层结构（必须/加分/破格） | 无统一标准 |
| 婚姻判断 | 必须同时看夫妻宫+福德宫 | 主要看夫妻宫 |

---

## 九、排盘算法核心

使用 iztro 的 `bySolar` 方法：

```typescript
import { astro } from 'iztro';
const result = astro.bySolar('YYYY-M-D', hourIndex, gender, true, 'zh-CN');
```

- hourIndex：0=早子时, 1=丑时, ..., 11=亥时, 12=晚子时
- gender：'male' 或 'female'（或男/女汉字）
- fixLeap：true（闰月15日前算当月，之后算下月）

---

## 十、输出前核查步骤

每次生成报告前，必须逐项核查以下8项，并填写 report-template.md 中的16项自检清单：

1. **星耀位置**：所有主星/辅星宫位与iztro排盘数据一致
2. **四化**：化禄/化权/化科/化忌所落宫位与天干对应正确
3. **格局条件**：成格/破格判断严格对照patterns.md规则，不凑格局
4. **断语来源**：每条断语可追溯至references文件，不凭空编造
5. **空宫处理**：空宫借对宫主星，明确标注"借星"
6. **身宫叠加**：身宫所落宫位正确，叠加解读逻辑清晰
7. **来因宫**：来因宫位置与年干对应正确
8. **客观性**：凶象如实描述，不回避化忌，不强行凑格局

---

## 十一、已完成事项

- [x] 全面理解 iztro 和 ziwei-doushu 两个仓库
- [x] 编写 SKILL.md 核心指令文件（按skill-creator方法论）
- [x] 编写 9 个 references 参考文件
- [x] 扩展 patterns.md（13格局→46格局，完整覆盖 patterns.ts）
- [x] 新增 nihai-quotes.md（倪师天纪断语：各宫位/四化/面相/堪舆/课程要点）
- [x] 新增 classics-excerpts.md（骨髓赋等古籍关键段落摘录）
- [x] 新增 star-palace-matrix.md（14主星×12宫速查表）
- [x] SKILL.md 增加 Step 0（知识准备+按需回源验证）
- [x] SKILL.md 增加网页搜索补充策略（仓库优先、冲突以仓库为准）
- [x] SKILL.md 增加排盘失败降级方案
- [x] SKILL.md 增加来源标注决策树（5种来源的标注规则）
- [x] report-template.md 增加16项结构化自检清单
- [x] report-template.md 将"1000行以上"改为"内容丰富度以示例为标准"
- [x] source-repos.md 更新索引（反映新增3个 references）
- [x] SKILL.md 参考文件索引更新（9→12个 references）
- [x] 编写 README.md（支持 Claude Code/Trae/Cursor/Codex 安装）
- [x] 创建 MIT LICENSE
- [x] 创建 evals 测试用例（6个场景）
- [x] 创建 MD 转 HTML 脚本（明暗主题/侧边导航/四化彩色标注）
- [x] 三模式解读切换（iztro/倪师/综合）
- [x] 排盘可视化组件（交互式排盘图，可拖拽/缩放/悬停详情/三方四正SVG连线）
- [x] 输出前核查步骤（8项核查清单）
- [x] 反讨好原则（凶象如实描述，不回避化忌，不强行凑格局）
- [x] 1999年巳时男命盘详析（MD+HTML双格式）
- [x] md2html.js全面重写（Notion风格+排盘可视化+体系切换）
- [x] references校对与ziwei-doushu仓库对齐
- [x] 空宫处理规范（借星规则、minorStars归属）
- [x] 婚期判断三层法（本命格局→大限→流年）
- [x] 体系切换操作说明（HTML界面+文本交互）
- [x] 亮度映射修正（得→平，非庙旺）
- [x] 紫府同宫格修正（限申宫）
- [x] 快捷指令体系（\money \health \love \career \year \dash \flow \month \question \deep \match \friend \switch \help）
- [x] 输出文件夹规范（ziwei-output/{日期时分}_{出生信息}/分类存放，含大限/流年/流月子目录，时间戳精确到分钟避免覆盖）
- [x] 完成后提示语模板（含文件位置和快捷指令说明）
- [x] 大限/流年/流月选择指引（\dash \flow \month，从出生到终老完整列表）
- [x] 专项解读模板（财运/健康/感情/事业/大限/流年/流月，含HTML双格式输出）
- [x] HTML交互优化（快捷指令帮助面板、键盘快捷键、渐变进度条、四化徽章、暗色主题对比度）
- [x] report-template.md完全重写（匹配示例的完整11章结构，763行，含7子节宫位模板/宫干飞四化总表/命宫总论/四化飞化详析/附录）
- [x] SKILL.md增加内容丰富度硬性要求（12宫×7子节、宫干飞四化48条、1000行以上、倪师断语必须引用）
- [x] HTML移动端顶栏重叠修复（mode-btn-group脱离fixed定位、480px极窄屏适配）
- [x] 源仓库本地化（sources/iztro + sources/ziwei-doushu，作为事实索引数据库）
- [x] 来源标注体系（[来源: 仓库名/文件路径] 格式，MD可见/HTML隐藏）
- [x] source-repos.md重写为本地文件索引（含引用标注格式规范）
- [x] SKILL.md增加来源标注核心原则和常见陷阱
- [x] report-template.md增加来源标注规范和示例
- [x] md2html.js增加source-ref隐藏处理
- [x] 推送到 GitHub 远程仓库
- [x] 知识库深度扩充：classics-excerpts.md补全骨髓赋/全集/全书完整原文
- [x] 知识库深度扩充：nihai-quotes.md从120行扩充至827行（三维结构：星曜×宫位×四化）
- [x] 知识库深度扩充：star-palace-matrix.md从一句话断语扩充为三维深度断语（庙旺/四化/煞星）
- [x] 新增nihai-medicine.md（倪师人纪地纪健康断语，疾厄宫联动）
- [x] 新增fallback-guide.md（Skill独立使用降级策略）
- [x] SKILL.md增加正反对比示例（讨好倾向vs实事求是、格局判断vs凑格局、来源标注vs虚构来源、体系混用vs体系标注）
- [x] SKILL.md增加时辰模糊处理策略（相邻时辰对比）
- [x] SKILL.md细化网页搜索策略（推荐站点、关键词模板、可信度排序）
- [x] report-template.md改为分级制（重点宫/普通宫/轻量宫三级展开深度）
- [x] md2html.js模块化拆分（parser/chart/theme/toc四个模块）
- [x] 新增validate-report.js自动化验证脚本（16项自检清单自动检查）
- [x] SKILL.md参考文件索引更新（12→14个references）

### v3.0.0 新增（反推时辰独立 skill）

- [x] 新增 `skills/time-calibration/` 独立 skill（与 ziwei-astrology 物理隔离）
- [x] 4轮渐进式对话：基础信息+行为问卷 → 排盘对比 → 深度事件验证 → 结论+盘外验证
- [x] 事件验证是唯一可靠的排除依据，性格自述不可用于排除
- [x] 所有候选时辰必须全程参与评分，不跳过
- [x] 行为模式问卷问小时候（12岁前），更接近天命本底
- [x] 性格描述多角度+区分天命本底与大限影响
- [x] 矛盾权重(-2)高于弱匹配(+1)
- [x] 去掉身体特征（主观性太强不可靠）
- [x] 5领域详细事件提问（感情/事业/家庭/健康/社交）
- [x] 14主星多角度描述参考表（做事风格/社交方式/情绪特点/正面/踩坑）
- [x] ziwei-astrology/validation-protocol.md 时辰校准流程指向独立 skill
- [x] PROJECT_CONTEXT.md / CLAUDE.md / README.md / CHANGELOG.md 同步更新

### v2.2.0 新增

- [x] `\match` 合盘分析快捷指令（基于倪师合盘五步法）
- [x] 合盘报告模板（report-template.md，10章节完整结构）
- [x] 合盘详细指引（shortcuts.md）
- [x] SKILL.md 合盘功能模块说明
- [x] 移动端浮动目录按钮（mobile-toc-fab）+ 底部目录抽屉（mobile-toc-drawer）
- [x] 手机端HTML目录不可见问题修复
- [x] md2html.js 帮助面板新增 `\match` 指令
- [x] 完成后提示语模板更新（含 `\match`）

### v2.3.0 新增（验证闭环优化）

- [x] 排盘脚本封装 scripts/astro.js（封装iztro bySolar，命令行输出JSON+持久化）
- [x] 排盘结果持久化 chart-data.json（快捷指令复用排盘数据，无需重新排盘）
- [x] 结构化索引 references/index.json（14主星×12宫×46格局×十天干四化完整索引）
- [x] 排盘准确性校验 scripts/verify-astro.js（7项数据级校验：星曜/四化/空宫/身宫/来因宫/五行局/命宫）
- [x] 增强 validate-report.js（16项→24项检查：子节完整性/飞四化48条/来源标注密度/倪师断语/行数/讨好倾向扩展/附录）
- [x] MD格式规范检查 scripts/lint-md.js（10项检查：标题层级/表格/章节/空行/列表/引用/HTML残留/四化标记/来源标注/多余空行）
- [x] 自动化评测 scripts/run-evals.js（6个eval用例自动检查）
- [x] 网页搜索缓存机制 references/web-cache/（避免重复搜索）
- [x] 知识库版本追踪 sources/versions.json + scripts/update-sources.sh
- [x] Skill独立使用优化：降级模式→精简模式（排盘不受影响，验证脚本可用）
- [x] 同步脚本 scripts/sync-skills.sh（.trae目录版本同步）
- [x] package.json脚本命令（astro/md2html/validate/lint/eval/sync/update）
- [x] SKILL.md更新：排盘持久化、12步核查流程、搜索缓存、参考文件索引扩充
- [x] PROJECT_CONTEXT.md文件结构更新

### v2.4.0 新增（分析严谨性优化 — 灵感来源：vedic-astro-skills）

- [x] 验前事校验机制 references/validation-protocol.md（排盘后报告前的可信度守门员）
- [x] 大限/流年硬约束规则 references/period-constraints.md（可计算判定+5条禁止推导错误+格局激活验证）
- [x] 星曜联合判定约束 references/star-constraints.md（信号分诊+冲突仲裁4规则+禁止折衷表述）
- [x] Q&A正反双审规则 references/qa-rules.md（判断性问题双审+数据源优先级）
- [x] 盲审原则8条（SKILL.md核心原则新增，对抗确认偏误和圆场本能）
- [x] Step 2.5 验前事校验（SKILL.md工作流新增）
- [x] 数据隔离声明（SKILL.md工作流新增，分析阶段只看排盘数据）
- [x] 常见陷阱新增6条（反向推导/信号冲突取平均/大限凶象美化/验前事辩解/Q&A只列单边/格局未验证激活）
- [x] CHANGELOG.md / PROJECT_CONTEXT.md / README.md 同步更新

### v2.5.0 新增（工程化优化与验证闭环）

- [x] md2html.js模块化重构：3955行→420行薄编排层，拆出lib/styles.js(2066行)+lib/interaction.js(1004行)
- [x] 删除空壳lib/theme.js，功能由lib/styles.js替代
- [x] SKILL.md增加铁律速查卡（5条最高频违反铁律，每个Step前强制回顾）
- [x] SKILL.md增加内嵌检查点（Step 1~5每个Step前增加🔍检查点提示）
- [x] SKILL.md Step 6脚本验证从4项扩展为6项（新增validate-and-fix.js+section-validator.js）
- [x] 验证反馈闭环脚本 validate-and-fix.js（整合3个验证+结构化JSON修正建议）
- [x] 章节级验证器 section-validator.js（10种章节类型，输出fixSuggestions）
- [x] 分段生成辅助器 generate-section.js（数据切片+模板片段+验证命令）
- [x] 本地预览服务器 preview.js（静态文件服务+--watch自动刷新+路径安全检查）
- [x] Web Cache预填充14主星核心断语（从sources/ziwei-doushu仓库实际提取）
- [x] report-template.md增加内容差异化指引（6条差异化原则+跨宫去重检查）
- [x] 文件优先输出策略：所有完整内容写入文件，对话只输出摘要+路径
- [x] Q&A追问文件持久化：超过20行的回答追加写入问答记录.md
- [x] 快捷指令文件输出：\question等也生成MD文件保存
- [x] CLAUDE.md项目指引：确保Claude Code能发现和触发skill
- [x] .claude/skills目录：CC环境下skill自动可用
- [x] PROJECT_CONTEXT.md / README.md / package.json 同步更新

### v2.5.1 新增（输出策略与隔离）

- [x] 文件优先输出策略：所有完整内容写入文件，对话只输出摘要+路径
- [x] CC兼容性：确保Claude Code环境下skill可发现和触发
- [x] 输出隔离规则：ziwei-output/只写目录，.md/.html禁止回读分析
- [x] 同步输出隔离规则到PROJECT_CONTEXT.md和CLAUDE.md
- [x] 输出目录命名统一使用日期_HHmm格式

### v2.6.0 新增（写作质量与仓库重构）

- [x] 三条写作铁律：禁止错误归因/绝对论断/滥用"不是…而是…"
- [x] 写作质量审查制：滥用句式规则从黑名单制改为审查制
- [x] 全面审查修复16处问题表述（绝对论断/宿命感/滥用句式/过度泛化）
- [x] 二轮审查修复16处问题
- [x] 全面同步写作质量规范到所有skills文件
- [x] TOC H2/H3两级折叠 + 问答记录增量规范
- [x] 合并远程仓库 + 解决.gitignore冲突
- [x] 从仓库中移除.DS_Store

### v2.6.1 新增（仓库清理）

- [x] 从仓库中移除所有历史 ziwei-output/ 文件（52个文件）

### v2.7.0 新增（\question修正 + \deep深度提问）

- [x] \question语义修正：AI向用户提问，非自问自答
- [x] 固化 \question 5段输出格式规范，禁止自问自答和提前写文件
- [x] 拆分 \question 为两个独立指令，新增 \deep 深度递进提问
- [x] \deep 重构融合苏格拉底六步法+心理咨询技术
- [x] \deep 新增前置话题菜单（8大维度：自我认知/情感亲密/事业使命/财富欲望/家庭根源/健康身体/社交人际/灵性命运）
- [x] \deep 融合三大专业体系（动机性访谈OARS+叙事治疗外化+苏格拉底6方向）
- [x] \deep 自然对话6原则 + 禁止行为12条
- [x] 交叉校验修复：同步 \deep 描述与 shortcuts.md 行数

### v2.8.0 新增（\friend 友情合盘）

- [x] `\friend` 友情合盘快捷指令（与 `\match` 婚配合盘并行）
- [x] 友情合盘六步法（对方命宫落入法+兄弟宫仆役宫互参+贵人煞星分析）
- [x] 对方命宫落入法12宫位对照表
- [x] 友情双宫联参原则（兄弟宫看深交+仆役宫看广交）
- [x] 十四主星在兄弟宫/仆役宫断语（28条）
- [x] 友情缘分类型（8种：莫逆之交→消耗型）
- [x] 友情相位兼容性（11组命宫组合）
- [x] 左辅右弼友情意义（5种配置）
- [x] 友情合盘与婚配合盘核心差异对照表（10维度）
- [x] 友情合盘报告模板（9章节+越界风险专项）
- [x] 友情评级标准（莫逆之交★★★★★→损友★）
- [x] heming-knowledge.md 扩充（~141行→~340行）
- [x] SKILL.md + shortcuts.md + report-template.md + CHANGELOG.md + PROJECT_CONTEXT.md 同步更新

---

## 十二、待完成事项

- [ ] 实际 AI 工具中测试 Skill 效果
- [ ] 根据测试反馈迭代优化
- [ ] 知识库持续扩充（更多古籍注疏、倪师课程逐字稿细化）

---

## 十三、技术备注

- iztro 排盘需 Node.js 环境，`npm install iztro` 安装
- md2html.js 无外部依赖，纯 Node.js 标准库实现
- HTML 文件为单文件，所有 CSS/JS 内联，可直接浏览器打开
- 体系切换通过 CSS `[data-system]` 属性控制，无需重新渲染
