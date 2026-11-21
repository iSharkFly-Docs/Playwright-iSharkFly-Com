---
title: "断言"
---

# 断言

## 简介

Playwright 包含针对 Web 的特定断言，这些断言会自动重试，直到满足预期条件。请考虑以下示例：

```java
assertThat(page.getByTestId("status")).hasText("Submitted");
```

Playwright 将重新测试具有测试 ID `status` 的元素，直到它具有 `"Submitted"` 文本。它将反复重新获取元素并检查，直到满足条件或超时。

默认情况下，断言的超时时间为 5 秒。

## 自动重试断言

以下断言将重试，直到断言通过或达到断言超时。

| 断言 | 描述 |
| :- | :- |
| [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached) | 元素已附加 |
| [`locatorAssertions.isChecked()`](/java/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已选中 |
| [`locatorAssertions.isDisabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-disabled) | 元素已禁用 |
| [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable) | 元素可编辑 |
| [`locatorAssertions.isEmpty()`](/java/api/class-locatorassertions#locator-assertions-to-be-empty) | 容器为空 |
| [`locatorAssertions.isEnabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-enabled) | 元素已启用 |
| [`locatorAssertions.isFocused()`](/java/api/class-locatorassertions#locator-assertions-to-be-focused) | 元素已聚焦 |
| [`locatorAssertions.isHidden()`](/java/api/class-locatorassertions#locator-assertions-to-be-hidden) | 元素不可见 |
| [`locatorAssertions.isInViewport()`](/java/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | 元素与视口相交 |
| [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`locatorAssertions.containsClass()`](/java/api/class-locatorassertions#locator-assertions-to-contain-class) | 元素具有指定的 CSS 类 |
| [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`locatorAssertions.hasAccessibleDescription()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-description) | 元素具有匹配的[无障碍描述](https://w3c.github.io/accname/#dfn-accessible-description) |
| [`locatorAssertions.hasAccessibleName()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-name) | 元素具有匹配的[无障碍名称](https://w3c.github.io/accname/#dfn-accessible-name) |
| [`locatorAssertions.hasAttribute()`](/java/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有 DOM 属性 |
| [`locatorAssertions.hasClass()`](/java/api/class-locatorassertions#locator-assertions-to-have-class) | 元素具有 class 属性 |
| [`locatorAssertions.hasCount()`](/java/api/class-locatorassertions#locator-assertions-to-have-count) | 列表具有确切数量的子元素 |
| [`locatorAssertions.hasCSS()`](/java/api/class-locatorassertions#locator-assertions-to-have-css) | 元素具有 CSS 属性 |
| [`locatorAssertions.hasId()`](/java/api/class-locatorassertions#locator-assertions-to-have-id) | 元素具有 ID |
| [`locatorAssertions.hasJSProperty()`](/java/api/class-locatorassertions#locator-assertions-to-have-js-property) | 元素具有 JavaScript 属性 |
| [`locatorAssertions.hasRole()`](/java/api/class-locatorassertions#locator-assertions-to-have-role) | 元素具有特定的 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`locatorAssertions.hasValue()`](/java/api/class-locatorassertions#locator-assertions-to-have-value) | 输入框具有值 |
| [`locatorAssertions.hasValues()`](/java/api/class-locatorassertions#locator-assertions-to-have-values) | 下拉框已选择选项 |
| [`locatorAssertions.matchesAriaSnapshot()`](/java/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) | 元素匹配提供的 Aria 快照 |
| [`pageAssertions.hasTitle()`](/java/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`pageAssertions.hasURL()`](/java/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |
| [`apiResponseAssertions.isOK()`](/java/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | 响应具有 OK 状态 |

## 设置自定义超时

您可以全局或按断言指定自定义超时。默认超时为 5 秒。

### 全局超时

```java
import com.microsoft.playwright.assertions.PlaywrightAssertions;

PlaywrightAssertions.setDefaultAssertionTimeout(10_000);
```

### 按断言超时

```java
import com.microsoft.playwright.assertions.LocatorAssertions;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

assertThat(page.getByText("Name")).isVisible(
    new LocatorAssertions.IsVisibleOptions().setTimeout(10_000));
```
