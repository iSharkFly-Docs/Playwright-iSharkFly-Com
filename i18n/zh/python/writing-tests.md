---
title: "编写测试"
---

# 编写测试

## 介绍

Playwright 测试非常简单，它们
- **执行操作**，并且
- **对照预期断言状态**。

在执行操作之前无需等待任何内容：Playwright 会自动等待广泛的[可操作性](./actionability.md)检查通过后再执行每个操作。

执行检查时也无需处理竞态条件 - Playwright 断言的设计方式使它们描述的是最终需要满足的预期。

就是这样！这些设计选择让 Playwright 用户可以完全忘记测试中不稳定的超时和竞态检查。

**你将学到**
- [如何编写第一个测试](/python/writing-tests.md#first-test)
- [如何执行操作](/python/writing-tests.md#actions)
- [如何使用断言](/python/writing-tests.md#assertions)
- [测试如何隔离运行](/python/writing-tests.md#test-isolation)
- [如何使用测试钩子](/python/writing-tests.md#using-fixtures)

## 第一个测试

看看下面的示例，了解如何编写测试。注意文件名遵循 `test_` 前缀约定，每个测试名称也是如此。

::: code-group

```python [test_example.py]
import re
from playwright.sync_api import Page, expect

def test_has_title(page: Page):
    page.goto("https://playwright.dev/")

    # 期望标题"包含"一个子字符串。
    expect(page).to_have_title(re.compile("Playwright"))

def test_get_started_link(page: Page):
    page.goto("https://playwright.dev/")

    # 点击"开始使用"链接。
    page.get_by_role("link", name="Get started").click()

    # 期望页面有一个名为 Installation 的标题。
    expect(page.get_by_role("heading", name="Installation")).to_be_visible()
```

:::

## 操作

### 导航

大多数测试将从导航页面到 URL 开始。之后，测试将能够与页面元素进行交互。

```python
page.goto("https://playwright.dev/")
```

Playwright 将等待页面达到加载状态后再继续。了解更多关于 [`page.goto()`](/python/api/class-page#page-goto) 选项的信息。

### 交互

执行操作从定位元素开始。Playwright 使用[定位器 API](./locators.md)来实现这一点。定位器代表一种在任何时刻在页面上查找元素的方法，了解更多关于可用的[不同类型](./locators.md)定位器的信息。Playwright 会在执行操作之前等待元素变为[可操作](./actionability.md)状态，因此无需等待它变为可用。

```python
# 创建一个定位器。
get_started = page.get_by_role("link", name="Get started")

# 点击它。
get_started.click()
```

在大多数情况下，它将写成一行：

```python
page.get_by_role("link", name="Get started").click()
```

### 基本操作

这是最常用的 Playwright 操作列表。请注意还有更多操作，请务必查看 [Locator API](./api/class-locator.md) 部分以了解更多信息。

| 操作 | 描述 |
| :- | :- |
| [`locator.check()`](/python/api/class-locator#locator-check) | 勾选输入复选框 |
| [`locator.click()`](/python/api/class-locator#locator-click) | 点击元素 |
| [`locator.uncheck()`](/python/api/class-locator#locator-uncheck) | 取消勾选输入复选框 |
| [`locator.hover()`](/python/api/class-locator#locator-hover) | 将鼠标悬停在元素上 |
| [`locator.fill()`](/python/api/class-locator#locator-fill) | 填写表单字段，输入文本 |
| [`locator.focus()`](/python/api/class-locator#locator-focus) | 聚焦元素 |
| [`locator.press()`](/python/api/class-locator#locator-press) | 按下单个键 |
| [`locator.set_input_files()`](/python/api/class-locator#locator-set-input-files) | 选择要上传的文件 |
| [`locator.select_option()`](/python/api/class-locator#locator-select-option) | 在下拉菜单中选择选项 |

## 断言

Playwright 包含[断言](./test-assertions.md)，它们会等待直到预期条件满足。使用这些断言可以使测试稳定且有弹性。例如，此代码将等待页面获得包含"Playwright"的标题：

```python
import re
from playwright.sync_api import expect

expect(page).to_have_title(re.compile("Playwright"))
```

以下是最常用的异步断言列表。请注意还有[更多](./test-assertions.md)断言需要了解：

| 断言 | 描述 |
| :- | :- |
| [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已勾选 |
| [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled) | 控件已启用 |
| [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`locator_assertions.to_contain_text()`](/python/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有属性 |
| [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count) | 元素列表具有给定长度 |
| [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value) | 输入元素具有值 |
| [`page_assertions.to_have_title()`](/python/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`page_assertions.to_have_url()`](/python/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |

### 测试隔离

Playwright Pytest 插件基于测试夹具的概念，例如[内置的 page 夹具](./test-runners.md)，它被传递给你的测试。由于[浏览器上下文](./browser-contexts)，页面在测试之间是[隔离的](./browser-contexts)，这相当于一个全新的浏览器配置文件，每个测试都获得一个全新的环境，即使多个测试在单个浏览器中运行。

::: code-group

```python [test_example.py]
from playwright.sync_api import Page

def test_example_test(page: Page):
  pass
  # "page" 属于一个隔离的 BrowserContext，专门为此测试创建。

def test_another_test(page: Page):
  pass
  # 第二个测试中的 "page" 与第一个测试完全隔离。
```

:::

### 使用夹具

你可以使用各种[夹具](https://docs.pytest.org/en/6.2.x/fixture.html#autouse-fixtures-fixtures-you-don-t-have-to-request)在测试之前或之后执行代码，并在它们之间共享对象。带有 autouse 的 `function` 作用域夹具的行为类似于 beforeEach/afterEach。带有 autouse 的 `module` 作用域夹具的行为类似于 beforeAll/afterAll，在所有测试之前和之后运行。

::: code-group

```python [test_example.py]
import pytest
from playwright.sync_api import Page, expect

@pytest.fixture(scope="function", autouse=True)
def before_each_after_each(page: Page):
    
    print("测试运行前")

    # 在每个测试之前转到起始 URL。
    page.goto("https://playwright.dev/")
    yield
    
    print("测试运行后")

def test_main_navigation(page: Page):
    # 断言使用 expect API。
    expect(page).to_have_url("https://playwright.dev/")
```

:::

## 下一步
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的追踪记录](./trace-viewer-intro.md)
- [使用 GitHub Actions 在 CI 上运行测试](./ci-intro.md)
