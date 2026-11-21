---
title: PlaywrightAssertions
outline: 2
---

# PlaywrightAssertions

<Badge type="info" text="Added in: v1.17" />

Playwright 为您提供 Web 优先断言，它具有便捷的方法来创建将等待并重试直到满足预期条件的断言。

考虑以下示例：

```js
import { test, expect } from '@playwright/test';

test('status becomes submitted', async ({ page }) => {
  // ...
  await page.locator('#submit-button').click();
  await expect(page.locator('.status')).toHaveText('Submitted');
});
```

Playwright 将反复测试选择器为 `.status` 的节点，直到获取的节点具有 `"Submitted"` 文本。它会反复重新获取节点并检查，直到满足条件或达到超时。您可以将此超时作为选项传递。

默认情况下，断言的超时设置为 5 秒。

## 方法

### playwrightAssertions.expect() {#playwright-assertions-expect-api-response}

<Badge type="info" text="Added in: v1.18" />

为给定的 [APIResponse](/api/class-apiresponse) 创建 [APIResponseAssertions](/api/class-apiresponseassertions) 对象。

**用法**

**参数**

- <a id="playwright-assertions-expect-api-response-option-response"></a>`response` `APIResponse`

  用于断言的 [APIResponse](/api/class-apiresponse) 对象。

**返回值**

- `APIResponseAssertions`


### playwrightAssertions.expect() {#playwright-assertions-expect-generic}

<Badge type="info" text="Added in: v1.9" />

为给定值创建 [GenericAssertions](/api/class-genericassertions) 对象。

**参数**

- <a id="playwright-assertions-expect-generic-option-value"></a>`value` `any`

  将被断言的值。

**返回值**

- `GenericAssertions`


### playwrightAssertions.expect() {#playwright-assertions-expect-locator}

<Badge type="info" text="Added in: v1.18" />

为给定的 [Locator](/api/class-locator) 创建 [LocatorAssertions](/api/class-locatorassertions) 对象。

**用法**

**参数**

- <a id="playwright-assertions-expect-locator-option-locator"></a>`locator` `Locator`

  用于断言的 [Locator](/api/class-locator) 对象。

**返回值**

- `LocatorAssertions`


### playwrightAssertions.expect() {#playwright-assertions-expect-page}

<Badge type="info" text="Added in: v1.18" />

为给定的 [Page](/api/class-page) 创建 [PageAssertions](/api/class-pageassertions) 对象。

**用法**

**参数**

- <a id="playwright-assertions-expect-page-option-page"></a>`page` `Page`

  用于断言的 [Page](/api/class-page) 对象。

**返回值**

- `PageAssertions`
