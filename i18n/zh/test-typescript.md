---
title: "TypeScript"
---

# TypeScript

## 简介

Playwright 开箱即支持 TypeScript。你只需用 TypeScript 编写测试，Playwright 会读取它们，转换为 JavaScript 并运行。

请注意，Playwright 不会检查类型，即使存在非关键的 TypeScript 编译错误，测试仍会运行。我们建议你在运行 Playwright 的同时运行 TypeScript 编译器。例如在 GitHub Actions 中：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    ...
    - name: Run type checks
      run: npx tsc -p tsconfig.json --noEmit
    - name: Run Playwright tests
      run: npx playwright test
```

对于本地开发，你可以像这样以 [watch](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) 模式运行 `tsc`：

```sh
npx tsc -p tsconfig.json --noEmit -w
```

## tsconfig.json

Playwright 会为其加载的每个源文件读取 `tsconfig.json`。请注意，Playwright **仅支持**以下 tsconfig 选项：`allowJs`、`baseUrl`、`paths`、`jsx`、`jsxFactory`、`jsxFragmentFactory`、`jsxImportSource`、`useDefineForClassFields`、`references` 和 `extends`。`target` 选项仅用于确定 `useDefineForClassFields`。

我们建议在 tests 目录中设置单独的 `tsconfig.json`，以便你可以专门为测试更改一些配置。以下是一个目录结构示例：

```txt
src/
    source.ts

tests/
    tsconfig.json  # 测试专用的 tsconfig
    example.spec.ts

tsconfig.json  # 所有 TypeScript 源文件的通用 tsconfig

playwright.config.ts
```

### tsconfig 路径映射

Playwright 支持在 `tsconfig.json` 中声明的[路径映射](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)。

以下是一个与 Playwright 配合使用的 `tsconfig.json` 示例：

::: code-group

```json [tsconfig.json]
{
  "compilerOptions": {
    "paths": {
      "@myhelper/*": ["packages/myhelper/*"] // 此映射相对于 tsconfig 所在位置
    }
  }
}
```

:::

现在你可以使用映射的路径进行导入：

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';
import { username, password } from '@myhelper/credentials';

test('example', async ({ page }) => {
  await page.getByLabel('User Name').fill(username);
  await page.getByLabel('Password').fill(password);
});
```

:::

### tsconfig JSX 选项

Playwright 根据 `tsconfig.json` 中的 `jsx`、`jsxFactory`、`jsxFragmentFactory` 和 `jsxImportSource` 选项编译 `.tsx` 和 `.jsx` 文件中的 JSX。当 `jsx` 未指定或设置为 `preserve` 或 `react-native` 时，Playwright 使用 `react/jsx-runtime` 的自动运行时。

::: code-group

```json [tsconfig.json]
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

:::

### tsconfig 类字段

Playwright 根据 `tsconfig.json` 中的 `useDefineForClassFields` 选项编译 TypeScript 类字段。与 `tsc` 一样，当未指定时，对于 `ES2022` 及更高版本的目标会启用它，当未指定 `target` 时也会启用。

启用 `useDefineForClassFields` 后，类字段遵循 JavaScript 语义，因此字段初始化器在构造函数体之前运行，并且无法访问构造函数参数属性。禁用它可以保持旧版 TypeScript 语义。

::: code-group

```json [tsconfig.json]
{
  "compilerOptions": {
    "useDefineForClassFields": false
  }
}
```

:::

### tsconfig 解析

默认情况下，Playwright 会通过向上遍历目录结构并查找 `tsconfig.json` 或 `jsconfig.json`，为每个导入的文件查找最近的 tsconfig。这样，你可以创建一个仅用于测试的 `tests/tsconfig.json` 文件，Playwright 会自动识别它。

```sh
# Playwright 会自动选择 tsconfig
npx playwright test
```

或者，你可以在命令行中指定单个 tsconfig 文件，Playwright 将对所有导入的文件使用它，而不仅仅是测试文件。

```sh
# 传递特定的 tsconfig
npx playwright test --tsconfig=tsconfig.test.json
```

你可以在配置文件中指定单个 tsconfig 文件，该文件将用于加载测试文件、报告器等。但是，它不会用于加载 playwright 配置本身或从中导入的任何文件。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  tsconfig: './tsconfig.test.json',
});
```

:::

## package.json 子路径导入

Playwright 支持在 `package.json` 中声明的[子路径导入](https://nodejs.org/api/packages.html#subpath-imports)。Node.js 将子路径导入解析为其映射的第一个目标，即使该文件不存在。当 Node.js 失败时，Playwright 会转而遵循 TypeScript：它会尝试每个目标直到有一个解析成功，并且 `.js` 目标也会匹配同名的 `.ts` 文件。

以下是一个与 Playwright 配合使用的 `package.json` 示例：

::: code-group

```json [package.json]
{
  "imports": {
    "#helpers/*": ["./src/helpers/*", "./src/helpers/*.ts", "./src/helpers/*/index.ts"]
  }
}
```

:::

现在你可以使用映射的路径进行导入：

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';
import { username, password } from '#helpers/credentials';

test('example', async ({ page }) => {
  await page.getByLabel('User Name').fill(username);
  await page.getByLabel('Password').fill(password);
});
```

:::

## 使用 TypeScript 手动编译测试

有时，Playwright Test 无法正确转换你的 TypeScript 代码，例如当你使用 TypeScript 的实验性或非常新的功能时，这些通常在 `tsconfig.json` 中配置。

在这种情况下，你可以在将测试发送给 Playwright 之前执行自己的 TypeScript 编译。

首先在 tests 目录中添加一个 `tsconfig.json` 文件：

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "commonjs",
        "moduleResolution": "Node",
        "sourceMap": true,
        "outDir": "../tests-out",
    }
}
```

在 `package.json` 中，添加两个脚本：

```json
{
  "scripts": {
    "pretest": "tsc --incremental -p tests/tsconfig.json",
    "test": "playwright test -c tests-out"
  }
}
```

`pretest` 脚本对测试运行 TypeScript 编译。`test` 会运行已生成到 `tests-out` 目录的测试。`-c` 参数配置测试运行器在 `tests-out` 目录中查找测试。

然后 `npm run test` 将构建测试并运行它们。
