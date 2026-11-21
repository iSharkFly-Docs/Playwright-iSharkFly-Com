---
title: "Setting up CI"
---

# Setting up CI

## Introduction

Playwright tests can be run on any CI provider. In this section we cover running tests on GitHub using GitHub Actions. If you would like to see how to configure other CI providers, check out our detailed [doc on Continuous Integration](./ci.md).

#### You will learn
- [How to set up GitHub Actions](/ci-intro.md#setting-up-github-actions)
- [How to view test logs](/ci-intro.md#viewing-test-logs)
- [How to view the trace](/ci-intro.md#viewing-the-trace)

## Setting up GitHub Actions

To add a [GitHub Actions](https://docs.github.com/en/actions) file, first create `.github/workflows` folder and inside it add a `playwright.yml` file containing the example code below so that your tests run on each push and pull request for the main/master branch.

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

To learn more about this, see ["Understanding GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

Looking at the list of steps in `jobs.test.steps`, you can see that the workflow performs these steps:
1. Clone your repository
1. Install language dependencies
1. Install project dependencies and build
1. Install Playwright Browsers
1. Run tests

## Create a Repo and Push to GitHub

Once you have your [GitHub Actions workflow](#setting-up-github-actions) setup, then all you need to do is [Create a repo on GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo) or push your code to an existing repository. Follow the instructions on GitHub and don't forget to [initialize a git repository](https://github.com/git-guides/git-init) using the `git init` command so you can [add](https://github.com/git-guides/git-add), [commit](https://github.com/git-guides/git-commit), and [push](https://github.com/git-guides/git-push) your code.

###### 
<img height="745" width="1721" alt="Create a Repo and Push to GitHub" src="https://user-images.githubusercontent.com/13063165/183423254-d2735278-a2ab-4d63-bb99-48d8e5e447bc.png"/>

## Opening the Workflows

Click on the **Actions** tab to see the workflows. Here you see if your tests have passed or failed.

###### 
<img src="https://user-images.githubusercontent.com/13063165/183423783-58bf2008-514e-4f96-9c12-c9a55703960c.png" alt="opening the workflow" width="1678" height="1207" />

## Viewing Test Logs

Clicking on the workflow run shows you all the actions that GitHub performed and clicking on **Run Playwright tests** shows the error messages, what was expected and what was received as well as the call log.

###### 
<img src="https://user-images.githubusercontent.com/13063165/183423783-58bf2008-514e-4f96-9c12-c9a55703960c.png" alt="Viewing Test Logs" width="1678" height="1207" />

## Viewing the Trace

[trace.playwright.dev](https://trace.playwright.dev) is a statically hosted variant of the Trace Viewer. You can upload trace files using drag and drop.

![playwright trace viewer](/images/getting-started/trace-viewer-failed-test.png)

## Properly handling Secrets

Artifacts like trace files or console logs contain information about your test execution.
They can contain sensitive data like user credentials for a test user, access tokens to a staging backend, testing source code, or sometimes even your application source code. Treat these files just as carefully as you treat that sensitive data.
If you upload reports and traces as part of your CI workflow, make sure that you only upload them to trusted artifact stores, or that you encrypt the files before upload. The same is true for sharing artifacts with team members: Use a trusted file share or encrypt the files before sharing.

## What's Next
- [Learn how to use Locators](./locators.md)
- [Learn how to perform Actions](./input.md)
- [Learn how to write Assertions](./test-assertions.md)
- [Learn more about the Trace Viewer](/trace-viewer.md)
- [Learn more ways of running tests on GitHub Actions](/ci.md#github-actions)
- [Learn more about running tests on other CI providers](/ci.md)
