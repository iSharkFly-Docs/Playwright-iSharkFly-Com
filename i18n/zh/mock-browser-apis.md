---
title: "模拟浏览器 API"
---

# 模拟浏览器 API

## 简介

Playwright 为大多数浏览器功能提供了原生支持。然而，有一些实验性 API 和部分 API 尚未被所有浏览器完全支持。在这种情况下，Playwright 通常不提供专门的自动化 API。你可以使用模拟来测试应用程序在这些情况下的行为。本指南提供了一些示例。

让我们考虑一个使用 [battery API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery) 来显示设备电池状态的 Web 应用。我们将模拟 battery API 并检查页面是否正确显示电池状态。

## 创建模拟

由于页面可能在加载过程中很早就调用 API，因此在页面开始加载之前设置所有模拟非常重要。实现这一目标的最简单方法是调用 [`page.addInitScript()`](/api/class-page#page-add-init-script)：

```js
await page.addInitScript(() => {
  const mockBattery = {
    level: 0.75,
    charging: true,
    chargingTime: 1800,
    dischargingTime: Infinity,
    addEventListener: () => { }
  };
  // 覆盖该方法以始终返回模拟的电池信息。
  window.navigator.getBattery = async () => mockBattery;
});
```

完成后，你可以导航到页面并检查其 UI 状态：

```js
// 在每个测试之前配置模拟 API。
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.90,
      charging: true,
      chargingTime: 1800, // 秒
      dischargingTime: Infinity,
      addEventListener: () => { }
    };
    // 覆盖该方法以始终返回模拟的电池信息。
    window.navigator.getBattery = async () => mockBattery;
  });
});

test('show battery status', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('90%');
  await expect(page.locator('.battery-status')).toHaveText('Adapter');
  await expect(page.locator('.battery-fully')).toHaveText('00:30');
});

```

## 模拟只读 API

某些 API 是只读的，因此你无法对 navigator 属性进行赋值。例如，

```js
// 以下行不会产生任何效果。
navigator.cookieEnabled = true;
```

但是，如果该属性是[可配置的](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#configurable)，你仍然可以使用原生 JavaScript 来覆盖它：

```js
await page.addInitScript(() => {
  Object.defineProperty(Object.getPrototypeOf(navigator), 'cookieEnabled', { value: false });
});
```

## 验证 API 调用

有时检查页面是否进行了所有预期的 API 调用是很有用的。你可以记录所有 API 方法调用，然后将它们与预期结果进行比较。[`page.exposeFunction()`](/api/class-page#page-expose-function) 可以方便地将消息从页面传递回测试代码：

```js
test('log battery calls', async ({ page }) => {
  const log = [];
  // 暴露函数以将消息推送到 Node.js 脚本。
  await page.exposeFunction('logCall', msg => log.push(msg));
  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.75,
      charging: true,
      chargingTime: 1800,
      dischargingTime: Infinity,
      // 记录 addEventListener 调用。
      addEventListener: (name, cb) => logCall(`addEventListener:${name}`)
    };
    // 覆盖该方法以始终返回模拟的电池信息。
    window.navigator.getBattery = async () => {
      logCall('getBattery');
      return mockBattery;
    };
  });

  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('75%');

  // 将实际调用与预期结果进行比较。
  expect(log).toEqual([
    'getBattery',
    'addEventListener:chargingchange',
    'addEventListener:levelchange'
  ]);
});
```

## 更新模拟

为了测试应用程序是否正确反映电池状态更新，确保模拟的电池对象触发与浏览器实现相同的事件非常重要。以下测试演示了如何实现这一点：

```js
test('update battery status (no golden)', async ({ page }) => {
  await page.addInitScript(() => {
    // 当电池状态改变时通知相应监听器的模拟类。
    class BatteryMock {
      level = 0.10;
      charging = false;
      chargingTime = 1800;
      dischargingTime = Infinity;
      _chargingListeners = [];
      _levelListeners = [];
      addEventListener(eventName, listener) {
        if (eventName === 'chargingchange')
          this._chargingListeners.push(listener);
        if (eventName === 'levelchange')
          this._levelListeners.push(listener);
      }
      // 将被测试调用。
      _setLevel(value) {
        this.level = value;
        this._levelListeners.forEach(cb => cb());
      }
      _setCharging(value) {
        this.charging = value;
        this._chargingListeners.forEach(cb => cb());
      }
    }
    const mockBattery = new BatteryMock();
    // 覆盖该方法以始终返回模拟的电池信息。
    window.navigator.getBattery = async () => mockBattery;
    // 将模拟对象保存到 window 以便于访问。
    window.mockBattery = mockBattery;
  });

  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('10%');

  // 将电量更新到 27.5%
  await page.evaluate(() => window.mockBattery._setLevel(0.275));
  await expect(page.locator('.battery-percentage')).toHaveText('27.5%');
  await expect(page.locator('.battery-status')).toHaveText('Battery');

  // 模拟连接适配器
  await page.evaluate(() => window.mockBattery._setCharging(true));
  await expect(page.locator('.battery-status')).toHaveText('Adapter');
  await expect(page.locator('.battery-fully')).toHaveText('00:30');
});
```
