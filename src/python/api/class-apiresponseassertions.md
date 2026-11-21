---
title: APIResponseAssertions
outline: 2
---

# APIResponseAssertions

<Badge type="info" text="Added in: v1.18" />

The [APIResponseAssertions](/python/api/class-apiresponseassertions) class provides assertion methods that can be used to make assertions about the [APIResponse](/python/api/class-apiresponse) in the tests.

::: code-group

```python [Async]
from playwright.async_api import Page, expect

async def test_navigates_to_login_page(page: Page) -> None:
    # ..
    response = await page.request.get('https://playwright.dev')
    await expect(response).to_be_ok()
```

```python [Sync]
from playwright.sync_api import Page, expect

def test_navigates_to_login_page(page: Page) -> None:
    # ..
    response = page.request.get('https://playwright.dev')
    expect(response).to_be_ok()
```

:::

## Methods

### api_response_assertions.not_to_be_ok() {#api-response-assertions-not-to-be-ok}

<Badge type="info" text="Added in: v1.19" />

The opposite of [`api_response_assertions.to_be_ok()`](/python/api/class-apiresponseassertions#api-response-assertions-to-be-ok).


### api_response_assertions.to_be_ok() {#api-response-assertions-to-be-ok}

<Badge type="info" text="Added in: v1.18" />

Ensures the response status code is within `200..299` range.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

# ...
await expect(response).to_be_ok()
```

```python [Sync]
import re
from playwright.sync_api import expect

# ...
expect(response).to_be_ok()
```

:::

