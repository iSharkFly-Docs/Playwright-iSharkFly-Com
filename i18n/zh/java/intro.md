---
title: "安装"
---

# 安装

## 简介

Playwright 专为满足端到端测试的需求而创建。Playwright 支持所有现代渲染引擎，包括 Chromium、WebKit 和 Firefox。可在 Windows、Linux 和 macOS 上进行测试，支持本地或 CI 环境，支持无头模式或有头模式，并具有原生移动设备模拟功能。

Playwright 以一组 [Maven](https://maven.apache.org/what-is-maven.html) 模块的形式分发。最简单的使用方式是在项目的 `pom.xml` 中添加一个依赖项，如下所述。如果您不熟悉 Maven，请参阅其[文档](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)。

## 使用方法

通过安装 Playwright 并运行示例文件来开始使用，查看其实际效果。

<Tabs group-id="" default-value="java" :tabs='[{"label":"App.java","value":"java"},{"label":"pom.xml","value":"pom"}]'>

<TabItem value="java">

::: code-group

```java [src/main/java/org/example/App.java]
package org.example;

import com.microsoft.playwright.*;

public class App {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://playwright.dev");
            System.out.println(page.title());
        }
    }
}
```

:::

</TabItem>

<TabItem value="pom">

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.example</groupId>
  <artifactId>examples</artifactId>
  <version>0.1-SNAPSHOT</version>
  <name>Playwright Client Examples</name>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
  <dependencies>
    <dependency>
      <groupId>com.microsoft.playwright</groupId>
      <artifactId>playwright</artifactId>
      <version>%%VERSION%%</version>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.10.1</version>
        <!-- 对接口静态方法的引用仅在源代码级别 1.8 或更高版本中允许 -->
        <configuration>
          <source>1.8</source>
          <target>1.8</target>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

</TabItem>

</Tabs>

使用上述 App.java 和 pom.xml，按如下方式编译并执行您的新程序：

```bash
mvn compile exec:java -D exec.mainClass="org.example.App"
```

运行时会下载 Playwright 包并安装 Chromium、Firefox 和 WebKit 的浏览器二进制文件。要修改此行为，请参阅[安装参数](./browsers.md#install-browsers)。

## 第一个脚本

在我们的第一个脚本中，我们将导航到 `playwright.dev` 并在 WebKit 中截取屏幕截图。

```java
package org.example;

import com.microsoft.playwright.*;
import java.nio.file.Paths;

public class App {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      Browser browser = playwright.webkit().launch();
      Page page = browser.newPage();
      page.navigate("https://playwright.dev/");
      page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("example.png")));
    }
  }
}
```

默认情况下，Playwright 以无头模式运行浏览器。要查看浏览器界面，请将 [`headless`](/java/api/class-browsertype#browser-type-launch-option-headless) 选项设置为 `false`。您还可以使用 [`slowMo`](/java/api/class-browsertype#browser-type-launch-option-slow-mo) 来减慢执行速度。在调试工具[章节](./debug.md)中了解更多信息。

```java
playwright.firefox().launch(new BrowserType.LaunchOptions().setHeadless(false).setSlowMo(50));
```

## 运行示例脚本

```bash
mvn compile exec:java -D exec.mainClass="org.example.App"
```

默认情况下，使用 Playwright 启动的浏览器以无头模式运行，这意味着运行脚本时不会打开浏览器界面。要更改此设置，您可以在启动浏览器时传递 `new BrowserType.LaunchOptions().setHeadless(false)`。

## 系统要求
- Java 8 或更高版本。
- Windows 11+、Windows Server 2019+ 或 Windows Subsystem for Linux (WSL)。
- macOS 14 (Sonoma) 或更高版本。
- Debian 12 / 13、Ubuntu 22.04 / 24.04 / 26.04 (x86-64 或 arm64)。

## 下一步
- [使用 Web 优先断言、页面 fixture 和定位器编写测试](./writing-tests.md)
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen.md)
- [查看测试追踪](./trace-viewer-intro.md)
