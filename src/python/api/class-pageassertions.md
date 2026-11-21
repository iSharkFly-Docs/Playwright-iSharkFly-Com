---
title: PageAssertions
outline: 2
---

# PageAssertions

<Badge type="info" text="Added in: v1.17" />

The [PageAssertions](/python/api/class-pageassertions) class provides assertion methods that can be used to make assertions about the [Page](/python/api/class-page) state in the tests.

::: code-group

```python [Async]
import re
from playwright.async_api import Page, expect

async def test_navigates_to_login_page(page: Page) -> None:
    # ..
    await page.get_by_text("Sign in").click()
    await expect(page).to_have_url(re.compile(r".*/login"))
```

```python [Sync]
import re
from playwright.sync_api import Page, expect

def test_navigates_to_login_page(page: Page) -> None:
    # ..
    page.get_by_text("Sign in").click()
    expect(page).to_have_url(re.compile(r".*/login"))
```

:::

## Methods

### page_assertions.not_to_have_title() {#page-assertions-not-to-have-title}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`page_assertions.to_have_title()`](/python/api/class-pageassertions#page-assertions-to-have-title).

**Arguments**

- <a id="page-assertions-not-to-have-title-option-title-or-reg-exp"></a>`title_or_reg_exp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected title or RegExp.
- <a id="page-assertions-not-to-have-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-not-to-have-title-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### page_assertions.not_to_have_url() {#page-assertions-not-to-have-url}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`page_assertions.to_have_url()`](/python/api/class-pageassertions#page-assertions-to-have-url).

**Arguments**

- <a id="page-assertions-not-to-have-url-option-url-or-reg-exp"></a>`url_or_reg_exp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected URL string or RegExp.
- <a id="page-assertions-not-to-have-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-not-to-have-url-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-pageassertions#page-assertions-not-to-have-url-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="page-assertions-not-to-have-url-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### page_assertions.not_to_match_aria_snapshot() {#page-assertions-not-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.60" />

The opposite of [`page_assertions.to_match_aria_snapshot()`](/python/api/class-pageassertions#page-assertions-to-match-aria-snapshot).

**Arguments**

- <a id="page-assertions-not-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="page-assertions-not-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-not-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### page_assertions.to_have_title() {#page-assertions-to-have-title}

<Badge type="info" text="Added in: v1.20" />

Ensures the page has the given title.

**Usage**

::: code-group

```python [Async]
import re
from playwright.async_api import expect

# ...
await expect(page).to_have_title(re.compile(r".*checkout"))
```

```python [Sync]
import re
from playwright.sync_api import expect

# ...
expect(page).to_have_title(re.compile(r".*checkout"))
```

:::

**Arguments**

- <a id="page-assertions-to-have-title-option-title-or-reg-exp"></a>`title_or_reg_exp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected title or RegExp.
- <a id="page-assertions-to-have-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-title-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### page_assertions.to_have_url() {#page-assertions-to-have-url}

<Badge type="info" text="Added in: v1.20" />

Ensures the page is navigated to the given URL.

**Usage**

::: code-group

```python [Async]
import re
from playwright.async_api import expect

# ...
await expect(page).to_have_url(re.compile(".*checkout"))
```

```python [Sync]
import re
from playwright.sync_api import expect

# ...
expect(page).to_have_url(re.compile(".*checkout"))
```

:::

**Arguments**

- <a id="page-assertions-to-have-url-option-url-or-reg-exp"></a>`url_or_reg_exp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected URL string or RegExp.
- <a id="page-assertions-to-have-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-url-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-pageassertions#page-assertions-to-have-url-option-ignore-case) option takes precedence over the corresponding regular expression parameter if specified. A provided predicate ignores this flag.
  - <a id="page-assertions-to-have-url-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### page_assertions.to_match_aria_snapshot() {#page-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.60" />

Asserts that the page body matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

::: code-group

```python [Async]
await page.goto("https://demo.playwright.dev/todomvc/")
await expect(page).to_match_aria_snapshot('''
  - heading "todos"
  - textbox "What needs to be done?"
''')
```

```python [Sync]
page.goto("https://demo.playwright.dev/todomvc/")
expect(page).to_match_aria_snapshot('''
  - heading "todos"
  - textbox "What needs to be done?"
''')
```

:::

**Arguments**

- <a id="page-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="page-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.

