---
title: TestStep
outline: 2
---

# TestStep

<Badge type="info" text="Added in: v1.10" />

Represents a step in a [TestResult](/api/class-testresult).

## Methods

### testStep.titlePath() {#test-step-title-path}

<Badge type="info" text="Added in: v1.10" />

Returns a list of step titles from the root step down to this step.

**Returns**

- `Array<string>`


## Properties

### testStep.annotations {#test-step-annotations}

<Badge type="info" text="Added in: v1.51" />

The list of annotations applicable to the current test step.

**Type**

- `Array<Object>`


### testStep.attachments {#test-step-attachments}

<Badge type="info" text="Added in: v1.50" />

The list of files or buffers attached in the step execution through [`testInfo.attach()`](/api/class-testinfo#test-info-attach).

**Type**

- `Array<Object>`


### testStep.category {#test-step-category}

<Badge type="info" text="Added in: v1.10" />

Step category to differentiate steps with different origin and verbosity. Built-in categories are:
* `expect` for expect calls
* `fixture` for fixtures setup and teardown
* `hook` for hooks initialization and teardown
* `pw:api` for Playwright API calls.
* `test.step` for test.step API calls.
* `test.attach` for testInfo.attach API calls.

**Type**

- `string`


### testStep.duration {#test-step-duration}

<Badge type="info" text="Added in: v1.10" />

Running time in milliseconds.

**Type**

- `float`


### testStep.error {#test-step-error}

<Badge type="info" text="Added in: v1.10" />

Error thrown during the step execution, if any.

**Type**

- `TestError`


### testStep.location {#test-step-location}

<Badge type="info" text="Added in: v1.10" />

Optional location in the source where the step is defined.

**Type**

- `Location`


### testStep.params {#test-step-params}

<Badge type="info" text="Added in: v1.63" />

Step-dependent parameters, when available. For example, steps produced by the Playwright API calls contain the target
`locator` and the call arguments such as `url`, while [`test.step()`](/api/class-test#test-step) steps contain the parameters passed by the
test author.

```js
// { locator: 'getByRole(\'button\')' }
await page.getByRole('button').click();

// { url: 'https://example.com' }
await page.goto('https://example.com');

// { locator: 'getByLabel(\'Password\')', value: 'secret' }
await page.getByLabel('Password').fill('secret');

// { orderId: 42 }
await test.step('checkout', async () => {
  // ...
}, { params: { orderId: 42 } });
```

To keep the reports small, Playwright API calls only report a curated set of arguments per call, and long string values
are truncated. Unbounded arguments such as the page content, evaluated expressions or request bodies are never
reported.

**Type**

- `Object<string, any>`


### testStep.parent {#test-step-parent}

<Badge type="info" text="Added in: v1.10" />

Parent step, if any.

**Type**

- `TestStep`


### testStep.startTime {#test-step-start-time}

<Badge type="info" text="Added in: v1.10" />

Start time of this particular test step.

**Type**

- `Date`


### testStep.steps {#test-step-steps}

<Badge type="info" text="Added in: v1.10" />

List of steps inside this step.

**Type**

- `Array<TestStep>`


### testStep.subtitle {#test-step-subtitle}

<Badge type="info" text="Added in: v1.63" />

User-friendly test step subtitle that complements the title, when available. For Playwright API
calls, it is the target locator or the navigation url. For example, a `Click` step has the clicked
locator as a subtitle. [`test.step()`](/api/class-test#test-step) steps carry the subtitle passed by the test author.
User interfaces typically render the subtitle next to the title or on a separate line.

```js
// title `Click`, subtitle `getByRole('button')`
await page.getByRole('button').click();

// title `Navigate`, subtitle `example.com/index.html`
await page.goto('https://example.com/index.html');

// title `Add to cart`, subtitle `SKU 42`
await test.step('Add to cart', async () => {
  // ...
}, { subtitle: 'SKU 42' });
```

**Type**

- `string`


### testStep.title {#test-step-title}

<Badge type="info" text="Added in: v1.10" />

User-friendly test step title, for example `Click` or `Navigate`.

**Type**

- `string`

