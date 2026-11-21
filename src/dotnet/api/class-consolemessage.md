---
title: ConsoleMessage
outline: 2
---

# ConsoleMessage

<Badge type="info" text="Added in: v1.8" />

[ConsoleMessage](/dotnet/api/class-consolemessage) objects are dispatched by page via the [`Page.Console`](/dotnet/api/class-page#page-event-console) event.
For each console message logged in the page there will be corresponding event in the Playwright
context.

```csharp
// Listen for all console messages and print them to the standard output.
page.Console += (_, msg) => Console.WriteLine(msg.Text);

// Listen for all console messages and print errors to the standard output.
page.Console += (_, msg) =>
{
    if ("error".Equals(msg.Type))
        Console.WriteLine("Error text: " + msg.Text);
};

// Get the next console message
var waitForMessageTask = page.WaitForConsoleMessageAsync();
await page.EvaluateAsync("console.log('hello', 42, { foo: 'bar' });");
var message = await waitForMessageTask;
// Deconstruct console.log arguments
await message.Args.ElementAt(0).JsonValueAsync<string>(); // hello
await message.Args.ElementAt(1).JsonValueAsync<int>(); // 42
```

## Methods

### ConsoleMessage.Args() {#console-message-args}

<Badge type="info" text="Added in: v1.8" />

List of arguments passed to a `console` function call. See also [`Page.Console`](/dotnet/api/class-page#page-event-console).

**Returns**

- `Array<JSHandle>`


### ConsoleMessage.Location() {#console-message-location}

<Badge type="info" text="Added in: v1.8" />

URL of the resource followed by 0-based line and column numbers in the resource formatted as `URL:line:column`.

**Returns**

- `string`


### ConsoleMessage.Page() {#console-message-page}

<Badge type="info" text="Added in: v1.34" />

The page that produced this console message, if any.

**Returns**

- `null | Page`


### ConsoleMessage.Text() {#console-message-text}

<Badge type="info" text="Added in: v1.8" />

The text of the console message.

**Returns**

- `string`


### ConsoleMessage.Timestamp() {#console-message-timestamp}

<Badge type="info" text="Added in: v1.59" />

The timestamp of the console message in milliseconds since the Unix epoch.

**Returns**

- `float`


### ConsoleMessage.Type() {#console-message-type}

<Badge type="info" text="Added in: v1.8" />

One of the following values: `'log'`, `'debug'`, `'info'`, `'error'`, `'warning'`, `'dir'`, `'dirxml'`, `'table'`,
`'trace'`, `'clear'`, `'startGroup'`, `'startGroupCollapsed'`, `'endGroup'`, `'assert'`, `'profile'`, `'profileEnd'`,
`'count'`, `'timeEnd'`.

**Returns**

- `string`


### ConsoleMessage.Worker() {#console-message-worker}

<Badge type="info" text="Added in: v1.57" />

The web worker or service worker that produced this console message, if any. Note that console messages from web workers also have non-null [`ConsoleMessage.Page()`](/dotnet/api/class-consolemessage#console-message-page).

**Returns**

- `null | Worker`

