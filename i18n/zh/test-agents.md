---
title: "代理"
---

# 代理

import LiteYouTube from '@site/src/components/LiteYouTube';

# Playwright 测试代理

## 简介

Playwright 内置了三个 Playwright 测试代理：**🎭 planner（规划器）**、**🎭 generator（生成器）** 和 **🎭 healer（修复器）**。

这些代理可以独立使用、按顺序使用，或作为代理循环中的链式调用。
按顺序使用它们将为您的产品生成测试覆盖。
* **🎭 planner** 探索应用并生成 Markdown 格式的测试计划
* **🎭 generator** 将 Markdown 计划转换为 Playwright 测试文件
* **🎭 healer** 执行测试套件并自动修复失败的测试

<LiteYouTube
id="_AifxZGxwuk"
title="Playwright 1.56 - 介绍 Playwright 测试代理"
/>

### 入门指南

首先使用 `init-agents` 命令将 Playwright 测试代理定义添加到您的项目中。每当 Playwright 更新时，应重新生成这些定义以获取新工具和指令。

::: code-group

```bash [Vscode]
npx playwright init-agents --loop=vscode
```

```bash [Claude]
npx playwright init-agents --loop=claude
```

```bash [Codex]
npx playwright init-agents --loop=codex
```

```bash [Opencode]
npx playwright init-agents --loop=opencode
```

:::

::: info
需要 VS Code v1.105（2025 年 10 月 9 日发布）才能使代理体验在 VS Code 中正常运行。
:::

生成代理后，您可以使用您选择的 AI 工具来命令这些代理构建 Playwright 测试。

## 🎭 Planner（规划器）

Planner 代理探索您的应用并为一个或多个场景和用户流程生成测试计划。

**输入**
* 向规划器发出明确的请求（例如，"为访客结账生成一个计划。"）
* 一个 `seed 测试`，用于设置与应用交互所需的环境
* *(可选)* 用于上下文的产品需求文档（PRD）

**提示**

<img src={require("../images/test-agents/planner-prompt.png").src} alt="规划器提示" width="472"/>

> - 注意 `seed.spec.ts` 是如何包含在规划器上下文中的。
> - 规划器将运行此测试以执行测试所需的所有初始化，包括全局设置、项目依赖项以及所有必要的 fixture 和钩子。
> - 规划器还将使用此 seed 测试作为所有生成测试的示例。或者，您可以在提示中提及文件名。

::: code-group

```js [示例：seed.spec.ts]
import { test, expect } from './fixtures';

test('seed', async ({ page }) => {
  // 此测试使用来自 ./fixtures 的自定义 fixture
});
```

:::

**输出**
* 一个保存为 `specs/basic-operations.md` 的 Markdown 测试计划。
* 该计划人类可读，但足够精确以用于测试生成。

<details>

<summary>示例：<b>specs/basic-operations.md</b></summary>

```markdown
# TodoMVC 应用 - 基本操作测试计划

## 应用概述

TodoMVC 应用是一个基于 React 的待办事项列表管理器，展示了标准待办事项应用的功能。该应用提供了全面的任务管理功能，界面简洁直观。主要功能包括：

- **任务管理**：添加、编辑、完成和删除单个待办事项
- **批量操作**：将所有待办事项标记为完成/未完成并清除所有已完成的待办事项
- **过滤系统**：通过"全部"、"进行中"或"已完成"状态查看待办事项，支持 URL 路由
- **实时计数器**：显示活动（未完成）待办事项数量
- **交互式 UI**：悬停状态、就地编辑功能和响应式设计
- **状态持久化**：在会话导航期间维护状态

## 测试场景

### 1. 添加新待办事项

**Seed：** `tests/seed.spec.ts`

#### 1.1 添加有效的待办事项

**步骤：**
1. 点击"What needs to be done?"输入框
2. 输入"Buy groceries"
3. 按 Enter 键

**预期结果：**
- 待办事项出现在列表中，带有未选中的复选框
- 计数器显示"1 item left"
- 输入框被清空，准备接受下一个条目
- 待办事项列表控件变得可见（"全部标记为完成"复选框）

#### 1.2 添加多个待办事项
...
```

</details>

## 🎭 Generator（生成器）

Generator 代理使用 Markdown 计划生成可执行的 Playwright 测试。
它在执行场景时实时验证选择器和断言。Playwright 支持生成提示并提供断言目录，用于高效的结构和行为验证。

**输入**
* 来自 `specs/` 的 Markdown 计划

**提示**

<img src={require("../images/test-agents/generator-prompt.png").src} alt="生成器提示" width="472"/>

> - 注意 `basic-operations.md` 是如何包含在生成器上下文中的。
> - 这就是生成器知道从哪里获取测试计划的方式。或者，您可以在提示中提及文件名。

**输出**
* `tests/` 下的测试套件
* 生成的测试可能包含初始错误，这些错误可以由 healer 代理自动修复

<details>

<summary>示例：<b>tests/add-valid-todo.spec.ts</b></summary>

```ts
// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('添加新待办事项', () => {
  test('添加有效的待办事项', async ({ page }) => {
    // 1. 点击"What needs to be done?"输入框
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    await todoInput.click();

    // 2. 输入"Buy groceries"
    await todoInput.fill('Buy groceries');

    // 3. 按 Enter 键
    await todoInput.press('Enter');

    // 预期结果：
    // - 待办事项出现在列表中，带有未选中的复选框
    await expect(page.getByText('Buy groceries')).toBeVisible();
    const todoCheckbox = page.getByRole('checkbox', { name: 'Toggle Todo' });
    await expect(todoCheckbox).toBeVisible();
    await expect(todoCheckbox).not.toBeChecked();

    // - 计数器显示"1 item left"
    await expect(page.getByText('1 item left')).toBeVisible();

    // - 输入框被清空，准备接受下一个条目
    await expect(todoInput).toHaveValue('');
    await expect(todoInput).toBeFocused();

    // - 待办事项列表控件变得可见（"全部标记为完成"复选框）
    await expect(page.getByRole('checkbox', { name: '❯Mark all as complete' })).toBeVisible();
  });
});
```

</details>

## 🎭 Healer（修复器）

当测试失败时，healer 代理会：
* 重放失败的步骤
* 检查当前 UI 以定位等效元素或流程
* 建议修补程序（例如，定位器更新、等待调整、数据修复）
* 重新运行测试直到通过或直到保护机制停止循环

**输入**
* 失败的测试名称

**提示**

<img src={require("../images/test-agents/healer-prompt.png").src} alt="修复器提示" width="469"/>

**输出**
* 一个通过的测试，或者如果修复器认为功能已损坏则跳过该测试。

## 工件和约定

静态代理定义和生成的文件遵循简单、可审计的结构：

```bash
repo/
  .github/                    # 代理定义
  specs/                      # 人类可读的测试计划
    basic-operations.md
  tests/                      # 生成的 Playwright 测试
    seed.spec.ts              # 用于环境的 seed 测试
    tests/create/add-valid-todo.spec.ts
  playwright.config.ts
```

### 代理定义

在底层，代理定义是指令和 MCP 工具的集合。它们由 Playwright 提供，每当 Playwright 更新时应重新生成。

Claude Code 子代理的示例：

```bash
npx playwright init-agents --loop=vscode
```

### `specs/` 中的规格

规格是描述场景的结构化计划，以人类可读的方式呈现。它们包括步骤、预期结果和数据。规格可以从头开始创建，也可以扩展 seed 测试。

### `tests/` 中的测试

生成的 Playwright 测试，尽可能与规格一一对应。

### Seed 测试 `seed.spec.ts`

Seed 测试提供一个可直接使用的 `page` 上下文来启动执行。
