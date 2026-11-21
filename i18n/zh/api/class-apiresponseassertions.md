---
title: APIResponseAssertions
outline: 2
---

# APIResponseAssertions

<Badge type="info" text="Added in: v1.18" />

[APIResponseAssertions](/api/class-apiresponseassertions) 类提供了可用于在测试中对 [APIResponse](/api/class-apiresponse) 进行断言的断言方法。

```js
import { test, expect } from '@playwright/test';

test('navigates to login', async ({ page }) => {
  // ...
  const response = await page.request.get('https://playwright.dev');
  await expect(response).toBeOK();
});
```

## 方法

### apiResponseAssertions.toBeOK() {#api-response-assertions-to-be-ok}

<Badge type="info" text="Added in: v1.18" /> <Badge type="tip" text="async" />

确保响应状态码在 `200..299` 范围内。

**用法**

```js
await expect(response).toBeOK();
```


## 属性

### apiResponseAssertions.not {#api-response-assertions-not}

<Badge type="info" text="Added in: v1.20" />

使断言检查相反的条件。

**用法**

例如，此代码测试响应状态不是成功的：

```js
await expect(response).not.toBeOK();
```

**类型**

- `APIResponseAssertions`
