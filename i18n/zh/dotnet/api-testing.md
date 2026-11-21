---
title: "API 测试"
---

# API 测试

## 简介

Playwright 可用于访问应用程序的 [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API。

有时你可能想直接从 .NET 向服务器发送请求，而不需要加载页面并在其中运行 JavaScript 代码。这在以下几种情况下可能会派上用场：
- 测试你的服务器 API。
- 在测试中访问 Web 应用程序之前准备服务器端状态。
- 在浏览器中运行一些操作后验证服务器端的后置条件。

所有这些都可以通过 [APIRequestContext](/dotnet/api/class-apirequestcontext) 方法实现。

以下示例依赖于 MSTest、NUnit、xUnit 或 xUnit v3 [基类](./test-runners.md)，这些基类为每个测试创建一个 Playwright 和 Page 实例。

## 编写 API 测试

[APIRequestContext](/dotnet/api/class-apirequestcontext) 可以通过网络发送各种 HTTP(S) 请求。

以下示例演示如何使用 Playwright 通过 [GitHub API](https://docs.github.com/en/rest) 测试问题创建。测试套件将执行以下操作：
- 在运行测试之前创建一个新仓库。
- 创建一些问题并验证服务器状态。
- 在运行测试之后删除仓库。

### 配置

GitHub API 需要授权，因此我们将为所有测试配置一次令牌。同时，我们还将设置 `baseURL` 以简化测试。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class TestGitHubAPI : PlaywrightTest
{
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [TestInitialize]
    public async Task SetUpAPITesting()
    {
        await CreateAPIRequestContext();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>();
        // 我们按照 GitHub 指南设置此头。
        headers.Add("Accept", "application/vnd.github.v3+json");
        // 为所有请求添加授权令牌。
        // 假设个人访问令牌在环境中可用。
        headers.Add("Authorization", "token " + API_TOKEN);

        Request = await this.Playwright.APIRequest.NewContextAsync(new() {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    [TestCleanup]
    public async Task TearDownAPITesting()
    {
        await Request.DisposeAsync();
    }
}
```

</TabItem>

<TabItem value="nunit">

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TestGitHubAPI : PlaywrightTest
{
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [SetUp]
    public async Task SetUpAPITesting()
    {
        await CreateAPIRequestContext();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>();
        // 我们按照 GitHub 指南设置此头。
        headers.Add("Accept", "application/vnd.github.v3+json");
        // 为所有请求添加授权令牌。
        // 假设个人访问令牌在环境中可用。
        headers.Add("Authorization", "token " + API_TOKEN);

        Request = await this.Playwright.APIRequest.NewContextAsync(new() {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    [TearDown]
    public async Task TearDownAPITesting()
    {
        await Request.DisposeAsync();
    }
}
```

</TabItem>

<TabItem value="xunit">

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await CreateAPIRequestContext();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>();
        // 我们按照 GitHub 指南设置此头。
        headers.Add("Accept", "application/vnd.github.v3+json");
        // 为所有请求添加授权令牌。
        // 假设个人访问令牌在环境中可用。
        headers.Add("Authorization", "token " + API_TOKEN);

        Request = await this.Playwright.APIRequest.NewContextAsync(new() {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    public override async Task DisposeAsync()
    {
        await Request.DisposeAsync();
        await base.DisposeAsync();
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await CreateAPIRequestContext();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>();
        // 我们按照 GitHub 指南设置此头。
        headers.Add("Accept", "application/vnd.github.v3+json");
        // 为所有请求添加授权令牌。
        // 假设个人访问令牌在环境中可用。
        headers.Add("Authorization", "token " + API_TOKEN);

        Request = await this.Playwright.APIRequest.NewContextAsync(new() {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    public override async Task DisposeAsync()
    {
        await Request.DisposeAsync();
        await base.DisposeAsync();
    }
}
```

</TabItem>

</Tabs>

### 编写测试

现在我们已经初始化了请求对象，可以添加一些测试来在仓库中创建新问题。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [TestMethod]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.IsNotNull(issue);
        Assert.AreEqual("Bug description", issue?.GetProperty("body").GetString());
    }

    [TestMethod]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.IsNotNull(issue);
        Assert.AreEqual("Feature description", issue?.GetProperty("body").GetString());
    }

    // ...
}
```

</TabItem>

<TabItem value="nunit">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [Test]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.That(issue, Is.Not.Null);
        Assert.That(issue?.GetProperty("body").GetString(), Is.EqualTo("Bug description"));
    }

    [Test]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.That(issue, Is.Not.Null);
        Assert.That(issue?.GetProperty("body").GetString(), Is.EqualTo("Feature description"));
    }

    // ...
}
```

</TabItem>

<TabItem value="xunit">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [Fact]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Bug description", issue?.GetProperty("body").GetString());
    }

    [Fact]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Feature description", issue?.GetProperty("body").GetString());
    }

    // ...
}
```

</TabItem>

<TabItem value="xunit-v3">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [Fact]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Bug description", issue?.GetProperty("body").GetString());
    }

    [Fact]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Feature description", issue?.GetProperty("body").GetString());
    }

    // ...
}
```

</TabItem>

</Tabs>

### 设置和清理

这些测试假设仓库存在。你可能想在运行测试之前创建一个新仓库，并在之后删除它。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

为此使用 `[TestInitialize]` 和 `[TestCleanup]` 钩子。

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class TestGitHubAPI : PlaywrightTest
{
    // ...
    [TestInitialize]
    public async Task SetUpAPITesting()
    {
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    [TestCleanup]
    public async Task TearDownAPITesting()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

<TabItem value="nunit">

为此使用 `[SetUp]` 和 `[TearDown]` 钩子。

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TestGitHubAPI : PlaywrightTest
{
    // ...
    [SetUp]
    public async Task SetUpAPITesting()
    {
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    [TearDown]
    public async Task TearDownAPITesting()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

<TabItem value="xunit">

为此重写 `InitializeAsync` 和 `DisposeAsync` 方法。

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    // ...
    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    public override async Task DisposeAsync()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
        await base.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

为此重写 `InitializeAsync` 和 `DisposeAsync` 方法。

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    // ...
    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    public override async Task DisposeAsync()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
        await base.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

</Tabs>

### 完整测试示例

以下是 API 测试的完整示例：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test-repo-2";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [TestMethod]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.IsNotNull(issue);
        Assert.AreEqual("Bug description", issue?.GetProperty("body").GetString());
    }

    [TestMethod]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.IsNotNull(issue);
        Assert.AreEqual("Feature description", issue?.GetProperty("body").GetString());
    }

    [TestInitialize]
    public async Task SetUpAPITesting()
    {
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>
        {
            // 我们按照 GitHub 指南设置此头。
            { "Accept", "application/vnd.github.v3+json" },
            // 为所有请求添加授权令牌。
            // 假设个人访问令牌在环境中可用。
            { "Authorization", "token " + API_TOKEN }
        };

        Request = await Playwright.APIRequest.NewContextAsync(new()
        {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    [TestCleanup]
    public async Task TearDownAPITesting()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

<TabItem value="nunit">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test-repo-2";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [Test]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.That(issue, Is.Not.Null);
        Assert.That(issue?.GetProperty("body").GetString(), Is.EqualTo("Bug description"));
    }

    [Test]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.That(issue, Is.Not.Null);
        Assert.That(issue?.GetProperty("body").GetString(), Is.EqualTo("Feature description"));
    }

    [SetUp]
    public async Task SetUpAPITesting()
    {
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>
        {
            // 我们按照 GitHub 指南设置此头。
            { "Accept", "application/vnd.github.v3+json" },
            // 为所有请求添加授权令牌。
            // 假设个人访问令牌在环境中可用。
            { "Authorization", "token " + API_TOKEN }
        };

        Request = await Playwright.APIRequest.NewContextAsync(new()
        {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    [TearDown]
    public async Task TearDownAPITesting()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

<TabItem value="xunit">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test-repo-2";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [Fact]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Bug description", issue?.GetProperty("body").GetString());
    }

    [Fact]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Feature description", issue?.GetProperty("body").GetString());
    }

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>
        {
            // 我们按照 GitHub 指南设置此头。
            { "Accept", "application/vnd.github.v3+json" },
            // 为所有请求添加授权令牌。
            // 假设个人访问令牌在环境中可用。
            { "Authorization", "token " + API_TOKEN }
        };

        Request = await Playwright.APIRequest.NewContextAsync(new()
        {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    public override async Task DisposeAsync()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
        await base.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

```csharp
using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class TestGitHubAPI : PlaywrightTest
{
    static string REPO = "test-repo-2";
    static string USER = Environment.GetEnvironmentVariable("GITHUB_USER");
    static string? API_TOKEN = Environment.GetEnvironmentVariable("GITHUB_API_TOKEN");

    private IAPIRequestContext Request = null!;

    [Fact]
    public async Task ShouldCreateBugReport()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Bug] report 1" },
            { "body", "Bug description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();
        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Bug] report 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Bug description", issue?.GetProperty("body").GetString());
    }

    [Fact]
    public async Task ShouldCreateFeatureRequests()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        var issues = await Request.GetAsync("/repos/" + USER + "/" + REPO + "/issues");
        await Expect(newIssue).ToBeOKAsync();
        var issuesJsonResponse = await issues.JsonAsync();

        JsonElement? issue = null;
        foreach (JsonElement issueObj in issuesJsonResponse?.EnumerateArray())
        {
            if (issueObj.TryGetProperty("title", out var title) == true)
            {
                if (title.GetString() == "[Feature] request 1")
                {
                    issue = issueObj;
                }
            }
        }
        Assert.NotNull(issue);
        Assert.Equal("Feature description", issue?.GetProperty("body").GetString());
    }

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await CreateAPIRequestContext();
        await CreateTestRepository();
    }

    private async Task CreateAPIRequestContext()
    {
        var headers = new Dictionary<string, string>
        {
            // 我们按照 GitHub 指南设置此头。
            { "Accept", "application/vnd.github.v3+json" },
            // 为所有请求添加授权令牌。
            // 假设个人访问令牌在环境中可用。
            { "Authorization", "token " + API_TOKEN }
        };

        Request = await Playwright.APIRequest.NewContextAsync(new()
        {
            // 我们发送的所有请求都发送到此 API 端点。
            BaseURL = "https://api.github.com",
            ExtraHTTPHeaders = headers,
        });
    }

    private async Task CreateTestRepository()
    {
        var resp = await Request.PostAsync("/user/repos", new()
        {
            DataObject = new Dictionary<string, string>()
            {
                ["name"] = REPO,
            },
        });
        await Expect(resp).ToBeOKAsync();
    }

    public override async Task DisposeAsync()
    {
        await DeleteTestRepository();
        await Request.DisposeAsync();
        await base.DisposeAsync();
    }

    private async Task DeleteTestRepository()
    {
        var resp = await Request.DeleteAsync("/repos/" + USER + "/" + REPO);
        await Expect(resp).ToBeOKAsync();
    }
}
```

</TabItem>

</Tabs>

## 通过 API 调用准备服务器状态

以下测试通过 API 创建一个新问题，然后导航到项目中所有问题的列表，检查它是否出现在列表顶部。检查使用 [LocatorAssertions](/dotnet/api/class-locatorassertions) 执行。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

```csharp
[TestClass]
public class TestGitHubAPI : PageTest
{
    [TestMethod]
    public async Task LastCreatedIssueShouldBeFirstInTheList()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        // 当继承自 'PlaywrightTest' 时，它只给你一个 Playwright 实例。要获取 Page 实例，要么手动启动
        // 浏览器、上下文和页面，要么继承自 'PageTest'，它将为你启动。
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        var firstIssue = Page.Locator("a[data-hovercard-type='issue']").First;
        await Expect(firstIssue).ToHaveTextAsync("[Feature] request 1");
    }
}
```

</TabItem>

<TabItem value="nunit">

```csharp
[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class TestGitHubAPI : PageTest
{
    [Test]
    public async Task LastCreatedIssueShouldBeFirstInTheList()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        // 当继承自 'PlaywrightTest' 时，它只给你一个 Playwright 实例。要获取 Page 实例，要么手动启动
        // 浏览器、上下文和页面，要么继承自 'PageTest'，它将为你启动。
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        var firstIssue = Page.Locator("a[data-hovercard-type='issue']").First;
        await Expect(firstIssue).ToHaveTextAsync("[Feature] request 1");
    }
}
```

</TabItem>

<TabItem value="xunit">

```csharp
public class TestGitHubAPI : PageTest
{
    [Fact]
    public async Task LastCreatedIssueShouldBeFirstInTheList()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        // 当继承自 'PlaywrightTest' 时，它只给你一个 Playwright 实例。要获取 Page 实例，要么手动启动
        // 浏览器、上下文和页面，要么继承自 'PageTest'，它将为你启动。
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        var firstIssue = Page.Locator("a[data-hovercard-type='issue']").First;
        await Expect(firstIssue).ToHaveTextAsync("[Feature] request 1");
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

```csharp
public class TestGitHubAPI : PageTest
{
    [Fact]
    public async Task LastCreatedIssueShouldBeFirstInTheList()
    {
        var data = new Dictionary<string, string>
        {
            { "title", "[Feature] request 1" },
            { "body", "Feature description" }
        };
        var newIssue = await Request.PostAsync("/repos/" + USER + "/" + REPO + "/issues", new() { DataObject = data });
        await Expect(newIssue).ToBeOKAsync();

        // 当继承自 'PlaywrightTest' 时，它只给你一个 Playwright 实例。要获取 Page 实例，要么手动启动
        // 浏览器、上下文和页面，要么继承自 'PageTest'，它将为你启动。
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        var firstIssue = Page.Locator("a[data-hovercard-type='issue']").First;
        await Expect(firstIssue).ToHaveTextAsync("[Feature] request 1");
    }
}
```

</TabItem>

</Tabs>

## 运行用户操作后检查服务器状态

以下测试通过浏览器中的用户界面创建一个新问题，然后通过 API 检查它是否已创建：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

```csharp
// 如果你想使用 Page 类，请确保继承自 PageTest。
[TestClass]
public class GitHubTests : PageTest
{
    [TestMethod]
    public async Task LastCreatedIssueShouldBeOnTheServer()
    {
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        await Page.Locator("text=New Issue").ClickAsync();
        await Page.Locator("[aria-label='Title']").FillAsync("Bug report 1");
        await Page.Locator("[aria-label='Comment body']").FillAsync("Bug description");
        await Page.Locator("text=Submit new issue").ClickAsync();
        var issueId = Page.Url.Substring(Page.Url.LastIndexOf('/'));

        var newIssue = await Request.GetAsync("https://github.com/" + USER + "/" + REPO + "/issues/" + issueId);
        await Expect(newIssue).ToBeOKAsync();
        StringAssert.Contains(await newIssue.TextAsync(), "Bug report 1");
    }
}
```

</TabItem>

<TabItem value="nunit">

```csharp
// 如果你想使用 Page 类，请确保继承自 PageTest。
[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class GitHubTests : PageTest
{
    [Test]
    public async Task LastCreatedIssueShouldBeOnTheServer()
    {
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        await Page.Locator("text=New Issue").ClickAsync();
        await Page.Locator("[aria-label='Title']").FillAsync("Bug report 1");
        await Page.Locator("[aria-label='Comment body']").FillAsync("Bug description");
        await Page.Locator("text=Submit new issue").ClickAsync();
        var issueId = Page.Url.Substring(Page.Url.LastIndexOf('/'));

        var newIssue = await Request.GetAsync("https://github.com/" + USER + "/" + REPO + "/issues/" + issueId);
        await Expect(newIssue).ToBeOKAsync();
        Assert.That(await newIssue.TextAsync(), Does.Contain("Bug report 1"));
    }
}
```

</TabItem>

<TabItem value="xunit">

```csharp
// 如果你想使用 Page 类，请确保继承自 PageTest。
public class GitHubTests : PageTest
{
    [Fact]
    public async Task LastCreatedIssueShouldBeOnTheServer()
    {
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        await Page.Locator("text=New Issue").ClickAsync();
        await Page.Locator("[aria-label='Title']").FillAsync("Bug report 1");
        await Page.Locator("[aria-label='Comment body']").FillAsync("Bug description");
        await Page.Locator("text=Submit new issue").ClickAsync();
        var issueId = Page.Url.Substring(Page.Url.LastIndexOf('/'));

        var newIssue = await Request.GetAsync("https://github.com/" + USER + "/" + REPO + "/issues/" + issueId);
        await Expect(newIssue).ToBeOKAsync();
        Assert.Contains("Bug report 1", await newIssue.TextAsync());
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

```csharp
// 如果你想使用 Page 类，请确保继承自 PageTest。
public class GitHubTests : PageTest
{
    [Fact]
    public async Task LastCreatedIssueShouldBeOnTheServer()
    {
        await Page.GotoAsync("https://github.com/" + USER + "/" + REPO + "/issues");
        await Page.Locator("text=New Issue").ClickAsync();
        await Page.Locator("[aria-label='Title']").FillAsync("Bug report 1");
        await Page.Locator("[aria-label='Comment body']").FillAsync("Bug description");
        await Page.Locator("text=Submit new issue").ClickAsync();
        var issueId = Page.Url.Substring(Page.Url.LastIndexOf('/'));

        var newIssue = await Request.GetAsync("https://github.com/" + USER + "/" + REPO + "/issues/" + issueId);
        await Expect(newIssue).ToBeOKAsync();
        Assert.Contains("Bug report 1", await newIssue.TextAsync());
    }
}
```

</TabItem>

</Tabs>

## 重用认证状态

Web 应用程序使用基于 cookie 或基于令牌的认证，其中已认证状态存储为 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)。
Playwright 提供 [`ApiRequestContext.StorageStateAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-storage-state) 方法，可用于从已认证的上下文中检索存储状态，然后使用该状态创建新上下文。

存储状态在 [BrowserContext](/dotnet/api/class-browsercontext) 和 [APIRequestContext](/dotnet/api/class-apirequestcontext) 之间可互换。你可以使用它通过 API 调用登录，然后创建一个已包含 cookie 的新上下文。
以下代码片段从已认证的 [APIRequestContext](/dotnet/api/class-apirequestcontext) 中检索状态，并使用该状态创建一个新的 [BrowserContext](/dotnet/api/class-browsercontext)。

```csharp
var requestContext = await Playwright.APIRequest.NewContextAsync(new()
{
    HttpCredentials = new()
    {
        Username = "user",
        Password = "passwd"
    },
});
await requestContext.GetAsync("https://api.example.com/login");
// 将存储状态保存到变量中。
var state = await requestContext.StorageStateAsync();

// 使用保存的存储状态创建新上下文。
var context = await Browser.NewContextAsync(new() { StorageState = state });
```
