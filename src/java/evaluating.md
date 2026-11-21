---
title: "Evaluating JavaScript"
---

# Evaluating JavaScript

## Introduction

Playwright scripts run in your Playwright environment. Your page scripts run in the browser page environment. Those environments don't intersect, they are running in different virtual machines in different processes and even potentially on different computers.

The [`page.evaluate()`](/java/api/class-page#page-evaluate) API can run a JavaScript function in the context
of the web page and bring results back to the Playwright environment. Browser globals like
`window` and `document` can be used in `evaluate`.

```java
String href = (String) page.evaluate("document.location.href");
```

If the result is a Promise or if the function is asynchronous evaluate will automatically wait until it's resolved:

```java
int status = (int) page.evaluate("async () => {\n" +
  "  const response = await fetch(location.href);\n" +
  "  return response.status;\n" +
  "}");
```

## Different environments

Evaluated scripts run in the browser environment, while your test runs in a testing environments. This means you cannot use variables from your test in the page and vice versa. Instead, you should pass them explicitly as an argument.

The following snippet is **WRONG** because it uses the variable directly:

```java
String data = "some data";
Object result = page.evaluate("() => {\n" +
  "  // WRONG: there is no 'data' in the web page.\n" +
  "  window.myApp.use(data);\n" +
  "}");
```

The following snippet is **CORRECT** because it passes the value explicitly as an argument:

```java
String data = "some data";
// Pass |data| as a parameter.
Object result = page.evaluate("data => {\n" +
  "  window.myApp.use(data);\n" +
  "}", data);
```

## Evaluation Argument

Playwright evaluation methods like [`page.evaluate()`](/java/api/class-page#page-evaluate) take a single optional argument. This argument can be a mix of [Serializable] values and [JSHandle](/java/api/class-jshandle) instances. Handles are automatically converted to the value they represent.

```java
// A primitive value.
page.evaluate("num => num", 42);

// An array.
page.evaluate("array => array.length", Arrays.asList(1, 2, 3));

// An object.
Map<String, Object> obj = new HashMap<>();
obj.put("foo", "bar");
page.evaluate("object => object.foo", obj);

// A single handle.
ElementHandle button = page.evaluateHandle("window.button");
page.evaluate("button => button.textContent", button);

// Alternative notation using JSHandle.evaluate.
button.evaluate("(button, from) => button.textContent.substring(from)", 5);

// Object with multiple handles.
ElementHandle button1 = page.evaluateHandle("window.button1");
ElementHandle button2 = page.evaluateHandle("window.button2");
Map<String, ElementHandle> arg = new HashMap<>();
arg.put("button1", button1);
arg.put("button2", button2);
page.evaluate("o => o.button1.textContent + o.button2.textContent", arg);

// Object destructuring works. Note that property names must match
// between the destructured object and the argument.
// Also note the required parenthesis.
Map<String, ElementHandle> arg = new HashMap<>();
arg.put("button1", button1);
arg.put("button2", button2);
page.evaluate("({ button1, button2 }) => button1.textContent + button2.textContent", arg);

// Array works as well. Arbitrary names can be used for destructuring.
// Note the required parenthesis.
page.evaluate(
  "([b1, b2]) => b1.textContent + b2.textContent",
  Arrays.asList(button1, button2));

// Any mix of serializables and handles works.
Map<String, Object> arg = new HashMap<>();
arg.put("button1", button1);
arg.put("list", Arrays.asList(button2));
arg.put("foo", 0);
page.evaluate(
  "x => x.button1.textContent + x.list[0].textContent + String(x.foo)",
  arg);
```

## Init scripts

Sometimes it is convenient to evaluate something in the page before it starts loading. For example, you might want to setup some mocks or test data.

In this case, use [`page.addInitScript()`](/java/api/class-page#page-add-init-script) or [`browserContext.addInitScript()`](/java/api/class-browsercontext#browser-context-add-init-script). In the example below, we will replace `Math.random()` with a constant value.

First, create a `preload.js` file that contains the mock.

Next, add init script to the page.

```java
// In your test, assuming the "preload.js" file is in the "mocks" directory.
page.addInitScript(Paths.get("mocks/preload.js"));
```
