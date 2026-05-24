# CLAUDE.md — 紫微斗数 AI Skill 项目指引

> 本文件供 Claude Code 识别项目上下文和触发 Skill。

## 项目概述

紫微斗数排盘与命盘详析 AI Skill，融合 iztro 排盘引擎与倪海厦《天纪》知识库。

## Skill 触发

当用户请求排盘、算命、命理解读、合盘、流年运势、择日等，**必须**读取并遵循 Skill 定义文件：

```
skills/ziwei-astrology/SKILL.md
```

触发词：排盘、紫微斗数、算命、命盘、命理、运势、流年、大限、夫妻宫、事业运、财运、合盘、倪海厦、天纪、择日、桃花、姻缘、考运、健康运、贵人。即使用户只说"帮我看看命""算一卦"也应触发。快捷指令：\money \health \love \career \year \dash \flow \month \question \deep \switch \help

## 关键路径

| 路径 | 用途 |
|------|------|
| `skills/ziwei-astrology/SKILL.md` | 核心指令文件（必须首先读取） |
| `skills/ziwei-astrology/scripts/` | 排盘/验证/转换脚本 |
| `skills/ziwei-astrology/references/` | 知识库参考文件 |
| `sources/iztro/` | iztro 排盘引擎源码 |
| `sources/ziwei-doushu/` | 倪海厦知识库源码 |
| `ziwei-output/` | 排盘输出目录 |

## 核心规则速览

1. **排盘必须代码**：运行 `node skills/ziwei-astrology/scripts/astro.js` 排盘，禁止手动推算
2. **文件优先输出**：完整报告写入 `ziwei-output/` 目录，对话中只输出5行摘要+文件路径
3. **实事求是**：凶象如实描述，不讨好不弱化，格局不成立就不成格
4. **倪师体系为准**：冲突以 ziwei-doushu 为准，大限四化不使用
5. **所有输出必须写文件**：报告/专项/问答记录全部保存为 .md + .html
6. **输出隔离**：ziwei-output/是只写目录，禁止读取旧报告用于分析，只读chart-data.json
7. **写作质量铁律**：禁止错误归因（命盘是参考不是原因）、禁止绝对论断（描述倾向不替人做决定）、禁止滥用"不是…而是…"

## 工作流概要

1. 收集出生信息 → 2. 代码排盘(chart-data.json) → 2.5. 验前事校验 → 3. 格局识别 → 4. 生成报告(写文件) → 5. 继续提问(写文件) → 6. 验证脚本校验

详细流程和规则见 `skills/ziwei-astrology/SKILL.md`。
