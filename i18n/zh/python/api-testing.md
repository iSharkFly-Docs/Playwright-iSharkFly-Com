---
title: "API 测试"
---

# API 测试

## 简介

Playwright 可用于访问你的应用程序的 [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API。

有时你可能希望直接从 Python 向服务器发送请求，而无需加载页面并在其中运行 JavaScript 代码。以下是一些可能有用的场景：
- 测试你的服务器 API。
- 在测试中访问 Web 应用程序之前准备服务器端状态。
- 在浏览器中执行某些操作后验证服务器端后置条件。

所有这些都可以通过 [APIRequestContext](/python/api/class-apirequestcontext) 方法实现。

以下示例依赖于 [`pytest-playwright`](./test-runners.md) 包，该包将 Playwright fixture 添加到 Pytest 测试运行器。

## 编写 API 测试

[APIRequestContext](/python/api/class-apirequestcontext) 可以通过网络发送各种 HTTP(S) 请求。

以下示例演示如何使用 Playwright 通过 [GitHub API](https://docs.github.com/en/rest) 测试 issue 创建。测试套件将执行以下操作：
- 在运行测试之前创建一个新的仓库。
- 创建几个 issue 并验证服务器状态。
- 运行测试之后删除仓库。

### 配置

GitHub API 需要授权，因此我们将为所有测试配置一次令牌。同时，我们还将设置 `baseURL` 以简化测试。

```python
import os
from typing import Generator

import pytest
from playwright.sync_api import Playwright, APIRequestContext

GITHUB_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
assert GITHUB_API_TOKEN, "GITHUB_API_TOKEN is not set"


@pytest.fixture(scope="session")
def api_request_context(
    playwright: Playwright,
) -> Generator[APIRequestContext, None, None]:
    headers = {
        # 我们根据 GitHub 指南设置此头。
        "Accept": "application/vnd.github.v3+json",
        # 为所有请求添加授权令牌。
        # 假设个人访问令牌在环境变量中可用。
        "Authorization": f"token {GITHUB_API_TOKEN}",
    }
    request_context = playwright.request.new_context(
        base_url="https://api.github.com", extra_http_headers=headers
    )
    yield request_context
    request_context.dispose()

```

### 编写测试

现在我们已经初始化了请求对象，可以添加一些将在仓库中创建新 issue 的测试。

```python
import os
from typing import Generator

import pytest
from playwright.sync_api import Playwright, APIRequestContext

GITHUB_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
assert GITHUB_API_TOKEN, "GITHUB_API_TOKEN is not set"

GITHUB_USER = os.getenv("GITHUB_USER")
assert GITHUB_USER, "GITHUB_USER is not set"

GITHUB_REPO = "test"

# ...

def test_should_create_bug_report(api_request_context: APIRequestContext) -> None:
    data = {
        "title": "[Bug] report 1",
        "body": "Bug description",
    }
    new_issue = api_request_context.post(f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues", data=data)
    assert new_issue.ok

    issues = api_request_context.get(f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues")
    assert issues.ok
    issues_response = issues.json()
    issue = list(filter(lambda issue: issue["title"] == "[Bug] report 1", issues_response))[0]
    assert issue
    assert issue["body"] == "Bug description"

def test_should_create_feature_request(api_request_context: APIRequestContext) -> None:
    data = {
        "title": "[Feature] request 1",
        "body": "Feature description",
    }
    new_issue = api_request_context.post(f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues", data=data)
    assert new_issue.ok

    issues = api_request_context.get(f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues")
    assert issues.ok
    issues_response = issues.json()
    issue = list(filter(lambda issue: issue["title"] == "[Feature] request 1", issues_response))[0]
    assert issue
    assert issue["body"] == "Feature description"
```

### 设置和拆卸

这些测试假设仓库已存在。你可能希望在运行测试之前创建一个新仓库，并在之后删除它。使用 [session fixture](https://docs.pytest.org/en/stable/how-to/fixtures.html#fixture-scopes) 来实现。`yield` 之前的部分是 before all，之后的部分是 after all。

```python
# ...
@pytest.fixture(scope="session", autouse=True)
def create_test_repository(
    api_request_context: APIRequestContext,
) -> Generator[None, None, None]:
    # Before all
    new_repo = api_request_context.post("/user/repos", data={"name": GITHUB_REPO})
    assert new_repo.ok
    yield
    # After all
    deleted_repo = api_request_context.delete(f"/repos/{GITHUB_USER}/{GITHUB_REPO}")
    assert deleted_repo.ok
```

### 完整测试示例

这是 API 测试的完整示例：

```python
from enum import auto
import os
from typing import Generator

import pytest
from playwright.sync_api import Playwright, Page, APIRequestContext, expect

GITHUB_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
assert GITHUB_API_TOKEN, "GITHUB_API_TOKEN is not set"

GITHUB_USER = os.getenv("GITHUB_USER")
assert GITHUB_USER, "GITHUB_USER is not set"

GITHUB_REPO = "test"


@pytest.fixture(scope="session")
def api_request_context(
    playwright: Playwright,
) -> Generator[APIRequestContext, None, None]:
    headers = {
        # 我们根据 GitHub 指南设置此头。
        "Accept": "application/vnd.github.v3+json",
        # 为所有请求添加授权令牌。
        # 假设个人访问令牌在环境变量中可用。
        "Authorization": f"token {GITHUB_API_TOKEN}",
    }
    request_context = playwright.request.new_context(
        base_url="https://api.github.com", extra_http_headers=headers
    )
    yield request_context
    request_context.dispose()


@pytest.fixture(scope="session", autouse=True)
def create_test_repository(
    api_request_context: APIRequestContext,
) -> Generator[None, None, None]:
    # Before all
    new_repo = api_request_context.post("/user/repos", data={"name": GITHUB_REPO})
    assert new_repo.ok
    yield
    # After all
    deleted_repo = api_request_context.delete(f"/repos/{GITHUB_USER}/{GITHUB_REPO}")
    assert deleted_repo.ok


def test_should_create_bug_report(api_request_context: APIRequestContext) -> None:
    data = {
        "title": "[Bug] report 1",
        "body": "Bug description",
    }
    new_issue = api_request_context.post(
        f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues", data=data
    )
    assert new_issue.ok

    issues = api_request_context.get(f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues")
    assert issues.ok
    issues_response = issues.json()
    issue = list(
        filter(lambda issue: issue["title"] == "[Bug] report 1", issues_response)
    )[0]
    assert issue
    assert issue["body"] == "Bug description"


def test_should_create_feature_request(api_request_context: APIRequestContext) -> None:
    data = {
        "title": "[Feature] request 1",
        "body": "Feature description",
    }
    new_issue = api_request_context.post(
        f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues", data=data
    )
    assert new_issue.ok

    issues = api_request_context.get(f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues")
    assert issues.ok
    issues_response = issues.json()
    issue = list(
        filter(lambda issue: issue["title"] == "[Feature] request 1", issues_response)
    )[0]
    assert issue
    assert issue["body"] == "Feature description"
```

## 通过 API 调用准备服务器状态

以下测试通过 API 创建一个新 issue，然后导航到项目的所有 issue 列表，检查它是否出现在列表顶部。检查使用 [LocatorAssertions](/python/api/class-locatorassertions) 执行。

```python
def test_last_created_issue_should_be_first_in_the_list(api_request_context: APIRequestContext, page: Page) -> None:
    def create_issue(title: str) -> None:
        data = {
            "title": title,
            "body": "Feature description",
        }
        new_issue = api_request_context.post(
            f"/repos/{GITHUB_USER}/{GITHUB_REPO}/issues", data=data
        )
        assert new_issue.ok
    create_issue("[Feature] request 1")
    create_issue("[Feature] request 2")
    page.goto(f"https://github.com/{GITHUB_USER}/{GITHUB_REPO}/issues")
    first_issue = page.locator("a[data-hovercard-type='issue']").first
    expect(first_issue).to_have_text("[Feature] request 2")
```

## 运行用户操作后检查服务器状态

以下测试通过浏览器中的用户界面创建一个新 issue，然后通过 API 检查它是否已创建：

```python
def test_last_created_issue_should_be_on_the_server(api_request_context: APIRequestContext, page: Page) -> None:
    page.goto(f"https://github.com/{GITHUB_USER}/{GITHUB_REPO}/issues")
    page.locator("text=New issue").click()
    page.locator("[aria-label='Title']").fill("Bug report 1")
    page.locator("[aria-label='Comment body']").fill("Bug description")
    page.locator("text=Submit new issue").click()
    issue_id = page.url.split("/")[-1]

    new_issue = api_request_context.get(f"https://github.com/{GITHUB_USER}/{GITHUB_REPO}/issues/{issue_id}")
    assert new_issue.ok
    assert new_issue.json()["title"] == "[Bug] report 1"
    assert new_issue.json()["body"] == "Bug description"
```

## 重用身份认证状态

Web 应用程序使用基于 cookie 或基于令牌的身份认证，其中已认证的状态存储为 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)。Playwright 提供 [`api_request_context.storage_state()`](/python/api/class-apirequestcontext#api-request-context-storage-state) 方法，可用于从已认证的上下文检索存储状态，然后创建具有该状态的新上下文。

存储状态在 [BrowserContext](/python/api/class-browsercontext) 和 [APIRequestContext](/python/api/class-apirequestcontext) 之间是可互换的。你可以使用它通过 API 调用登录，然后创建一个已经包含 cookie 的新上下文。以下代码片段从已认证的 [APIRequestContext](/python/api/class-apirequestcontext) 检索状态并创建具有该状态的新 [BrowserContext](/python/api/class-browsercontext)。

```python
request_context = playwright.request.new_context(http_credentials={"username": "test", "password": "test"})
request_context.get("https://api.example.com/login")
# 将存储状态保存到变量中。
state = request_context.storage_state()

# 使用保存的存储状态创建新上下文。
context = browser.new_context(storage_state=state)
```
