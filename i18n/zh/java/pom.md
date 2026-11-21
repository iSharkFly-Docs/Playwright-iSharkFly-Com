---
title: "页面对象模型"
---

# 页面对象模型

## 简介

大型测试套件可以通过结构化来优化编写和维护的便利性。页面对象模型是一种用于构建测试套件的方法。

页面对象代表 Web 应用程序的一部分。电子商务 Web 应用程序可能有主页、列表页和结账页。每个页面都可以用页面对象模型来表示。

页面对象通过创建适合你应用程序的更高级别 API 来**简化编写**，并通过将元素选择器集中在一处并创建可重用代码来避免重复，从而**简化维护**。

## 实现

页面对象模型封装了 Playwright [Page](/java/api/class-page)。

::: code-group

```java [models/SearchPage.java]
package models;

import com.microsoft.playwright;

public class SearchPage {
  private final Page page;
  private final Locator searchTermInput;

  public SearchPage(Page page) {
    this.page = page;
    this.searchTermInput = page.locator("[aria-label='Enter your search term']");
  }

  public void navigate() {
    page.navigate("https://bing.com");
  }

  public void search(String text) {
    searchTermInput.fill(text);
    searchTermInput.press("Enter");
  }
}
```

:::

然后可以在测试中使用页面对象。

```java
import models.SearchPage;
import com.microsoft.playwright.*;
// ...

// 在测试中
Page page = browser.newPage();
SearchPage searchPage = new SearchPage(page);
searchPage.navigate();
searchPage.search("search query");
```
