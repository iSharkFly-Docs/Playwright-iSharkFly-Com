---
title: APIResponseAssertions
outline: 2
---

# APIResponseAssertions

<Badge type="info" text="Added in: v1.18" />

The [APIResponseAssertions](/api/class-apiresponseassertions) class provides assertion methods that can be used to make assertions about the [APIResponse](/api/class-apiresponse) in the tests.

```js
import { test, expect } from '@playwright/test';

test('navigates to login', async ({ page }) => {
  // ...
  const response = await page.request.get('https://playwright.dev');
  await expect(response).toBeOK();
});
```

## Methods

### apiResponseAssertions.toBeOK() {#api-response-assertions-to-be-ok}

<Badge type="info" text="Added in: v1.18" /> <Badge type="tip" text="async" />

Ensures the response status code is within `200..299` range.

**Usage**

```js
await expect(response).toBeOK();
```


## Properties

### apiResponseAssertions.not {#api-response-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the response status is not successful:

```js
await expect(response).not.toBeOK();
```

**Type**

- `APIResponseAssertions`

