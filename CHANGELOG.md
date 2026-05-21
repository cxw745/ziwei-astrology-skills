# Changelog

本文件记录项目的所有重要变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

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
