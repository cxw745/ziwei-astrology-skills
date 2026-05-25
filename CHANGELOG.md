# Changelog

本文件记录项目的所有重要变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [2.8.0] - 2026-05-25

### Added

- **`\friend` 友情合盘快捷指令**（SKILL.md + shortcuts.md）：与 `\match` 婚配合盘并行，独立分析两人友情缘分
- **友情合盘六步法**（heming-knowledge.md）：①评估双方命格基础 ②对方命宫落入法（核心步骤） ③兄弟宫+仆役宫互参 ④四化飞化互参（友情侧重） ⑤贵人星与煞星分析 ⑥大限同步分析
- **对方命宫落入法**（heming-knowledge.md）：12宫位完整对照表，看对方命宫主星落入你命盘哪个宫位，决定对方在你生命中的角色
- **友情双宫联参原则**（heming-knowledge.md）：「看友情，兄弟宫看深交，仆役宫看广交，两者联参方全」
- **十四主星在兄弟宫/仆役宫断语**（heming-knowledge.md）：28条断语（14主星×2宫位），含倪师原话
- **友情缘分类型**（heming-knowledge.md）：8种类型（莫逆之交/灵魂知己/事业搭档/过命交情/贵人朋友/越界暧昧/消耗型/表面风光）
- **友情相位兼容性**（heming-knowledge.md）：11组命宫组合的友情兼容度评级
- **友情合盘与婚配合盘核心差异对照表**（heming-knowledge.md）：10个维度的差异对比
- **左辅右弼友情意义**（heming-knowledge.md）：5种配置的友情含义
- **友情合盘报告模板**（report-template.md）：9章节完整结构，含越界风险专项提醒
- **友情评级标准**（shortcuts.md）：莫逆之交★★★★★ → 损友★（5级）
- SKILL.md 触发词新增：友情、朋友、友谊
- SKILL.md 快捷指令表格新增 `\friend` 行
- SKILL.md 功能模块新增"友情合盘"
- SKILL.md `\friend` 友情合盘7步流程

### Changed

- `\match` 快捷指令标题改为"合盘分析（婚配）"，与 `\friend` 友情合盘区分
- heming-knowledge.md 目录分为"婚配合盘"和"友情合盘"两大板块
- heming-knowledge.md 行数从~141行扩充至~340行
- SKILL.md 参考文件索引更新 heming-knowledge.md 行数

## [2.7.0] - 2026-05-25

### Added

- **`\deep` 深度提问快捷指令**（SKILL.md + shortcuts.md）：拆分原 `\question` 为两个独立指令，新增 `\deep` 苏格拉底式引导内省
- **`\deep` 前置话题菜单**：8大维度（自我认知/情感亲密/事业使命/财富欲望/家庭根源/健康身体/社交人际/灵性命运），用户自选探索方向
- **`\deep` 三大专业体系融合**：
  - 动机性访谈(MI) OARS模型：Open questions/Affirmations/Reflections/Summaries，反射比提问更重要
  - 叙事治疗外化对话：把"问题"和"人"分开，每颗星=一个"部分"
  - 苏格拉底提问法6个递进方向（理查德·保罗）：按需取用，非固定步骤
- **`\deep` 自然对话6原则**：先接住再追问/命盘轻轻点/允许跑题/用故事不用概念/外化问题/每3-4轮总结
- **`\deep` 禁止行为12条**：含星曜当标签贴人、命盘硬塞等
- SKILL.md 快捷指令表格新增 `\deep` 行
- shortcuts.md 从~88行扩充至~215行（含 `\question` 完整规范 + `\deep` 完整规范）

### Changed

- `\question` 语义修正：AI向用户提问，非自问自答
- 固化 `\question` 5段输出格式规范（🎲随机提问 + 💫命盘线索 + 🪞反思引导 + 🎯行动建议 + 📝记录提示），禁止自问自答和提前写文件
- `\deep` 从5层递进表格→苏格拉底六步法→融合三大专业体系，去掉固定输出模板，改为自然流动
- SKILL.md 文件优先策略第4条更新为同时提及 `\question` 和 `\deep`

### Fixed

- `\question` 在不同AI间表现不一致：通过固化5段输出格式+禁止行为清单+正确工作流解决
- `\deep` 对话死板：通过融合三大专业体系+去掉固定输出模板+自然对话原则解决
- 交叉校验修复：同步 `\deep` 描述与 shortcuts.md 行数

## [2.6.1] - 2026-05-24

### Changed

- 从仓库中移除所有历史 ziwei-output/ 文件（52个文件），通过 .gitignore 排除输出目录

## [2.6.0] - 2026-05-23

### Added

- **三条写作铁律**（SKILL.md铁律速查卡新增第6/7/8条）：禁止错误归因、禁止绝对论断、禁止滥用"不是…而是…"
- **写作质量审查制**：滥用句式规则从黑名单制改为审查制，逐条检查是否恰当
- **TOC H2/H3两级折叠**：HTML目录支持二级和三级标题折叠
- **问答记录增量规范**：Q&A追问追加写入问答记录.md的格式规范

### Changed

- 全面审查修复16处问题表述（绝对论断/宿命感/滥用句式/过度泛化）
- 二轮审查修复16处问题
- 全面同步写作质量规范到所有skills文件（SKILL.md + shortcuts.md + report-template.md）
- 合并远程仓库 + 解决.gitignore冲突

### Fixed

- 从仓库中移除.DS_Store

## [2.5.1] - 2026-05-22

### Added

- **文件优先输出策略**（SKILL.md）：所有完整内容写入文件，对话只输出摘要+文件路径。Q&A超过20行追加写入问答记录.md
- **CC兼容性**：确保Claude Code环境下skill可发现和触发
- **输出隔离规则**（SKILL.md）：ziwei-output/是只写目录，.md/.html禁止回读用于分析，只读chart-data.json

### Changed

- 同步输出隔离规则到PROJECT_CONTEXT.md和CLAUDE.md
- 输出目录命名统一使用日期_HHmm格式，精确到分钟防覆盖

## [2.5.0] - 2026-05-22

### Added

- **md2html.js模块化重构**：3955行→420行薄编排层，拆出lib/styles.js(2066行)+lib/interaction.js(1004行)
- **铁律速查卡**（SKILL.md）：5→8条最高频违反铁律，每个Step前强制回顾
- **内嵌检查点**（SKILL.md）：Step 1~5每个Step前增加🔍检查点提示
- **验证反馈闭环脚本** validate-and-fix.js（整合3个验证+结构化JSON修正建议）
- **章节级验证器** section-validator.js（10种章节类型，输出fixSuggestions）
- **分段生成辅助器** generate-section.js（数据切片+模板片段+验证命令）
- **本地预览服务器** preview.js（静态文件服务+--watch自动刷新+路径安全检查）
- **Web Cache预填充**：14主星核心断语（从sources/ziwei-doushu仓库实际提取）
- **内容差异化指引**（report-template.md）：6条差异化原则+跨宫去重检查
- **快捷指令文件输出**：\question等也生成MD文件保存
- **CLAUDE.md项目指引**：确保Claude Code能发现和触发skill
- **.claude/skills目录**：CC环境下skill自动可用

### Changed

- SKILL.md Step 6脚本验证从4项扩展为6项（新增validate-and-fix.js+section-validator.js）
- 删除空壳lib/theme.js，功能由lib/styles.js替代
- PROJECT_CONTEXT.md / README.md / package.json 同步更新

## [2.3.0] - 2026-05-22

### Added

- **排盘脚本封装** scripts/astro.js（封装iztro bySolar，命令行输出JSON+持久化）
- **排盘结果持久化** chart-data.json（快捷指令复用排盘数据，无需重新排盘）
- **结构化索引** references/index.json（14主星×12宫×46格局×十天干四化完整索引）
- **排盘准确性校验** scripts/verify-astro.js（7项数据级校验：星曜/四化/空宫/身宫/来因宫/五行局/命宫）
- **增强 validate-report.js**（16项→24项检查：子节完整性/飞四化48条/来源标注密度/倪师断语/行数/讨好倾向扩展/附录）
- **MD格式规范检查** scripts/lint-md.js（10项检查：标题层级/表格/章节/空行/列表/引用/HTML残留/四化标记/来源标注/多余空行）
- **自动化评测** scripts/run-evals.js（6个eval用例自动检查）
- **网页搜索缓存机制** references/web-cache/（避免重复搜索）
- **知识库版本追踪** sources/versions.json + scripts/update-sources.sh
- **Skill独立使用优化**：降级模式→精简模式（排盘不受影响，验证脚本可用）
- **同步脚本** scripts/sync-skills.sh（.trae目录版本同步）
- **package.json脚本命令**（astro/md2html/validate/lint/eval/sync/update）

### Changed

- SKILL.md更新：排盘持久化、12步核查流程、搜索缓存、参考文件索引扩充
- PROJECT_CONTEXT.md文件结构更新

## [2.4.1] - 2026-05-22

### Added

- **强制数据回调机制**（SKILL.md）：每个Step开始前必须重新读取chart-data.json，不凭对话记忆分析。灵感来源：vedic-astro-skills 的阶段间强制数据回调
- **语言风格量化配比**（SKILL.md核心原则）：70%通俗解读+20%数据表格+10%技术注释，解读在前数据在后。灵感来源：vedic-astro-skills 的语言风格规则
- **禁止词清单**（SKILL.md核心原则）：禁止"该星曜""此配置""上述参数""综上所述""值得注意的是"等论文腔。灵感来源：vedic-astro-skills 的术语使用规则
- **验前事复盘机制**（validation-protocol.md）：完整报告生成后自动回溯解释验前事未命中的原因，保持盲审完整性。灵感来源：vedic-astro-skills 的验前事复盘
- **反敌意用户防御**（validation-protocol.md）：验前事阶段用户表达强烈不满时的应对话术和硬规则。灵感来源：vedic-astro-skills 的反轴用户防御
- **核心关切只影响排版不影响内容**（SKILL.md）：用户关心事业→事业部分先写详细，但不能因此把所有星曜都解读成支持事业。灵感来源：vedic-astro-skills career skill
- **快捷指令继承盲审+双审**（SKILL.md）：所有快捷指令均继承盲审原则和Q&A正反双审规则

### Changed

- SKILL.md 核心原则从8条增至10条（新增语言风格配比+禁止词清单）

## [2.4.0] - 2026-05-22

### Added

- **验前事校验机制**（`references/validation-protocol.md`）：排盘后、报告前，从排盘数据推导3-5条可证伪的事实性预测，用户逐条确认后校准命盘可信度。灵感来源：vedic-astro-skills 的 past-validation 机制
- **大限/流年硬约束规则**（`references/period-constraints.md`）：正面/负面判定条件（可计算）、流年叠加规则（6种组合）、5条禁止推导错误（打击美化/鸡汤/确认偏误/灵性包装/讨好）、格局激活验证（承诺×时机×品质三层验证+兑现率估算）。灵感来源：vedic-astro-skills 的 Dasha hard-constraint rules
- **星曜联合判定约束**（`references/star-constraints.md`）：信号分诊（A/B/C级分析深度）、冲突仲裁4规则（带毒高价值/表面风光底子虚/有贵人但自己弱/信号混合）、禁止折衷表述清单（7条）。灵感来源：vedic-astro-skills 的 PAC 联合判定机制
- **Q&A正反双审规则**（`references/qa-rules.md`）：判断性问题必须同时列出支持和制约数据、数据源优先级（报告→排盘→references→修正日志）、禁止卖乐观/卖悲观。灵感来源：vedic-astro-skills 的 dual-review Q&A
- **盲审原则8条**（SKILL.md核心原则新增）：禁止反向推导、禁止经历=天赋、禁止情绪定调、大限回顾必须双向、不同用户同样数据→同样结论、验前事信息不影响分析、反锚定自检、信号修正日志。灵感来源：vedic-astro-skills 的 blind-audit 机制
- **Step 2.5 验前事校验**（SKILL.md工作流新增）：排盘后、格局识别前的可信度守门员步骤
- **数据隔离声明**（SKILL.md工作流新增）：分析阶段只看排盘数据，Q&A阶段有限开放+正反双审
- SKILL.md 常见陷阱新增6条：反向推导、信号冲突取平均、大限凶象美化、验前事辩解、Q&A只列单边、格局未验证激活

### Changed

- SKILL.md 核心原则从7条增至8条（新增盲审原则）
- SKILL.md 参考文件索引从14个references增至18个
- SKILL.md 解读阶段陷阱范围从 Step 3-4 扩展为 Step 2.5-4

## [2.2.1] - 2026-05-22

### Changed

- 输出文件夹命名格式从 `{日期}_{出生信息}` 改为 `{日期_HHmm}_{出生信息}`，时间戳精确到分钟（如 `2026-05-22_1430_2002年04月05日午时男`），确保同一生辰在不同时刻排盘时保存到不同文件夹，不会覆盖之前的报告
- SKILL.md、report-template.md、PROJECT_CONTEXT.md 同步更新命名规则说明

## [2.2.0] - 2026-05-22

### Added

- `\match` 合盘分析快捷指令：基于倪师合盘五步法，分析两人命盘缘分匹配度与相处建议
- 合盘报告模板（report-template.md）：10章节完整结构，含双方基本信息、命格评估、夫妻宫互参、太阳太阴分析、四化飞化互参、天作之合判断、匹配度评级、大限同步、相处建议、总结评级
- 合盘详细指引（shortcuts.md）：含触发方式、分析流程、输出章节、匹配度评级标准
- SKILL.md 合盘功能模块说明：含 `\match` 流程、输出文件规范
- 移动端浮动目录按钮（mobile-toc-fab）：左下角蓝色圆形按钮，点击弹出底部目录抽屉
- 移动端底部目录抽屉（mobile-toc-drawer）：从底部滑出，60vh高度，含完整目录导航
- md2html.js 帮助面板新增 `\match` 合盘分析指令

### Fixed

- 手机端HTML目录不可见问题：新增移动端专用浮动目录按钮和底部抽屉，替代原来隐藏的侧边栏目录
- 移动端汉堡菜单按钮不够明显：增加背景色、边框和阴影

### Changed

- 完成后提示语模板更新：所有提示语新增 `\match` 合盘分析指令
- 专项解读完成后提示语新增 `\match` 指令

## [2.1.0] - 2026-05-22

### Added

- `references/nihai-medicine.md`：倪海厦人纪·地纪健康断语知识库，从renji.ts和diji.ts提炼，包含五行脏腑对应、十四主星疾厄宫断语（倪师中医视角）、子午流注、针灸经验穴位速查、汉唐方剂联动、核心经方精选、阳宅风水与健康、倪师健康核心语录
- `references/fallback-guide.md`：Skill独立使用降级策略，当sources/目录不存在时自动切换到降级模式
- `scripts/validate-report.js`：报告结构自动化验证脚本，16项自检清单自动检查
- `scripts/lib/`：md2html.js模块化拆分目录，包含parser.js、chart.js、theme.js、toc.js四个模块
- SKILL.md：正反对比示例小节（讨好倾向vs实事求是、格局判断vs凑格局、来源标注vs虚构来源、体系混用vs体系标注）
- SKILL.md：时辰模糊处理策略（相邻时辰对比、命宫变化警示）
- SKILL.md：推荐搜索策略细化（关键词模板、优先搜索站点、可信度排序、冲突处理）

### Changed

- `references/classics-excerpts.md`：补全骨髓赋9章29段、紫微斗数全集5章23段、紫微斗数全书7章17段的完整原文（原标注"暂未提取"的已全部提取）
- `references/nihai-quotes.md`：从~120行扩充至827行，按"星曜×宫位×四化"三维结构重新组织，新增十四主星断语、四化星断语扩充、格局断语扩充、十二宫断语扩充、面相断语扩充、堪舆断语扩充、天纪24集课程要点完整版、倪师核心语录库29条
- `references/star-palace-matrix.md`：从一句话断语扩充为三维深度断语（基本断语+庙旺差异+四化叠加+煞星警示），关键四化组合标注年干
- `references/report-template.md`：十二宫分论改为分级制（重点宫7子节/普通宫5子节/轻量宫3子节），避免形式主义填充
- `scripts/md2html.js`：拆分为模块化架构，主入口文件导入lib/下四个模块

## [2.0.0] - 2026-05-21

### Added

- 源仓库本地化（sources/iztro + sources/ziwei-doushu，作为事实索引数据库）
- 来源标注体系（[来源: 仓库名/文件路径] 格式，MD可见/HTML隐藏）
- source-repos.md重写为本地文件索引
- SKILL.md增加来源标注核心原则和常见陷阱
- report-template.md增加来源标注规范和示例
- md2html.js增加source-ref隐藏处理

### Changed

- report-template.md完全重写（匹配示例的完整11章结构，763行）
- SKILL.md增加内容丰富度硬性要求
- HTML移动端顶栏重叠修复

## [1.0.0] - 2026-05-20

### Added

- 初始版本发布
- 基于iztro排盘引擎和ziwei-doushu知识库的紫微斗数AI Skill
- 三模式解读（iztro/倪师/综合）
- 交互式HTML输出（排盘图可视化、明暗主题、体系切换）
- 快捷指令体系
- 12个references参考文件
- MD转HTML脚本
- 6个evals测试用例
