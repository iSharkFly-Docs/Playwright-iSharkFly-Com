---
title: "断言"
---

# 断言

## 简介

Playwright 包含 Web 特定的断言，它们会自动重试直到满足预期条件。考虑以下示例：

```csharp
await Expect(Page.GetByTestId("status")).ToHaveTextAsync("Submitted");
```

Playwright 将重新测试测试 ID 为 `status` 的元素，直到它具有 `"Submitted"` 文本。它将重复获取元素并检查，直到满足条件或达到超时。

默认情况下，断言的超时时间为 5 秒。

## 自动重试的断言

以下断言将重试直到断言通过或达到断言超时。

| 断言 | 描述 |
| :- | :- |
| [`LocatorAssertions.ToBeAttachedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-attached) | 元素已附加 |
| [`LocatorAssertions.ToBeCheckedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已勾选 |
| [`LocatorAssertions.ToBeDisabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-disabled) | 元素已禁用 |
| [`LocatorAssertions.ToBeEditableAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-editable) | 元素可编辑 |
| [`LocatorAssertions.ToBeEmptyAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-empty) | 容器为空 |
| [`LocatorAssertions.ToBeEnabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-enabled) | 元素已启用 |
| [`LocatorAssertions.ToBeFocusedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-focused) | 元素已聚焦 |
| [`LocatorAssertions.ToBeHiddenAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-hidden) | 元素不可见 |
| [`LocatorAssertions.ToBeInViewportAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | 元素与视口相交 |
| [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`LocatorAssertions.ToContainClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-class) | 元素具有指定的 CSS 类 |
| [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`LocatorAssertions.ToHaveAccessibleDescriptionAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-description) | 元素具有匹配的[可访问描述](https://w3c.github.io/accname/#dfn-accessible-description) |
| [`LocatorAssertions.ToHaveAccessibleNameAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-name) | 元素具有匹配的[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name) |
| [`LocatorAssertions.ToHaveAttributeAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有 DOM 属性 |
| [`LocatorAssertions.ToHaveClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-class) | 元素具有 class 属性 |
| [`LocatorAssertions.ToHaveCountAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-count) | 列表具有精确的子元素数量 |
| [`LocatorAssertions.ToHaveCSSAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-css) | 元素具有 CSS 属性 |
| [`LocatorAssertions.ToHaveIdAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-id) | 元素具有 ID |
| [`LocatorAssertions.ToHaveJSPropertyAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-js-property) | 元素具有 JavaScript 属性 |
| [`LocatorAssertions.ToHaveRoleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-role) | 元素具有特定的 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value) | 输入具有值 |
| [`LocatorAssertions.ToHaveValuesAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-values) | 选择框已选择选项 |
| [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) | 元素匹配提供的 Aria 快照 |
| [`PageAssertions.ToHaveTitleAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`PageAssertions.ToHaveURLAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |
| [`ApiResponseAssertions.ToBeOKAsync()`](/dotnet/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | 响应具有 OK 状态 |

## Expect.ToPassAsync

尽可能优先使用自动重试的断言。对于更复杂的检查，使用 [`FunctionAssertions.ToPassAsync()`](/dotnet/api/class-functionassertions#function-assertions-to-pass) 重试代码块直到通过。

```csharp
await Expect(async () =>
{
    var response = await Page.APIRequest.GetAsync("https://api.example.com");
    Assert.AreEqual(200, response.Status);
}).ToPassAsync();
```

你还可以指定自定义超时和重试间隔：

```csharp
await Expect(async () =>
{
    var response = await Page.APIRequest.GetAsync("https://api.example.com");
    Assert.AreEqual(200, response.Status);
}).ToPassAsync(new()
{
    // 探测，等待 1 秒，探测，等待 2 秒，探测，等待 10 秒，探测，等待 10 秒，探测
    // ... 默认为 [100, 250, 500, 1000]。
    Intervals = [1_000, 2_000, 10_000],
    Timeout = 60_000,
});
```

默认情况下，`ToPassAsync` 重试 30 秒。`SetDefaultExpectTimeout` 不会更改此超时，请改用 `SetDefaultExpectToPassTimeout`：

```csharp
SetDefaultExpectToPassTimeout(60_000);
```

## 自定义 Expect 消息

你可以指定自定义 expect 消息作为 `expect` 函数的第二个参数，例如：

```csharp
await Expect(Page.GetByText("Name"), "should be logged in").ToBeVisibleAsync();
```

当 expect 失败时，错误将如下所示：

```bash
Microsoft.Playwright.PlaywrightAssertionException : should be logged in

Locator expected to be visible
Call log:
- Expect "ToBeVisibleAsync" with timeout 5000ms
- waiting for GetByText("Name")
```

## 设置自定义超时

你可以全局或按断言指定断言的自定义超时。默认超时为 5 秒。

### 全局超时

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class Tests : PageTest
{
    [OneTimeSetUp]
    public void GlobalSetup()
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
}
```

:::

</TabItem>

<TabItem value="mstest">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

[TestClass]
public class UnitTest1 : PageTest
{
    [ClassInitialize]
    public static void GlobalSetup(TestContext context)
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
}
```

:::

</TabItem>

<TabItem value="xunit">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    UnitTest1()
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
}
```

:::

</TabItem>

<TabItem value="xunit-v3">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    UnitTest1()
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
}
```

:::

</TabItem>

</Tabs>

### 按断言超时

::: code-group

```csharp [UnitTest1.cs]
await Expect(Page.GetByText("Name")).ToBeVisibleAsync(new() { Timeout = 10_000 });
```

:::
