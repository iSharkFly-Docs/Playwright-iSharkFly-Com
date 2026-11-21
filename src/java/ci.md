---
title: "Continuous Integration"
---

# Continuous Integration

## Introduction

Playwright tests can be executed in CI environments. We have created sample
configurations for common CI providers.

3 steps to get your tests running on CI:
1. **Ensure CI agent can run browsers**: Use [our Docker image](./docker.md)
   in Linux agents or install your dependencies using the [CLI](./browsers#install-system-dependencies).
1. **Install Playwright**:
   
   ```bash
   mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --with-deps"
   ```
1. **Run your tests**:
   
   ```bash
   mvn test
   ```

## CI configurations

The [Command line tools](./browsers#install-system-dependencies) can be used to install all operating system dependencies in CI.

### GitHub Actions

#### On push/pull_request

Tests will run on push or pull request on branches main/master. The [workflow](https://docs.github.com/en/actions/using-workflows/about-workflows) will install all dependencies, install Playwright and then run the tests.

::: code-group

```yml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-java@v5
      with:
        distribution: 'temurin'
        java-version: '25'
    - name: Build & Install
      run: mvn -B install -D skipTests --no-transfer-progress
    - name: Ensure browsers are installed
      run: mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --with-deps"
    - name: Run tests
      run: mvn test
```

:::

#### Via Containers

GitHub Actions support [running jobs in a container](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container) by using the [`jobs.<job_id>.container`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer) option. This is useful to not pollute the host environment with dependencies and to have a consistent environment for e.g. screenshots/visual regression testing across different operating systems.

::: code-group

```yml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  playwright:
    name: 'Playwright Tests'
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright/java:v%%VERSION%%-noble
      options: --user 1001
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-java@v5
        with:
          distribution: 'temurin'
          java-version: '25'
      - name: Build & Install
        run: mvn -B install -D skipTests --no-transfer-progress
      - name: Run tests
        run: mvn test
```

:::

#### On deployment

This will start the tests after a [GitHub Deployment](https://developer.github.com/v3/repos/deployments/) went into the `success` state.
Services like Vercel use this pattern so you can run your end-to-end tests on their deployed environment.

::: code-group

```yml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  deployment_status:
jobs:
  test:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-java@v5
      with:
        distribution: 'temurin'
        java-version: '25'
    - name: Build & Install
      run: mvn -B install -D skipTests --no-transfer-progress
    - name: Install Playwright
      run: mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --with-deps"
    - name: Run tests
      run: mvn test
      env:
        # This might depend on your test-runner
        PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}
```

:::

### Docker

We have a [pre-built Docker image](./docker.md) which can either be used directly or as a reference to update your existing Docker definitions. Make sure to follow the [Recommended Docker Configuration](./docker.md#recommended-docker-configuration) to ensure the best performance.

### Azure Pipelines

For Windows or macOS agents, no additional configuration is required, just install Playwright and run your tests.

For Linux agents, you can use [our Docker container](./docker.md) with Azure
Pipelines support [running containerized
jobs](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/container-phases?view=azure-devops).
Alternatively, you can use [Command line tools](./browsers#install-system-dependencies) to install all necessary dependencies.

For running the Playwright tests use this pipeline task:

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: JavaToolInstaller@1
  inputs:
    versionSpec: '25'
    jdkArchitectureOption: 'x64'
    jdkSourceOption: AzureStorage
- script: mvn -B install -D skipTests --no-transfer-progress
  displayName: 'Build and install'
- script: mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --with-deps"
  displayName: 'Install Playwright browsers'
- script: mvn test
  displayName: 'Run tests'
```

#### Azure Pipelines (containerized)

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest
container: mcr.microsoft.com/playwright/java:v%%VERSION%%-noble

steps:
- task: JavaToolInstaller@1
  inputs:
    versionSpec: '25'
    jdkArchitectureOption: 'x64'
    jdkSourceOption: AzureStorage

- script: mvn -B install -D skipTests --no-transfer-progress
  displayName: 'Build and install'
- script: mvn test
  displayName: 'Run tests'
```

### CircleCI

Running Playwright on CircleCI is very similar to running on GitHub Actions. In order to specify the pre-built Playwright [Docker image](./docker.md), simply modify the agent definition with `docker:` in your config like so:

```yml
executors:
  pw-noble-development:
    docker:
      - image: mcr.microsoft.com/playwright/java:v%%VERSION%%-noble
```

Note: When using the docker agent definition, you are specifying the resource class of where playwright runs to the 'medium' tier [here](https://circleci.com/docs/configuration-reference?#docker-execution-environment). The default behavior of Playwright is to set the number of workers to the detected core count (2 in the case of the medium tier). Overriding the number of workers to greater than this number will cause unnecessary timeouts and failures.

### Jenkins

Jenkins supports Docker agents for pipelines. Use the [Playwright Docker image](./docker.md)
to run tests on Jenkins.

```groovy
pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright/java:v%%VERSION%%-noble' } }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'mvn -B install -D skipTests --no-transfer-progress'
            sh 'mvn test'
         }
      }
   }
}
```

### Bitbucket Pipelines

Bitbucket Pipelines can use public [Docker images as build environments](https://confluence.atlassian.com/bitbucket/use-docker-images-as-build-environments-792298897.html). To run Playwright tests on Bitbucket, use our public Docker image ([see Dockerfile](./docker.md)).

```yml
image: mcr.microsoft.com/playwright/java:v%%VERSION%%-noble
```

### GitLab CI

To run Playwright tests on GitLab, use our public Docker image ([see Dockerfile](./docker.md)).

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright/java:v%%VERSION%%-noble
  script:
  ...
```

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-noble
  script:
  ...
```

## Caching browsers

Caching browser binaries is not recommended, since the amount of time it takes to restore the cache is comparable to the time it takes to download the binaries. Especially under Linux, [operating system dependencies](./browsers.md#install-system-dependencies) need to be installed, which are not cacheable.

If you still want to cache the browser binaries between CI runs, cache [these directories](./browsers.md#managing-browser-binaries) in your CI configuration, against a hash of the Playwright version.

## Debugging browser launches

Playwright supports the `DEBUG` environment variable to output debug logs during execution. Setting it to `pw:browser` is helpful while debugging `Error: Failed to launch browser` errors.

```bash
DEBUG=pw:browser mvn test
```

## Running headed

By default, Playwright launches browsers in headless mode. See in our [Running tests](./running-tests.md#run-tests-in-headed-mode) guide how to run tests in headed mode.

On Linux agents, headed execution requires [Xvfb](https://en.wikipedia.org/wiki/Xvfb) to be installed. Our [Docker image](./docker.md) and GitHub Action have Xvfb pre-installed. To run browsers in headed mode with Xvfb, add `xvfb-run` before the actual command.

```bash
xvfb-run mvn test
```
