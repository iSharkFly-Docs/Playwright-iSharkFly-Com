---
title: TestStep
outline: 2
---

# TestStep

<Badge type="info" text="Added in: v1.10" />

表示 [TestResult](/api/class-testresult) 中的一个步骤。

## 方法

### testStep.titlePath() {#test-step-title-path}

<Badge type="info" text="Added in: v1.10" />

返回从根步骤到此步骤的步骤标题列表。

**返回**

- `Array<string>`


## 属性

### testStep.annotations {#test-step-annotations}

<Badge type="info" text="Added in: v1.51" />

适用于当前测试步骤的注解列表。

**类型**

- `Array<Object>`


### testStep.attachments {#test-step-attachments}

<Badge type="info" text="Added in: v1.50" />

在步骤执行期间通过 [`testInfo.attach()`](/api/class-testinfo#test-info-attach) 附加的文件或缓冲区列表。

**类型**

- `Array<Object>`


### testStep.category {#test-step-category}

<Badge type="info" text="Added in: v1.10" />

用于区分不同来源和详细程度的步骤类别。内置类别有：
* `expect` - expect 调用
* `fixture` - fixture 的设置和清理
* `hook` - 钩子的初始化和清理
* `pw:api` - Playwright API 调用
* `test.step` - test.step API 调用
* `test.attach` - testInfo.attach API 调用

**类型**

- `string`


### testStep.duration {#test-step-duration}

<Badge type="info" text="Added in: v1.10" />

运行时间（毫秒）。

**类型**

- `float`


### testStep.error {#test-step-error}

<Badge type="info" text="Added in: v1.10" />

步骤执行期间抛出的错误（如果有）。

**类型**

- `TestError`


### testStep.location {#test-step-location}

<Badge type="info" text="Added in: v1.10" />

定义步骤的源代码中的可选位置。

**类型**

- `Location`


### testStep.params {#test-step-params}

<Badge type="info" text="Added in: v1.63" />

步骤相关的参数（如果可用）。例如，Playwright API 调用产生的步骤包含目标 `locator` 和调用参数（如 `url`），而 [`test.step()`](/api/class-test#test-step) 步骤包含测试作者传递的参数。

```js
// { locator: 'getByRole(\'button\')' }
await page.getByRole('button').click();

// { url: 'https://example.com' }
await page.goto('https://example.com');

// { locator: 'getByLabel(\'Password\')', value: 'secret' }
await page.getByLabel('Password').fill('secret');

// { orderId: 42 }
await test.step('checkout', async () => {
  // ...
}, { params: { orderId: 42 } });
```

为了保持报告较小，Playwright API 调用每次调用只报告一组精选的参数，长字符串值会被截断。无界参数（如页面内容、执行的表达式或请求体）永远不会报告。

**类型**

- `Object<string, any>`


### testStep.parent {#test-step-parent}

<Badge type="info" text="Added in: v1.10" />

父步骤（如果有）。

**类型**

- `TestStep`


### testStep.startTime {#test-step-start-time}

<Badge type="info" text="Added in: v1.10" />

此特定测试步骤的开始时间。

**类型**

- `Date`


### testStep.steps {#test-step-steps}

<Badge type="info" text="Added in: v1.10" />

此步骤内的步骤列表。

**类型**

- `Array<TestStep>`


### testStep.subtitle {#test-step-subtitle}

<Badge type="info" text="Added in: v1.63" />

用户友好的测试步骤副标题，作为标题的补充（如果可用）。对于 Playwright API 调用，它是目标定位器或导航 URL。例如，`Click` 步骤的副标题是被点击的定位器。[`test.step()`](/api/class-test#test-step) 步骤携带测试作者传递的副标题。用户界面通常在标题旁边或单独一行渲染副标题。

```js
// 标题 `Click`，副标题 `getByRole('button')`
await page.getByRole('button').click();

// 标题 `Navigate`，副标题 `example.com/index.html`
await page.goto('https://example.com/index.html');

// 标题 `Add to cart`，副标题 `SKU 42`
await test.step('Add to cart', async () => {
  // ...
}, { subtitle: 'SKU 42' });
```

**类型**

- `string`


### testStep.title {#test-step-title}

<Badge type="info" text="Added in: v1.10" />

用户友好的测试步骤标题，例如 `Click` 或 `Navigate`。

**类型**

- `string`
