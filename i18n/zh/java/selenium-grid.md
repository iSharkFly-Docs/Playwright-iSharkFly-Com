---
title: "Selenium Grid（实验性）"
---

# Selenium Grid（实验性）

## 简介

Playwright 可以连接到运行 Selenium 4 的 [Selenium Grid Hub](https://www.selenium.dev/documentation/grid/) 来启动 **Google Chrome** 或 **Microsoft Edge** 浏览器，而不是在本地机器上运行浏览器。请注意，此功能是**实验性的**，优先级相应较低。

::: warning
Playwright 与 Selenium Grid Hub 的集成在未来可能会出现问题。在使用之前，请确保权衡风险与收益。

<details>

<summary>

<span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.6">更多详情</span>

</summary>

在内部，Playwright 使用 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) websocket 连接到浏览器。Selenium 4 目前公开了此功能。但是，这[在未来可能不会是这种情况](https://github.com/SeleniumHQ/selenium/issues/11590#issuecomment-1436113950)。如果 Selenium 放弃此功能，Playwright 将停止与其一起工作。

</details>
:::

在将 Playwright 连接到您的 Selenium Grid 之前，请确保 grid 可以与 [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) 一起工作。例如，运行[其中一个示例](https://github.com/SeleniumHQ/selenium/tree/trunk/javascript/selenium-webdriver/example)并传递 `SELENIUM_REMOTE_URL` 环境变量。如果 webdriver 示例不工作，请查看 Selenium hub/node/standalone 输出中的任何错误，并搜索 [Selenium issues](https://github.com/SeleniumHQ/selenium/issues) 寻找可能的解决方案。

## 启动 Selenium Grid

如果您运行分布式 Selenium Grid，Playwright 需要 selenium 节点使用可访问的地址进行注册，以便它可以连接到浏览器。为确保它按预期工作，在运行 selenium 节点时设置指向 hub 的 `SE_NODE_GRID_URL` 环境变量。

```bash
# 启动 selenium 节点
SE_NODE_GRID_URL="http://<selenium-hub-ip>:4444" java -jar selenium-server-<version>.jar node
```

## 将 Playwright 连接到 Selenium Grid

要将 Playwright 连接到 **Selenium Grid 4**，请设置指向您的 Selenium Grid Hub 的 `SELENIUM_REMOTE_URL` 环境变量。请注意，这仅适用于 Google Chrome 和 Microsoft Edge。

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 mvn test
```

您不必更改代码，只需像往常一样使用您的测试工具或 [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch)。

### 传递额外的能力

如果您的 grid 需要设置额外的能力（例如，您使用外部服务），您可以设置 `SELENIUM_REMOTE_CAPABILITIES` 环境变量来提供 JSON 序列化的能力。

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 SELENIUM_REMOTE_CAPABILITIES="{'mygrid:options':{os:'windows',username:'John',password:'secure'}}" mvn test
```

### 传递额外的头信息

如果您的 grid 需要设置额外的头信息（例如，您需要提供授权令牌来使用云中的浏览器），您可以设置 `SELENIUM_REMOTE_HEADERS` 环境变量来提供 JSON 序列化的头信息。

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 SELENIUM_REMOTE_HEADERS="{'Authorization':'Basic b64enc'}" mvn test
```

### 详细日志

使用 `DEBUG=pw:browser*` 环境变量运行以查看 Playwright 如何连接到 Selenium Grid。

```bash
DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://internal.grid:4444 mvn test
```

如果您提交问题，请包含此日志。

## 使用 Selenium Docker

使用 Selenium Grid 的一种简单方法是运行官方 docker 容器。在 [selenium docker images](https://github.com/SeleniumHQ/docker-selenium) 文档中阅读更多信息。有关镜像标签约定，[阅读更多](https://github.com/SeleniumHQ/docker-selenium/wiki/Tagging-Convention#selenium-grid-4x-and-above)。

### 独立模式

以下是运行 selenium 独立模式并将 Playwright 连接到它的示例。请注意，hub 和 node 在同一个 `localhost` 上，我们传递指向它的 `SE_NODE_GRID_URL` 环境变量。

首先启动 Selenium。

```bash
docker run -d -p 4444:4444 --shm-size="2g" -e SE_NODE_GRID_URL="http://localhost:4444" selenium/standalone-chromium:latest
```

然后运行 Playwright。

```bash
SELENIUM_REMOTE_URL=http://localhost:4444 mvn test
```

### Hub 和节点模式

以下是运行 selenium hub 和单个 selenium 节点，并将 Playwright 连接到 hub 的示例。请注意，hub 和 node 有不同的 IP，我们在启动节点容器时传递指向 hub 的 `SE_NODE_GRID_URL` 环境变量。

首先启动 hub 容器和一个或多个节点容器。

```bash
docker run -d -p 4442-4444:4442-4444 --name selenium-hub selenium/hub:4.25.0
docker run -d -p 5555:5555 \
    --shm-size="2g" \
    -e SE_EVENT_BUS_HOST=<selenium-hub-ip> \
    -e SE_EVENT_BUS_PUBLISH_PORT=4442 \
    -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \
    -e SE_NODE_GRID_URL="http://<selenium-hub-ip>:4444"
    selenium/node-chromium:4.25.0
```

然后运行 Playwright。

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 mvn test
```

## Selenium 3

在内部，Playwright 使用 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) websocket 连接到浏览器。Selenium 4 公开了此功能，而 Selenium 3 没有。

这意味着 Selenium 3 是以尽力而为的方式支持的，Playwright 尝试直接连接到 grid 节点。Grid 节点必须从运行 Playwright 的机器直接可访问。
