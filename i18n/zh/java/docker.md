---
title: "Docker"
---

# Docker

## 简介

[Dockerfile.noble] 可用于在 Docker 环境中运行 Playwright 脚本。此镜像包含 [Playwright 浏览器](./browsers.md#install-browsers)和[浏览器系统依赖](./browsers.md#install-system-dependencies)。Playwright 包/依赖不包含在镜像中，需要单独安装。

## 用法

此 Docker 镜像发布到 [Microsoft Artifact Registry]。

::: info
此 Docker 镜像仅用于测试和开发目的。不建议使用此 Docker 镜像访问不受信任的网站。
:::

### 拉取镜像

```bash
docker pull mcr.microsoft.com/playwright/java:v%%VERSION%%-noble
```

### 运行镜像

默认情况下，Docker 镜像将使用 `root` 用户运行浏览器。这将禁用 Chromium 沙箱，因为它在 root 下不可用。如果你运行的是受信任的代码（例如端到端测试）并且想避免管理单独用户的麻烦，那么 root 用户可能是合适的。对于网页抓取或爬取，我们建议在 Docker 容器内创建单独的用户并使用 seccomp 配置文件。

#### 端到端测试

在受信任的网站上，你可以避免创建单独的用户并使用 root，因为你信任将在浏览器上运行的代码。

```bash
docker run -it --rm --ipc=host mcr.microsoft.com/playwright/java:v%%VERSION%%-noble /bin/bash
```

#### 爬取和抓取

在不受信任的网站上，建议使用单独的用户启动浏览器，并结合 seccomp 配置文件。在容器内或如果你将 Docker 镜像用作基础镜像，你必须使用 `adduser` 来创建用户。

```bash
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/java:v%%VERSION%%-noble /bin/bash
```

[`seccomp_profile.json`](https://github.com/microsoft/playwright/blob/main/utils/docker/seccomp_profile.json) 是使用沙箱运行 Chromium 所需的。这是一个[默认 Docker seccomp 配置文件](https://github.com/docker/engine/blob/d0d99b04cf6e00ed3fc27e81fc3d94e7eda70af3/profiles/seccomp/default.json)，带有额外的用户命名空间克隆权限：

```json
{
  "comment": "允许创建用户命名空间",
  "names": [
    "clone",
    "setns",
    "unshare"
  ],
  "action": "SCMP_ACT_ALLOW",
  "args": [],
  "includes": {},
  "excludes": {}
}
```

### 推荐的 Docker 配置

在 Docker 中运行 Playwright 时，建议以下配置：
1. **使用 [`--init`](https://docs.docker.com/reference/cli/docker/container/run/#init)** Docker 标志可以避免对 PID=1 的进程进行特殊处理。这是僵尸进程的常见原因。
1. **使用 `--ipc=host`** 在使用 Chromium 时是推荐的。没有它，Chromium 可能会耗尽内存并崩溃。在 [Docker 文档](https://docs.docker.com/reference/cli/docker/container/run/#ipc)中了解更多关于此选项的信息。
1. **如果在启动 Chromium 时看到奇怪的错误**，在本地开发时尝试使用 `docker run --cap-add=SYS_ADMIN` 运行容器。

### 在 CI 中使用

查看我们的[持续集成指南](./ci.md)获取示例配置。

### 远程连接

你可以在 Docker 中运行 Playwright 服务器，同时保持测试在主机系统或另一台机器上运行。这对于在不支持的 Linux 发行版上运行测试或远程执行场景很有用。

#### 运行 Playwright 服务器

在 Docker 中启动 Playwright 服务器：

```bash
docker run -p 3000:3000 --rm --init -it --workdir /home/pwuser --user pwuser mcr.microsoft.com/playwright:v%%VERSION%%-noble /bin/sh -c "npx -y playwright@%%VERSION%% run-server --port 3000 --host 0.0.0.0"
```

::: warning
Playwright 服务器没有身份验证。任何能够访问端口的客户端都可以完全控制浏览器，并可以作为运行服务器的用户行事。服务器旨在在网络配置限制端口访问的环境中运行。仅将端口发布给受信任的客户端，例如当测试在同一台机器上运行时使用 `-p 127.0.0.1:3000:3000`，或者使用防火墙、私有网络或身份验证代理。

如果其他本地用户或进程不应连接，例如在共享开发机器上，使用 `--path /<secret>` 在不可猜测的路径上提供端点，并连接到 `ws://127.0.0.1:3000/<secret>`。
:::

#### 连接到服务器

```java
package org.example;

import com.microsoft.playwright.*;
import java.nio.file.Paths;

public class App {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      Browser browser = playwright.chromium().connect("ws://127.0.0.1:3000/");
    }
  }
}
```

#### 网络配置

如果你需要从 Docker 容器内访问本地服务器：

```bash
docker run --add-host=hostmachine:host-gateway -p 3000:3000 --rm --init -it --workdir /home/pwuser --user pwuser mcr.microsoft.com/playwright:v%%VERSION%%-noble /bin/sh -c "npx -y playwright@%%VERSION%% run-server --port 3000 --host 0.0.0.0"
```

这使 `hostmachine` 指向主机的 localhost。你的测试在访问本地服务器时应使用 `hostmachine` 而不是 `localhost`。

::: info
远程运行测试时，确保测试中的 Playwright 版本与 Docker 容器中运行的版本匹配。
:::

### 使用 noVNC 和 GitHub Codespaces 连接

对于 Docker 和 GitHub Codespaces 环境，你可以使用内置于 Docker 镜像中的 `noVNC` 查看器来查看和生成测试。为了使 VNC web 查看器可以在容器外部访问，你可以在 `.devcontainer/devcontainer.json` 文件中启用 `desktop-lite` 功能并指定 `webPort`：

```json
{
  "image": "mcr.microsoft.com/playwright:v%%VERSION%%-noble",
  "forwardPorts": [6080],
  "features": {
    "desktop-lite": {
      "webPort": "6080"
    }
  }
}
```

启用后，你可以在新的浏览器标签中打开指定的端口，你将可以访问 `noVNC` web 查看器。这将使你能够直接在容器上录制测试、选择选择器和使用 codegen。

## 镜像标签

查看[所有可用的镜像标签]。

我们目前发布以下标签的镜像：
- `:v%%VERSION%%` - 基于 Ubuntu 24.04 LTS (Noble Numbat) 的 Playwright v%%VERSION%% 发行版 Docker 镜像。
- `:v%%VERSION%%-noble` - 基于 Ubuntu 24.04 LTS (Noble Numbat) 的 Playwright v%%VERSION%% 发行版 Docker 镜像。
- `:v%%VERSION%%-jammy` - 基于 Ubuntu 22.04 LTS (Jammy Jellyfish) 的 Playwright v%%VERSION%% 发行版 Docker 镜像。
- `:v%%VERSION%%-resolute` - 基于 Ubuntu 26.04 LTS (Resolute Raccoon) 的 Playwright v%%VERSION%% 发行版 Docker 镜像。

::: info
如果可能的话，建议始终将 Docker 镜像固定到特定版本。如果 Docker 镜像中的 Playwright 版本与项目/测试中的版本不匹配，Playwright 将无法找到浏览器可执行文件。
:::

### 基础镜像

我们目前基于以下 [Ubuntu](https://hub.docker.com/_/ubuntu) 版本发布镜像：
- **Ubuntu 26.04 LTS** (Resolute Raccoon)，镜像标签包含 `resolute`
- **Ubuntu 24.04 LTS** (Noble Numbat)，镜像标签包含 `noble`
- **Ubuntu 22.04 LTS** (Jammy Jellyfish)，镜像标签包含 `jammy`

#### Alpine

Firefox 和 WebKit 的浏览器构建是为 [glibc](https://en.wikipedia.org/wiki/Glibc) 库构建的。Alpine Linux 和其他基于 [musl](https://en.wikipedia.org/wiki/Musl) 标准库的发行版不受支持。
