---
title: "视觉对比"
---

# 视觉对比

## 简介

Playwright Test 包含使用 `await expect(page).toHaveScreenshot()` 生成和视觉比较截图的能力。首次执行时，Playwright Test 将生成参考截图。后续运行将与参考截图进行比较。

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('示例测试', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot();
});
```

:::

::: warning
浏览器渲染可能因主机操作系统、版本、设置、硬件、电源（电池与电源适配器）、无头模式和其他因素而异。为了获得一致的截图，请在生成基准截图的同一环境中运行测试。
:::

## 生成截图

首次运行上述代码时，测试运行器将显示：

```txt
Error: A snapshot doesn't exist at example.spec.ts-snapshots/example-test-1-chromium-darwin.png, writing actual.
```

这是因为还没有黄金文件。此方法会连续截取多个截图直到两个连续的截图匹配，然后将最后一个截图保存到文件系统。现在可以将其添加到仓库中。

包含黄金期望的文件夹名称以测试文件名开头：

```bash
drwxr-xr-x  5 user  group  160 Jun  4 11:46 .
drwxr-xr-x  6 user  group  192 Jun  4 11:45 ..
-rw-r--r--  1 user  group  231 Jun  4 11:16 example.spec.ts
drwxr-xr-x  3 user  group   96 Jun  4 11:46 example.spec.ts-snapshots
```

快照名称 `example-test-1-chromium-darwin.png` 由几个部分组成：
- `example-test-1.png` - 快照的自动生成名称。或者您可以将快照名称指定为 `toHaveScreenshot()` 方法的第一个参数：
  
  ```js
  await expect(page).toHaveScreenshot('landing.png');
  ```
- `chromium-darwin` - 浏览器名称和平台。由于渲染、字体等方面的不同，不同浏览器和平台之间的截图会有所不同，因此您需要为它们准备不同的快照。如果您在[配置文件](./test-configuration.md)中使用多个项目，项目名称将代替 `chromium`。

快照名称和路径可以通过 playwright 配置中的 [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template) 进行配置。

快照默认存储为 PNG 格式。给快照命名时使用 `.webp` 扩展名可以将其存储为 WebP 格式，它也是无损的：

```js
await expect(page).toHaveScreenshot('landing.webp');
```

要将所有未命名的快照存储为 WebP，请在 [`testConfig.expect`](/api/class-testconfig#test-config-expect) 配置中设置 `type` 选项：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      type: 'webp',
    },
  },
});
```

:::

> 请注意，`toHaveScreenshot()` 还接受快照文件路径段的数组，例如 `expect().toHaveScreenshot(['relative', 'path', 'to', 'snapshot.png'])`。
> 但是，此路径必须保持在每个测试文件的快照目录内（即 `a.spec.js-snapshots`），否则将抛出错误。

## 更新截图

有时您需要更新参考截图，例如当页面发生更改时。使用 `--update-snapshots` 标志来实现。

```bash
npx playwright test --update-snapshots
```

## 悬停效果

截图会捕获截取时页面上存在的任何悬停效果。要避免悬停效果，请在截取截图之前将鼠标移动到不会触发悬停效果的位置，或悬停在没有效果的元素上：

```js
await page.mouse.move(-1, -1);
await expect(page).toHaveScreenshot();
```

## 选项

### maxDiffPixels 和 threshold

Playwright Test 使用 [pixelmatch](https://github.com/mapbox/pixelmatch) 库。您可以[传递各种选项](./api/class-pageassertions.md#page-assertions-to-have-screenshot-1)来修改其行为：
- `threshold` 定义哪些像素被认为是不同的。它是比较图像中同一像素之间可接受的感知颜色差异，介于 `0`（严格）和 `1`（宽松）之间。默认为 `0.2`。
- `maxDiffPixels` 是可接受的不同像素数量。默认未设置。

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('示例测试', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({ maxDiffPixels: 100, threshold: 0.1 });
});
```

:::

如果您想在项目中的所有测试之间共享默认值，可以在 playwright 配置中全局或按项目指定它们：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100, threshold: 0.1 },
  },
});
```

:::

### stylePath

您可以在截取截图时将自定义样式表应用于页面。这允许过滤掉动态或易变的元素，从而提高截图的确定性。

::: code-group

```css [screenshot.css]
iframe {
  visibility: hidden;
}
```

:::

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('示例测试', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({ stylePath: path.join(__dirname, 'screenshot.css') });
});
```

:::

如果您想在项目中的所有测试之间共享默认值，可以在 playwright 配置中全局或按项目指定：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      stylePath: './screenshot.css'
    },
  },
});
```

:::

## 非图像快照

除了截图之外，您还可以使用 `expect(value).toMatchSnapshot(snapshotName)` 来比较文本或任意二进制数据。Playwright Test 会自动检测内容类型并使用适当的比较算法。

这里我们将文本内容与参考进行比较。

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('示例测试', async ({ page }) => {
  await page.goto('https://playwright.dev');
  expect(await page.textContent('.hero__title')).toMatchSnapshot('hero.txt');
});
```

:::

快照存储在测试文件旁边的单独目录中。例如，`my.spec.ts` 文件将在 `my.spec.ts-snapshots` 目录中生成和存储快照。您应该将此目录提交到版本控制（例如 `git`），并审查对它的任何更改。
