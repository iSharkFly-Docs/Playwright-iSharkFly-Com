---
title: PlaywrightAssertions
outline: 2
---

# PlaywrightAssertions

<Badge type="info" text="Added in: v1.17" />

Playwright gives you Web-First Assertions with convenience methods for creating assertions that will wait and retry until the expected condition is met.

Consider the following example:

```js
import { test, expect } from '@playwright/test';

test('status becomes submitted', async ({ page }) => {
  // ...
  await page.locator('#submit-button').click();
  await expect(page.locator('.status')).toHaveText('Submitted');
});
```

Playwright will be re-testing the node with the selector `.status` until fetched Node has the `"Submitted"`
text. It will be re-fetching the node and checking it over and over, until the condition is met or until the timeout is
reached. You can pass this timeout as an option.

By default, the timeout for assertions is set to 5 seconds.

## Methods

### playwrightAssertions.expect() {#playwright-assertions-expect-api-response}

<Badge type="info" text="Added in: v1.18" />

Creates a [APIResponseAssertions](/api/class-apiresponseassertions) object for the given [APIResponse](/api/class-apiresponse).

**Usage**

**Arguments**

- <a id="playwright-assertions-expect-api-response-option-response"></a>`response` `APIResponse`

  [APIResponse](/api/class-apiresponse) object to use for assertions.

**Returns**

- `APIResponseAssertions`


### playwrightAssertions.expect() {#playwright-assertions-expect-generic}

<Badge type="info" text="Added in: v1.9" />

Creates a [GenericAssertions](/api/class-genericassertions) object for the given value.

**Arguments**

- <a id="playwright-assertions-expect-generic-option-value"></a>`value` `any`

  Value that will be asserted.

**Returns**

- `GenericAssertions`


### playwrightAssertions.expect() {#playwright-assertions-expect-locator}

<Badge type="info" text="Added in: v1.18" />

Creates a [LocatorAssertions](/api/class-locatorassertions) object for the given [Locator](/api/class-locator).

**Usage**

**Arguments**

- <a id="playwright-assertions-expect-locator-option-locator"></a>`locator` `Locator`

  [Locator](/api/class-locator) object to use for assertions.

**Returns**

- `LocatorAssertions`


### playwrightAssertions.expect() {#playwright-assertions-expect-page}

<Badge type="info" text="Added in: v1.18" />

Creates a [PageAssertions](/api/class-pageassertions) object for the given [Page](/api/class-page).

**Usage**

**Arguments**

- <a id="playwright-assertions-expect-page-option-page"></a>`page` `Page`

  [Page](/api/class-page) object to use for assertions.

**Returns**

- `PageAssertions`

