---
title: "API 测试"
---

# API 测试

## 简介

Playwright 可用于访问你的应用程序的 [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API。

有时你可能想直接从 Java 向服务器发送请求，而不加载页面并在其中运行 JavaScript 代码。
一些可能派上用场的例子：
- 测试你的服务器 API。
- 在测试中访问 Web 应用程序之前准备服务器端状态。
- 在浏览器中运行某些操作后验证服务器端后置条件。

所有这些都可以通过 [APIRequestContext](/java/api/class-apirequestcontext) 方法实现。

## 编写 API 测试

[APIRequestContext](/java/api/class-apirequestcontext) 可以通过网络发送各种 HTTP(S) 请求。

以下示例演示如何使用 Playwright 通过 [GitHub API](https://docs.github.com/en/rest) 测试 issue 的创建。测试套件将执行以下操作：
- 在运行测试之前创建一个新仓库。
- 创建几个 issue 并验证服务器状态。
- 在运行测试后删除仓库。

### 配置

GitHub API 需要授权，所以我们将为所有测试配置一次令牌。同时，我们还将设置 `baseURL` 来简化测试。

```java
package org.example;

import com.microsoft.playwright.APIRequest;
import com.microsoft.playwright.APIRequestContext;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;

import java.util.HashMap;
import java.util.Map;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TestGitHubAPI {
  private static final String API_TOKEN = System.getenv("GITHUB_API_TOKEN");

  private Playwright playwright;
  private APIRequestContext request;

  void createPlaywright() {
    playwright = Playwright.create();
  }

  void createAPIRequestContext() {
    Map<String, String> headers = new HashMap<>();
    // 根据 GitHub 指南设置此请求头。
    headers.put("Accept", "application/vnd.github.v3+json");
    // 向所有请求添加授权令牌。
    // 假设个人访问令牌在环境变量中可用。
    headers.put("Authorization", "token " + API_TOKEN);

    request = playwright.request().newContext(new APIRequest.NewContextOptions()
      // 我们发送的所有请求都发往此 API 端点。
      .setBaseURL("https://api.github.com")
      .setExtraHTTPHeaders(headers));
  }

  @BeforeAll
  void beforeAll() {
    createPlaywright();
    createAPIRequestContext();
  }

  void disposeAPIRequestContext() {
    if (request != null) {
      request.dispose();
      request = null;
    }
  }

  void closePlaywright() {
    if (playwright != null) {
      playwright.close();
      playwright = null;
    }
  }

  @AfterAll
  void afterAll() {
    disposeAPIRequestContext();
    closePlaywright();
  }
}
```

### 编写测试

现在我们已经初始化了 request 对象，可以添加一些测试来在仓库中创建新的 issue。

```java
package org.example;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.microsoft.playwright.APIRequest;
import com.microsoft.playwright.APIRequestContext;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.RequestOptions;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TestGitHubAPI {
  private static final String REPO = "test-repo-2";
  private static final String USER = System.getenv("GITHUB_USER");
  private static final String API_TOKEN = System.getenv("GITHUB_API_TOKEN");

  private Playwright playwright;
  private APIRequestContext request;

  // ...

  @Test
  void shouldCreateBugReport() {
    Map<String, String> data = new HashMap<>();
    data.put("title", "[Bug] report 1");
    data.put("body", "Bug description");
    APIResponse newIssue = request.post("/repos/" + USER + "/" + REPO + "/issues",
      RequestOptions.create().setData(data));
    assertTrue(newIssue.ok());

    APIResponse issues = request.get("/repos/" + USER + "/" + REPO + "/issues");
    assertTrue(issues.ok());
    JsonArray json = new Gson().fromJson(issues.text(), JsonArray.class);
    JsonObject issue = null;
    for (JsonElement item : json) {
      JsonObject itemObj = item.getAsJsonObject();
      if (!itemObj.has("title")) {
        continue;
      }
      if ("[Bug] report 1".equals(itemObj.get("title").getAsString())) {
        issue = itemObj;
        break;
      }
    }
    assertNotNull(issue);
    assertEquals("Bug description", issue.get("body").getAsString(), issue.toString());
  }

  @Test
  void shouldCreateFeatureRequest() {
    Map<String, String> data = new HashMap<>();
    data.put("title", "[Feature] request 1");
    data.put("body", "Feature description");
    APIResponse newIssue = request.post("/repos/" + USER + "/" + REPO + "/issues",
      RequestOptions.create().setData(data));
    assertTrue(newIssue.ok());

    APIResponse issues = request.get("/repos/" + USER + "/" + REPO + "/issues");
    assertTrue(issues.ok());
    JsonArray json = new Gson().fromJson(issues.text(), JsonArray.class);
    JsonObject issue = null;
    for (JsonElement item : json) {
      JsonObject itemObj = item.getAsJsonObject();
      if (!itemObj.has("title")) {
        continue;
      }
      if ("[Feature] request 1".equals(itemObj.get("title").getAsString())) {
        issue = itemObj;
        break;
      }
    }
    assertNotNull(issue);
    assertEquals("Feature description", issue.get("body").getAsString(), issue.toString());
  }
}

```

### 设置和清理

这些测试假设仓库已存在。你可能想在运行测试之前创建一个新仓库，并在之后删除它。使用 `@BeforeAll` 和 `@AfterAll` 钩子来实现。

```java
public class TestGitHubAPI {
  // ...

  void createTestRepository() {
    APIResponse newRepo = request.post("/user/repos",
      RequestOptions.create().setData(Collections.singletonMap("name", REPO)));
    assertTrue(newRepo.ok(), newRepo.text());
  }

  @BeforeAll
  void beforeAll() {
    createPlaywright();
    createAPIRequestContext();
    createTestRepository();
  }

  void deleteTestRepository() {
    if (request != null) {
      APIResponse deletedRepo = request.delete("/repos/" + USER + "/" + REPO);
      assertTrue(deletedRepo.ok());
    }
  }
  // ...

  @AfterAll
  void afterAll() {
    deleteTestRepository();
    disposeAPIRequestContext();
    closePlaywright();
  }
}
```

### 完整测试示例

以下是 API 测试的完整示例：

```java
package org.example;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.microsoft.playwright.APIRequest;
import com.microsoft.playwright.APIRequestContext;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.RequestOptions;
import org.junit.jupiter.api.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TestGitHubAPI {
  private static final String REPO = "test-repo-2";
  private static final String USER = System.getenv("GITHUB_USER");
  private static final String API_TOKEN = System.getenv("GITHUB_API_TOKEN");

  private Playwright playwright;
  private APIRequestContext request;

  void createPlaywright() {
    playwright = Playwright.create();
  }

  void createAPIRequestContext() {
    Map<String, String> headers = new HashMap<>();
    // 根据 GitHub 指南设置此请求头。
    headers.put("Accept", "application/vnd.github.v3+json");
    // 向所有请求添加授权令牌。
    // 假设个人访问令牌在环境变量中可用。
    headers.put("Authorization", "token " + API_TOKEN);

    request = playwright.request().newContext(new APIRequest.NewContextOptions()
      // 我们发送的所有请求都发往此 API 端点。
      .setBaseURL("https://api.github.com")
      .setExtraHTTPHeaders(headers));
  }

  void createTestRepository() {
    APIResponse newRepo = request.post("/user/repos",
      RequestOptions.create().setData(Collections.singletonMap("name", REPO)));
    assertTrue(newRepo.ok(), newRepo.text());
  }

  @BeforeAll
  void beforeAll() {
    createPlaywright();
    createAPIRequestContext();
    createTestRepository();
  }

  void deleteTestRepository() {
    if (request != null) {
      APIResponse deletedRepo = request.delete("/repos/" + USER + "/" + REPO);
      assertTrue(deletedRepo.ok());
    }
  }

  void disposeAPIRequestContext() {
    if (request != null) {
      request.dispose();
      request = null;
    }
  }

  void closePlaywright() {
    if (playwright != null) {
      playwright.close();
      playwright = null;
    }
  }

  @AfterAll
  void afterAll() {
    deleteTestRepository();
    disposeAPIRequestContext();
    closePlaywright();
  }

  @Test
  void shouldCreateBugReport() {
    Map<String, String> data = new HashMap<>();
    data.put("title", "[Bug] report 1");
    data.put("body", "Bug description");
    APIResponse newIssue = request.post("/repos/" + USER + "/" + REPO + "/issues",
      RequestOptions.create().setData(data));
    assertTrue(newIssue.ok());

    APIResponse issues = request.get("/repos/" + USER + "/" + REPO + "/issues");
    assertTrue(issues.ok());
    JsonArray json = new Gson().fromJson(issues.text(), JsonArray.class);
    JsonObject issue = null;
    for (JsonElement item : json) {
      JsonObject itemObj = item.getAsJsonObject();
      if (!itemObj.has("title")) {
        continue;
      }
      if ("[Bug] report 1".equals(itemObj.get("title").getAsString())) {
        issue = itemObj;
        break;
      }
    }
    assertNotNull(issue);
    assertEquals("Bug description", issue.get("body").getAsString(), issue.toString());
  }

  @Test
  void shouldCreateFeatureRequest() {
    Map<String, String> data = new HashMap<>();
    data.put("title", "[Feature] request 1");
    data.put("body", "Feature description");
    APIResponse newIssue = request.post("/repos/" + USER + "/" + REPO + "/issues",
      RequestOptions.create().setData(data));
    assertTrue(newIssue.ok());

    APIResponse issues = request.get("/repos/" + USER + "/" + REPO + "/issues");
    assertTrue(issues.ok());
    JsonArray json = new Gson().fromJson(issues.text(), JsonArray.class);
    JsonObject issue = null;
    for (JsonElement item : json) {
      JsonObject itemObj = item.getAsJsonObject();
      if (!itemObj.has("title")) {
        continue;
      }
      if ("[Feature] request 1".equals(itemObj.get("title").getAsString())) {
        issue = itemObj;
        break;
      }
    }
    assertNotNull(issue);
    assertEquals("Feature description", issue.get("body").getAsString(), issue.toString());
  }
}
```

查看实验性的 [JUnit 集成](./junit.md)以自动初始化 Playwright 对象等。

## 通过 API 调用准备服务器状态

以下测试通过 API 创建一个新 issue，然后导航到项目中所有 issue 的列表，检查它是否出现在列表顶部。检查使用 [LocatorAssertions](/java/api/class-locatorassertions) 执行。

```java
public class TestGitHubAPI {
  @Test
  void lastCreatedIssueShouldBeFirstInTheList() {
    Map<String, String> data = new HashMap<>();
    data.put("title", "[Feature] request 1");
    data.put("body", "Feature description");
    APIResponse newIssue = request.post("/repos/" + USER + "/" + REPO + "/issues",
      RequestOptions.create().setData(data));
    assertTrue(newIssue.ok());

    try (Browser browser = playwright.chromium().launch()) {
      Page page = browser.newPage();
      page.navigate("https://github.com/" + USER + "/" + REPO + "/issues");
      Locator firstIssue = page.locator("a[data-hovercard-type='issue']").first();
      assertThat(firstIssue).hasText("[Feature] request 1");
    }
  }
}
```

## 运行用户操作后检查服务器状态

以下测试通过浏览器中的用户界面创建一个新 issue，然后通过 API 检查它是否被创建：

```java
public class TestGitHubAPI {
  @Test
  void lastCreatedIssueShouldBeOnTheServer() {
    try (Browser browser = playwright.chromium().launch()) {
      Page page = browser.newPage();
      page.navigate("https://github.com/" + USER + "/" + REPO + "/issues");
      page.locator("text=New Issue").click();
      page.locator("[aria-label='Title']").fill("Bug report 1");
      page.locator("[aria-label='Comment body']").fill("Bug description");
      page.locator("text=Submit new issue").click();
      String issueId = page.url().substring(page.url().lastIndexOf('/'));

      APIResponse newIssue = request.get("https://github.com/" + USER + "/" + REPO + "/issues/" + issueId);
      assertThat(newIssue).isOK();
      assertTrue(newIssue.text().contains("Bug report 1"));
    }
  }
}
```

## 重用认证状态

Web 应用使用基于 cookie 或基于令牌的身份认证，其中已认证状态存储为 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)。
Playwright 提供了 [`apiRequestContext.storageState()`](/java/api/class-apirequestcontext#api-request-context-storage-state) 方法，可用于从已认证的上下文中检索存储状态，然后使用该状态创建新上下文。

存储状态在 [BrowserContext](/java/api/class-browsercontext) 和 [APIRequestContext](/java/api/class-apirequestcontext) 之间是可互换的。你可以使用它通过 API 调用登录，然后创建一个已包含 cookie 的新上下文。
以下代码片段从已认证的 [APIRequestContext](/java/api/class-apirequestcontext) 检索状态，并使用该状态创建一个新的 [BrowserContext](/java/api/class-browsercontext)。

```java
APIRequestContext requestContext = playwright.request().newContext(
  new APIRequest.NewContextOptions().setHttpCredentials("user", "passwd"));
requestContext.get("https://api.example.com/login");
// 将存储状态保存到变量中。
String state = requestContext.storageState();

// 使用保存的存储状态创建新上下文。
BrowserContext context = browser.newContext(new Browser.NewContextOptions().setStorageState(state));
```
