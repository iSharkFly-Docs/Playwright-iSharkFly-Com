---
title: "断言"
---

# 断言

## 介绍

Playwright 包含 Web 特定的断言，它们会自动重试直到满足预期条件。考虑以下示例：

```python
expect(page.get_by_test_id("status")).to_have_text("Submitted")
```

Playwright 将重新测试具有测试 ID `status` 的元素，直到它具有 `"Submitted"` 文本。它将反复重新获取元素并检查，直到满足条件或达到超时。

默认情况下，断言的超时时间为 5 秒。

## 自动重试断言

以下断言将重试，直到断言通过或达到断言超时。

| 断言 | 描述 |
| :- | :- |
| [`locator_assertions.to_be_attached()`](/python/api/class-locatorassertions#locator-assertions-to-be-attached) | 元素已附加 |
| [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已勾选 |
| [`locator_assertions.to_be_disabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-disabled) | 元素已禁用 |
| [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable) | 元素可编辑 |
| [`locator_assertions.to_be_empty()`](/python/api/class-locatorassertions#locator-assertions-to-be-empty) | 容器为空 |
| [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled) | 元素已启用 |
| [`locator_assertions.to_be_focused()`](/python/api/class-locatorassertions#locator-assertions-to-be-focused) | 元素已聚焦 |
| [`locator_assertions.to_be_hidden()`](/python/api/class-locatorassertions#locator-assertions-to-be-hidden) | 元素不可见 |
| [`locator_assertions.to_be_in_viewport()`](/python/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | 元素与视口相交 |
| [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`locator_assertions.to_contain_class()`](/python/api/class-locatorassertions#locator-assertions-to-contain-class) | 元素具有指定的 CSS 类 |
| [`locator_assertions.to_contain_text()`](/python/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`locator_assertions.to_have_accessible_description()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-description) | 元素具有匹配的[无障碍描述](https://w3c.github.io/accname/#dfn-accessible-description) |
| [`locator_assertions.to_have_accessible_name()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-name) | 元素具有匹配的[无障碍名称](https://w3c.github.io/accname/#dfn-accessible-name) |
| [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有 DOM 属性 |
| [`locator_assertions.to_have_class()`](/python/api/class-locatorassertions#locator-assertions-to-have-class) | 元素具有 class 属性 |
| [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count) | 列表具有确切数量的子元素 |
| [`locator_assertions.to_have_css()`](/python/api/class-locatorassertions#locator-assertions-to-have-css) | 元素具有 CSS 属性 |
| [`locator_assertions.to_have_id()`](/python/api/class-locatorassertions#locator-assertions-to-have-id) | 元素具有 ID |
| [`locator_assertions.to_have_js_property()`](/python/api/class-locatorassertions#locator-assertions-to-have-js-property) | 元素具有 JavaScript 属性 |
| [`locator_assertions.to_have_role()`](/python/api/class-locatorassertions#locator-assertions-to-have-role) | 元素具有特定的 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value) | 输入具有值 |
| [`locator_assertions.to_have_values()`](/python/api/class-locatorassertions#locator-assertions-to-have-values) | 选择框已选中选项 |
| [`locator_assertions.to_match_aria_snapshot()`](/python/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) | 元素匹配提供的 Aria 快照 |
| [`page_assertions.to_have_title()`](/python/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`page_assertions.to_have_url()`](/python/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |
| [`api_response_assertions.to_be_ok()`](/python/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | 响应具有 OK 状态 |

## 软断言

默认情况下，失败的断言将终止测试执行。Playwright 还支持*软断言*：失败的软断言**不会**终止测试执行，但会将测试标记为失败。

```python
# 进行一些不会在失败时停止测试的检查...
expect.soft(page.get_by_test_id("status")).to_have_text("Success")
expect.soft(page.get_by_test_id("eta")).to_have_text("1 day")

# ...然后继续测试以检查更多内容。
page.get_by_role("link", name="next page").click()
expect.soft(page.get_by_role("heading", name="Make another order")).to_be_visible()
```

请注意，软断言仅适用于 [`pytest-playwright`](https://pypi.org/project/pytest-playwright/)（或 [`pytest-playwright-asyncio`](https://pypi.org/project/pytest-playwright-asyncio/)）插件，版本 `0.8.0` 或更新版本。

## 自定义 Expect 消息

你可以将自定义 expect 消息指定为 `expect` 函数的第二个参数，例如：

```python
expect(page.get_by_text("Name"), "should be logged in").to_be_visible()
```

当 expect 失败时，错误将如下所示：

```bash
    def test_foobar(page: Page) -> None:
>       expect(page.get_by_text("Name"), "should be logged in").to_be_visible()
E       AssertionError: should be logged in
E       Actual value: None
E       Call log:
E       LocatorAssertions.to_be_visible with timeout 5000ms
E       waiting for get_by_text("Name")
E       waiting for get_by_text("Name")

tests/test_foobar.py:22: AssertionError
```

## 设置自定义超时

你可以为断言指定全局超时或按断言指定超时。默认超时为 5 秒。

### 全局超时

::: code-group

```python [conftest.py]
from playwright.sync_api import expect

expect.set_options(timeout=10_000)
```

:::

### 按断言超时

::: code-group

```python [test_foobar.py]
from playwright.sync_api import expect

def test_foobar(page: Page) -> None:
    expect(page.get_by_text("Name")).to_be_visible(timeout=10_000)
```

:::
