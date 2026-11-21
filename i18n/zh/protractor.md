---
title: "从 Protractor 迁移"
---

# 从 Protractor 迁移

## 迁移原则
- 不需要"webdriver-manager" / Selenium。
- Protractor 的 [ElementFinder] 对应 [Playwright Test 定位器](./api/class-locator)
- Protractor 的 [`waitForAngular`] 对应 Playwright Test 的[自动等待](./actionability.md)
- 不要忘记在 Playwright Test 中使用 await

## 速查表

| Protractor                                        | Playwright Test                         |
|---------------------------------------------------|-----------------------------------------|
| `element(by.buttonText('...'))`                   | `page.locator('button, input[type="button"], input[type="submit"] >> text="..."')` |
| `element(by.css('...'))`                          | `page.locator('...')`                   |
| `element(by.cssContainingText('..1..', '..2..'))` | `page.locator('..1.. >> text=..2..')`   |
| `element(by.id('...'))`                           | `page.locator('#...')`                  |
| `element(by.model('...'))`                        | `page.locator('[ng-model="..."]')`      |
| `element(by.repeater('...'))`                     | `page.locator('[ng-repeat="..."]')`     |
| `element(by.xpath('...'))`                        | `page.locator('xpath=...')`             |
| `element.all`                                     | `page.locator`                          |
| `browser.get(url)`                                | `await page.goto(url)`                  |
| `browser.getCurrentUrl()`                         | `page.url()`                            |

## 示例

Protractor:

```js
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('first test');
    element(by.css('[value="add"]')).click();

    const todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('first test');

    // 你写好了第一个测试，从列表中划掉它
    todoList.get(2).element(by.css('input')).click();
    const completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});
```

逐行迁移到 Playwright Test：

```js
const { test, expect } = require('@playwright/test'); // 1

test.describe('angularjs homepage todo list', () => {
  test('should add a todo', async ({ page }) => { // 2, 3
    await page.goto('https://angularjs.org'); // 4

    await page.locator('[ng-model="todoList.todoText"]').fill('first test');
    await page.locator('[value="add"]').click();

    const todoList = page.locator('[ng-repeat="todo in todoList.todos"]'); // 5
    await expect(todoList).toHaveCount(3);
    await expect(todoList.nth(2)).toHaveText('first test', {
      useInnerText: true,
    });

    // 你写好了第一个测试，从列表中划掉它
    await todoList.nth(2).getByRole('textbox').click();
    const completedAmount = page.locator('.done-true');
    await expect(completedAmount).toHaveCount(2);
  });
});
```

迁移要点（请参阅 Playwright Test 代码片段中的内联注释）：
1. 每个 Playwright Test 文件都显式导入 `test` 和 `expect` 函数
1. 测试函数标记为 `async`
1. Playwright Test 会将 `page` 作为参数之一提供。这是 Playwright Test 中众多[有用的 fixtures](./api/class-fixtures) 之一。
1. 几乎所有 Playwright 调用都以 `await` 为前缀
1. 使用 [`page.locator()`](/api/class-page#page-locator) 创建定位器是少数同步方法之一。

## 实现 `waitForAngular` 的 Polyfill

Playwright Test 具有内置的[自动等待](./actionability.md)功能，使得 protractor 的 [`waitForAngular`] 在一般情况下不再需要。

但是，在某些边缘情况下它可能会派上用场。
以下是如何在 Playwright Test 中实现 `waitForAngular` 函数的 polyfill：
1. 确保你的 package.json 中安装了 protractor
1. Polyfill 函数
   
   ```js
   async function waitForAngular(page) {
     const clientSideScripts = require('protractor/built/clientsidescripts.js');
   
     async function executeScriptAsync(page, script, ...scriptArgs) {
       await page.evaluate(`
         new Promise((resolve, reject) => {
           const callback = (errMessage) => {
             if (errMessage)
               reject(new Error(errMessage));
             else
               resolve();
           };
           (function() {${script}}).apply(null, [...${JSON.stringify(scriptArgs)}, callback]);
         })
       `);
     }
   
     await executeScriptAsync(page, clientSideScripts.waitForAngular, '');
   }
   ```
   
   如果你不想保留 protractor 依赖，你也可以使用这个更简单的方法（仅适用于 Angular 2+）：
   
   ```js
   async function waitForAngular(page) {
     await page.evaluate(async () => {
       // @ts-expect-error
       if (window.getAllAngularTestabilities) {
         // @ts-expect-error
         await Promise.all(window.getAllAngularTestabilities().map(whenStable));
         // @ts-expect-error
         async function whenStable(testability) {
           return new Promise(res => testability.whenStable(res));
         }
       }
     });
   }
   ```
1. Polyfill 用法
   
   ```js
   const page = await context.newPage();
   await page.goto('https://example.org');
   await waitForAngular(page);
   ```

## Playwright Test 的超强能力

一旦使用 Playwright Test，你将获得很多功能！
- 完全零配置的 TypeScript 支持
- 在**任何流行操作系统**（Windows、macOS、Ubuntu）上的**所有 Web 引擎**（Chrome、Firefox、Safari）上运行测试
- 完全支持多源、[(i)frames](./api/class-frame)、[标签页和上下文](./pages)
- 在多个浏览器上并行运行测试
- 内置测试[产物收集](./test-use-options.md#recording-options)

你还将获得与 Playwright Test 捆绑在一起的所有这些精彩工具：
- [Playwright Inspector](./debug.md)
- [Playwright Test 代码生成](./codegen-intro.md)
- [Playwright Tracing](./trace-viewer.md) 用于事后调试

## 延伸阅读

了解更多关于 Playwright Test 运行器的信息：
- [入门指南](./intro)
- [Fixtures](./test-fixtures)
- [定位器](./locators)
- [断言](./test-assertions)
- [自动等待](./actionability)

[ElementFinder]: https://www.protractortest.org/#/api?view=ElementFinder
[`waitForAngular`]: https://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.waitForAngular
