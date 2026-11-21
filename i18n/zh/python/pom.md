---
title: "页面对象模型"
---

# 页面对象模型

## 简介

大型测试套件可以进行结构化以优化编写和维护的便利性。页面对象模型是这种结构化测试套件的方法之一。

页面对象代表 Web 应用程序的一部分。电子商务 Web 应用程序可能有主页、商品列表页和结账页。每个页面都可以用页面对象模型来表示。

页面对象通过创建适合您应用程序的更高级 API 来**简化编写**，并通过在一个地方捕获元素选择器和创建可重用代码来避免重复，从而**简化维护**。

## 实现

页面对象模型包装了 Playwright 的 [Page](/python/api/class-page)。

::: code-group

```python [Async]
class SearchPage:
    def __init__(self, page):
        self.page = page
        self.search_term_input = page.locator('[aria-label="Enter your search term"]')

    async def navigate(self):
        await self.page.goto("https://bing.com")

    async def search(self, text):
        await self.search_term_input.fill(text)
        await self.search_term_input.press("Enter")
```

```python [Sync]
class SearchPage:
    def __init__(self, page):
        self.page = page
        self.search_term_input = page.locator('[aria-label="Enter your search term"]')

    def navigate(self):
        self.page.goto("https://bing.com")

    def search(self, text):
        self.search_term_input.fill(text)
        self.search_term_input.press("Enter")
```

:::

然后可以在测试中使用页面对象。

::: code-group

```python [Async]
from models.search import SearchPage

# 在测试中
page = await browser.new_page()
search_page = SearchPage(page)
await search_page.navigate()
await search_page.search("search query")
```

```python [Sync]
from models.search import SearchPage

# 在测试中
page = browser.new_page()
search_page = SearchPage(page)
search_page.navigate()
search_page.search("search query")
```

:::
