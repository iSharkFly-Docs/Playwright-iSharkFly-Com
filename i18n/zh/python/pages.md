---
title: "页面"
---

# 页面

## 页面

每个 [BrowserContext](/python/api/class-browsercontext) 可以有多个页面。一个 [Page](/python/api/class-page) 指的是浏览器上下文中的单个标签页或弹出窗口。它应该用于导航到 URL 并与页面内容交互。

::: code-group

```python [Async]
page = await context.new_page()

# 显式导航，类似于在浏览器中输入 URL。
await page.goto('http://example.com')
# 填写输入框。
await page.locator('#search').fill('query')

# 通过点击链接隐式导航。
await page.locator('#submit').click()
# 期望新的 URL。
print(page.url)
```

```python [Sync]
page = context.new_page()

# 显式导航，类似于在浏览器中输入 URL。
page.goto('http://example.com')
# 填写输入框。
page.locator('#search').fill('query')

# 通过点击链接隐式导航。
page.locator('#submit').click()
# 期望新的 URL。
print(page.url)
```

:::

## 多个页面

每个浏览器上下文可以托管多个页面（标签页）。
* 每个页面的行为就像一个聚焦的、活动的页面。不需要将页面带到前台。
* 上下文内的页面遵守上下文级别的模拟设置，如视口大小、自定义网络路由或浏览器语言环境。

::: code-group

```python [Async]
# 创建两个页面
page_one = await context.new_page()
page_two = await context.new_page()

# 获取浏览器上下文的页面
all_pages = context.pages
```

```python [Sync]
# 创建两个页面
page_one = context.new_page()
page_two = context.new_page()

# 获取浏览器上下文的页面
all_pages = context.pages
```

:::

## 处理新页面

浏览器上下文上的 `page` 事件可用于获取在上下文中创建的新页面。这可用于处理由 `target="_blank"` 链接打开的新页面。

::: code-group

```python [Async]
# 在特定操作后获取页面（例如点击链接）
async with context.expect_page() as new_page_info:
    await page.get_by_text("open new tab").click() # 打开新标签页
new_page = await new_page_info.value

# 正常与新页面交互
await new_page.get_by_role("button").click()
print(await new_page.title())
```

```python [Sync]
# 在特定操作后获取页面（例如点击链接）
with context.expect_page() as new_page_info:
    page.get_by_text("open new tab").click() # 打开新标签页
new_page = new_page_info.value

# 正常与新页面交互
new_page.get_by_role("button").click()
print(new_page.title())
```

:::

如果触发新页面的操作是未知的，可以使用以下模式。

::: code-group

```python [Async]
# 获取上下文中的所有新页面（包括弹出窗口）
async def handle_page(page):
    await page.wait_for_load_state()
    print(await page.title())

context.on("page", handle_page)
```

```python [Sync]
# 获取上下文中的所有新页面（包括弹出窗口）
def handle_page(page):
    page.wait_for_load_state()
    print(page.title())

context.on("page", handle_page)
```

:::

## 处理弹出窗口

如果页面打开弹出窗口（例如由 `target="_blank"` 链接打开的页面），你可以通过监听页面上的 `popup` 事件来获取对它的引用。

此事件除了 `browserContext.on('page')` 事件之外还会被触发，但仅针对与此页面相关的弹出窗口。

::: code-group

```python [Async]
# 在特定操作后获取弹出窗口（例如点击）
async with page.expect_popup() as popup_info:
    await page.get_by_text("open the popup").click()
popup = await popup_info.value

# 正常与弹出窗口交互
await popup.get_by_role("button").click()
print(await popup.title())
```

```python [Sync]
# 在特定操作后获取弹出窗口（例如点击）
with page.expect_popup() as popup_info:
    page.get_by_text("open the popup").click()
popup = popup_info.value

# 正常与弹出窗口交互
popup.get_by_role("button").click()
print(popup.title())
```

:::

如果触发弹出窗口的操作是未知的，可以使用以下模式。

::: code-group

```python [Async]
# 在弹出窗口打开时获取所有弹出窗口
async def handle_popup(popup):
    await popup.wait_for_load_state()
    print(await popup.title())

page.on("popup", handle_popup)
```

```python [Sync]
# 在弹出窗口打开时获取所有弹出窗口
def handle_popup(popup):
    popup.wait_for_load_state()
    print(popup.title())

page.on("popup", handle_popup)
```

:::
