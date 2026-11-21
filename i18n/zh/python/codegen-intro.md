---
title: "生成测试"
---

# 生成测试

## 介绍

Playwright 可以自动生成测试，为开始测试提供了一种快速方法。Codegen 会打开一个浏览器窗口用于交互，以及 Playwright Inspector 用于录制、复制和管理生成的测试。

**您将学习**
- [如何录制测试](/codegen.md#recording-a-test)
- [如何生成定位器](/codegen.md#generating-locators)

## 运行 Codegen

使用 `codegen` 命令运行测试生成器，后面跟随您要为其生成测试的网站 URL。URL 是可选的，如果省略，可以直接在浏览器窗口中添加。

```bash
playwright codegen demo.playwright.dev/todomvc
```

### 录制测试

运行 `codegen` 并在浏览器中执行操作。Playwright 会自动为您的交互生成代码。Codegen 分析渲染的页面并推荐最佳定位器，优先使用角色、文本和测试 id 定位器。当多个元素匹配定位器时，生成器会改进定位器以唯一标识目标元素，减少测试失败和不稳定性。

使用测试生成器，您可以录制：
* 通过与页面交互进行点击或填充等操作
* 通过点击工具栏图标然后点击页面元素进行断言。您可以选择：
  * `'assert visibility'` 断言元素可见
  * `'assert text'` 断言元素包含特定文本
  * `'assert value'` 断言元素具有特定值

###### 
![录制测试](/images/getting-started/record-test-python.png)

###### 
完成页面交互后，按 `'record'` 按钮停止录制，并使用 `'copy'` 按钮将生成的代码复制到编辑器中。

使用 `'clear'` 按钮清除代码并重新开始录制。完成后，关闭 Playwright Inspector 窗口或停止终端命令。

要了解更多关于生成测试的信息，请查看我们关于 [Codegen](./codegen.md) 的详细指南。

### 生成定位器

您可以使用测试生成器生成[定位器](/locators.md)。
* 按 `'Record'` 按钮停止录制，然后会出现 `'Pick Locator'` 按钮
* 点击 `'Pick Locator'` 按钮，将鼠标悬停在浏览器窗口中的元素上，查看每个元素下方高亮显示的定位器
* 点击要定位的元素，该定位器的代码将出现在 Pick Locator 按钮旁边的定位器游乐场中
* 在定位器游乐场中编辑定位器以进行微调，并查看浏览器窗口中高亮显示的匹配元素
* 使用复制按钮复制定位器并粘贴到代码中

###### 
![选择定位器](/images/getting-started/pick-locator-python.png)

### 模拟

您可以使用模拟来生成特定视口、设备、配色方案、地理位置、语言或时区的测试。测试生成器还可以保持已认证的状态。查看[测试生成器](./codegen.md#emulation)指南了解更多信息。

## 下一步
- [查看测试的跟踪](./trace-viewer-intro.md)
