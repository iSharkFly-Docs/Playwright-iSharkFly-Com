---
title: GenericAssertions
outline: 2
---

# GenericAssertions

<Badge type="info" text="Added in: v1.9" />

[GenericAssertions](/api/class-genericassertions) 类提供了可用于在测试中对任何值进行断言的断言方法。通过调用 [`playwrightAssertions.expect()`](/api/class-playwrightassertions#playwright-assertions-expect-generic) 创建 [GenericAssertions](/api/class-genericassertions) 的新实例：

```js
import { test, expect } from '@playwright/test';

test('assert a value', async ({ page }) => {
  const value = 1;
  expect(value).toBe(2);
});
```

## 方法

### genericAssertions.any() {#generic-assertions-any}

<Badge type="info" text="Added in: v1.9" />

`expect.any()` 匹配从 [`constructor`](/api/class-genericassertions#generic-assertions-any-option-constructor) 创建的任何对象实例或对应的原始类型。在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用它来执行模式匹配。

**用法**

```js
// 匹配类的实例。
class Example {}
expect(new Example()).toEqual(expect.any(Example));

// 匹配任何数字。
expect({ prop: 1 }).toEqual({ prop: expect.any(Number) });

// 匹配任何字符串。
expect('abc').toEqual(expect.any(String));
```

**参数**

- <a id="generic-assertions-any-option-constructor"></a>`constructor` `Function`

  预期对象的构造函数，如 `ExampleClass`，或原始装箱类型，如 `Number`。


### genericAssertions.anything() {#generic-assertions-anything}

<Badge type="info" text="Added in: v1.9" />

`expect.anything()` 匹配除 `null` 和 `undefined` 之外的所有内容。在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用它来执行模式匹配。

**用法**

```js
const value = { prop: 1 };
expect(value).toEqual({ prop: expect.anything() });
expect(value).not.toEqual({ otherProp: expect.anything() });
```


### genericAssertions.arrayContaining() {#generic-assertions-array-containing}

<Badge type="info" text="Added in: v1.9" />

`expect.arrayContaining()` 匹配包含预期数组中所有元素（任意顺序）的数组。注意接收的数组可能是预期数组的超集并包含一些额外的元素。

在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用此方法来执行模式匹配。

**用法**

```js
expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
```

**参数**

- <a id="generic-assertions-array-containing-option-expected"></a>`expected` `Array<any>`

  作为接收值子集的预期数组。


### genericAssertions.arrayOf() {#generic-assertions-array-of}

<Badge type="info" text="Added in: v1.57" />

`expect.arrayOf()` 匹配从 [`constructor`](/api/class-genericassertions#generic-assertions-array-of-option-constructor) 创建的对象数组或对应的原始类型。在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用它来执行模式匹配。

**用法**

```js
// 匹配类的实例。
class Example {}
expect([new Example(), new Example()]).toEqual(expect.arrayOf(Example));

// 匹配任何字符串。
expect(['a', 'b', 'c']).toEqual(expect.arrayOf(String));
```

**参数**

- <a id="generic-assertions-array-of-option-constructor"></a>`constructor` `Function`

  预期对象的构造函数，如 `ExampleClass`，或原始装箱类型，如 `Number`。


### genericAssertions.closeTo() {#generic-assertions-close-to}

<Badge type="info" text="Added in: v1.9" />

比较浮点数的近似相等性。在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用此方法来执行模式匹配。当只是比较两个数字时，优先使用 [`genericAssertions.toBeCloseTo()`](/api/class-genericassertions#generic-assertions-to-be-close-to)。

**用法**

```js
expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
```

**参数**

- <a id="generic-assertions-close-to-option-expected"></a>`expected` `float`

  预期值。
- <a id="generic-assertions-close-to-option-num-digits"></a>`numDigits` `int` *(可选)*

  小数点后必须相等的小数位数。


### genericAssertions.objectContaining() {#generic-assertions-object-containing}

<Badge type="info" text="Added in: v1.9" />

`expect.objectContaining()` 匹配包含并匹配预期对象中所有属性的对象。注意接收的对象可能是预期对象的超集并包含一些额外的属性。

在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用此方法来执行模式匹配。对象属性可以是匹配器以进一步放宽期望。参见示例。

**用法**

```js
// 断言部分属性。
expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));

// 匹配器也可以用于属性。
expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));

// 子属性的复杂匹配。
expect({
  list: [1, 2, 3],
  obj: { prop: 'Hello world!', another: 'some other value' },
  extra: 'extra',
}).toEqual(expect.objectContaining({
  list: expect.arrayContaining([2, 3]),
  obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
}));
```

**参数**

- <a id="generic-assertions-object-containing-option-expected"></a>`expected` `Object`

  包含属性子集的预期对象模式。


### genericAssertions.stringContaining() {#generic-assertions-string-containing}

<Badge type="info" text="Added in: v1.9" />

`expect.stringContaining()` 匹配包含预期子字符串的字符串。在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用此方法来执行模式匹配。

**用法**

```js
expect('Hello world!').toEqual(expect.stringContaining('Hello'));
```

**参数**

- <a id="generic-assertions-string-containing-option-expected"></a>`expected` `string`

  预期的子字符串。


### genericAssertions.stringMatching() {#generic-assertions-string-matching}

<Badge type="info" text="Added in: v1.9" />

`expect.stringMatching()` 匹配与预期模式匹配的接收字符串。在 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 内部使用此方法来执行模式匹配。

**用法**

```js
expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));

// 在另一个匹配器内部。
expect({
  status: 'passed',
  time: '123ms',
}).toEqual({
  status: expect.stringMatching(/passed|failed/),
  time: expect.stringMatching(/\d+m?s/),
});
```

**参数**

- <a id="generic-assertions-string-matching-option-expected"></a>`expected` `string | RegExp`

  预期字符串应匹配的模式。


### genericAssertions.toBe() {#generic-assertions-to-be}

<Badge type="info" text="Added in: v1.9" />

通过调用 `Object.is` 将值与 [`expected`](/api/class-genericassertions#generic-assertions-to-be-option-expected) 进行比较。此方法通过引用而不是内容来比较对象，类似于严格相等运算符 `===`。

**用法**

```js
const value = { prop: 1 };
expect(value).toBe(value);
expect(value).not.toBe({});
expect(value.prop).toBe(1);
```

**参数**

- <a id="generic-assertions-to-be-option-expected"></a>`expected` `any`

  预期值。


### genericAssertions.toBeCloseTo() {#generic-assertions-to-be-close-to}

<Badge type="info" text="Added in: v1.9" />

比较浮点数的近似相等性。在比较浮点数时使用此方法而不是 [`genericAssertions.toBe()`](/api/class-genericassertions#generic-assertions-to-be)。

**用法**

```js
expect(0.1 + 0.2).not.toBe(0.3);
expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
```

**参数**

- <a id="generic-assertions-to-be-close-to-option-expected"></a>`expected` `float`

  预期值。
- <a id="generic-assertions-to-be-close-to-option-num-digits"></a>`numDigits` `int` *(可选)*

  小数点后必须相等的小数位数。


### genericAssertions.toBeDefined() {#generic-assertions-to-be-defined}

<Badge type="info" text="Added in: v1.9" />

确保值不是 `undefined`。

**用法**

```js
const value = null;
expect(value).toBeDefined();
```


### genericAssertions.toBeFalsy() {#generic-assertions-to-be-falsy}

<Badge type="info" text="Added in: v1.9" />

确保值在布尔上下文中为假，即 `false`、`0`、`''`、`null`、`undefined` 或 `NaN` 之一。当你不关心具体值时使用此方法。

**用法**

```js
const value = null;
expect(value).toBeFalsy();
```


### genericAssertions.toBeGreaterThan() {#generic-assertions-to-be-greater-than}

<Badge type="info" text="Added in: v1.9" />

确保 `value > expected` 适用于数字或大整数值。

**用法**

```js
const value = 42;
expect(value).toBeGreaterThan(1);
```

**参数**

- <a id="generic-assertions-to-be-greater-than-option-expected"></a>`expected` `float | bigint`

  要比较的值。


### genericAssertions.toBeGreaterThanOrEqual() {#generic-assertions-to-be-greater-than-or-equal}

<Badge type="info" text="Added in: v1.9" />

确保 `value >= expected` 适用于数字或大整数值。

**用法**

```js
const value = 42;
expect(value).toBeGreaterThanOrEqual(42);
```

**参数**

- <a id="generic-assertions-to-be-greater-than-or-equal-option-expected"></a>`expected` `float | bigint`

  要比较的值。


### genericAssertions.toBeInstanceOf() {#generic-assertions-to-be-instance-of}

<Badge type="info" text="Added in: v1.9" />

确保值是类的实例。使用 `instanceof` 运算符。

**用法**

```js
expect(page).toBeInstanceOf(Page);

class Example {}
expect(new Example()).toBeInstanceOf(Example);
```

**参数**

- <a id="generic-assertions-to-be-instance-of-option-expected"></a>`expected` `Function`

  类或构造函数。


### genericAssertions.toBeLessThan() {#generic-assertions-to-be-less-than}

<Badge type="info" text="Added in: v1.9" />

确保 `value < expected` 适用于数字或大整数值。

**用法**

```js
const value = 42;
expect(value).toBeLessThan(100);
```

**参数**

- <a id="generic-assertions-to-be-less-than-option-expected"></a>`expected` `float | bigint`

  要比较的值。


### genericAssertions.toBeLessThanOrEqual() {#generic-assertions-to-be-less-than-or-equal}

<Badge type="info" text="Added in: v1.9" />

确保 `value <= expected` 适用于数字或大整数值。

**用法**

```js
const value = 42;
expect(value).toBeLessThanOrEqual(42);
```

**参数**

- <a id="generic-assertions-to-be-less-than-or-equal-option-expected"></a>`expected` `float | bigint`

  要比较的值。


### genericAssertions.toBeNaN() {#generic-assertions-to-be-na-n}

<Badge type="info" text="Added in: v1.9" />

确保值是 `NaN`。

**用法**

```js
const value = NaN;
expect(value).toBeNaN();
```


### genericAssertions.toBeNull() {#generic-assertions-to-be-null}

<Badge type="info" text="Added in: v1.9" />

确保值是 `null`。

**用法**

```js
const value = null;
expect(value).toBeNull();
```


### genericAssertions.toBeTruthy() {#generic-assertions-to-be-truthy}

<Badge type="info" text="Added in: v1.9" />

确保值在布尔上下文中为真，**除了** `false`、`0`、`''`、`null`、`undefined` 或 `NaN` 之外的任何内容。当你不关心具体值时使用此方法。

**用法**

```js
const value = { example: 'value' };
expect(value).toBeTruthy();
```


### genericAssertions.toBeUndefined() {#generic-assertions-to-be-undefined}

<Badge type="info" text="Added in: v1.9" />

确保值是 `undefined`。

**用法**

```js
const value = undefined;
expect(value).toBeUndefined();
```


### genericAssertions.toContain() {#generic-assertions-to-contain-1}

<Badge type="info" text="Added in: v1.9" />

确保字符串值包含预期的子字符串。比较区分大小写。

**用法**

```js
const value = 'Hello, World';
expect(value).toContain('World');
expect(value).toContain(',');
```

**参数**

- <a id="generic-assertions-to-contain-1-option-expected"></a>`expected` `string`

  预期的子字符串。


### genericAssertions.toContain() {#generic-assertions-to-contain-2}

<Badge type="info" text="Added in: v1.9" />

确保值是 `Array` 或 `Set` 并包含预期的项目。

**用法**

```js
const value = [1, 2, 3];
expect(value).toContain(2);
expect(new Set(value)).toContain(2);
```

**参数**

- <a id="generic-assertions-to-contain-2-option-expected"></a>`expected` `any`

  集合中的预期值。


### genericAssertions.toContainEqual() {#generic-assertions-to-contain-equal}

<Badge type="info" text="Added in: v1.9" />

确保值是 `Array` 或 `Set` 并包含等于预期的项目。

对于对象，此方法递归检查所有字段的相等性，而不是像 [`genericAssertions.toContain()`](/api/class-genericassertions#generic-assertions-to-contain-2) 那样通过引用比较对象。

对于原始值，此方法等同于 [`genericAssertions.toContain()`](/api/class-genericassertions#generic-assertions-to-contain-2)。

**用法**

```js
const value = [
  { example: 1 },
  { another: 2 },
  { more: 3 },
];
expect(value).toContainEqual({ another: 2 });
expect(new Set(value)).toContainEqual({ another: 2 });
```

**参数**

- <a id="generic-assertions-to-contain-equal-option-expected"></a>`expected` `any`

  集合中的预期值。


### genericAssertions.toEqual() {#generic-assertions-to-equal}

<Badge type="info" text="Added in: v1.9" />

将值的内容与 [`expected`](/api/class-genericassertions#generic-assertions-to-equal-option-expected) 的内容进行比较，执行"深度相等"检查。

对于对象，此方法递归检查所有字段的相等性，而不是像 [`genericAssertions.toBe()`](/api/class-genericassertions#generic-assertions-to-be) 那样通过引用比较对象。

对于原始值，此方法等同于 [`genericAssertions.toBe()`](/api/class-genericassertions#generic-assertions-to-be)。

**用法**

```js
const value = { prop: 1 };
expect(value).toEqual({ prop: 1 });
```

**非严格相等**

[`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 执行深度相等检查，比较接收值和预期值的内容。要确保两个对象引用相同的实例，请改用 [`genericAssertions.toBe()`](/api/class-genericassertions#generic-assertions-to-be)。

[`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 忽略 `undefined` 属性和数组项，并且不坚持对象类型相等。要进行更严格的匹配，请使用 [`genericAssertions.toStrictEqual()`](/api/class-genericassertions#generic-assertions-to-strict-equal)。

**模式匹配**

[`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 还可以用于在对象、数组和原始类型上执行模式匹配，借助以下匹配器：
* [`genericAssertions.any()`](/api/class-genericassertions#generic-assertions-any)
* [`genericAssertions.anything()`](/api/class-genericassertions#generic-assertions-anything)
* [`genericAssertions.arrayContaining()`](/api/class-genericassertions#generic-assertions-array-containing)
* [`genericAssertions.arrayOf()`](/api/class-genericassertions#generic-assertions-array-of)
* [`genericAssertions.closeTo()`](/api/class-genericassertions#generic-assertions-close-to)
* [`genericAssertions.objectContaining()`](/api/class-genericassertions#generic-assertions-object-containing)
* [`genericAssertions.stringContaining()`](/api/class-genericassertions#generic-assertions-string-containing)
* [`genericAssertions.stringMatching()`](/api/class-genericassertions#generic-assertions-string-matching)

以下是一个断言复杂对象内部部分值的示例：

```js
expect({
  list: [1, 2, 3],
  obj: { prop: 'Hello world!', another: 'some other value' },
  extra: 'extra',
}).toEqual(expect.objectContaining({
  list: expect.arrayContaining([2, 3]),
  obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
}));
```

**参数**

- <a id="generic-assertions-to-equal-option-expected"></a>`expected` `any`

  预期值。


### genericAssertions.toHaveLength() {#generic-assertions-to-have-length}

<Badge type="info" text="Added in: v1.9" />

确保值的 `.length` 属性等于 [`expected`](/api/class-genericassertions#generic-assertions-to-have-length-option-expected)。对数组和字符串很有用。

**用法**

```js
expect('Hello, World').toHaveLength(12);
expect([1, 2, 3]).toHaveLength(3);
```

**参数**

- <a id="generic-assertions-to-have-length-option-expected"></a>`expected` `int`

  预期的长度。


### genericAssertions.toHaveProperty() {#generic-assertions-to-have-property}

<Badge type="info" text="Added in: v1.9" />

确保提供的 `keyPath` 处的属性存在于对象上，并可选地检查属性是否等于 [`expected`](/api/class-genericassertions#generic-assertions-to-have-property-option-expected)。相等性递归检查，类似于 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal)。

**用法**

```js
const value = {
  a: {
    b: [42],
  },
  c: true,
};
expect(value).toHaveProperty('a.b');
expect(value).toHaveProperty('a.b', [42]);
expect(value).toHaveProperty('a.b[0]', 42);
expect(value).toHaveProperty('c');
expect(value).toHaveProperty('c', true);
```

**参数**

- <a id="generic-assertions-to-have-property-option-key-path"></a>`keyPath` `string`

  属性的路径。使用点表示法 `a.b` 检查嵌套属性，使用索引 `a[2]` 表示法检查嵌套数组项。
- <a id="generic-assertions-to-have-property-option-expected"></a>`expected` `any` *(可选)*

  可选的预期值与属性进行比较。


### genericAssertions.toMatch() {#generic-assertions-to-match}

<Badge type="info" text="Added in: v1.9" />

确保字符串值匹配正则表达式。

**用法**

```js
const value = 'Is 42 enough?';
expect(value).toMatch(/Is \d+ enough/);
```

**参数**

- <a id="generic-assertions-to-match-option-expected"></a>`expected` `RegExp | string`

  要匹配的正则表达式。


### genericAssertions.toMatchObject() {#generic-assertions-to-match-object}

<Badge type="info" text="Added in: v1.9" />

将值的内容与 [`expected`](/api/class-genericassertions#generic-assertions-to-match-object-option-expected) 的内容进行比较，执行"深度相等"检查。与 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 不同，允许值中存在额外的属性，因此你可以只检查对象属性的子集。

比较数组时，项目数量必须匹配，并且每个项目都递归检查。

**用法**

```js
const value = {
  a: 1,
  b: 2,
  c: true,
};
expect(value).toMatchObject({ a: 1, c: true });
expect(value).toMatchObject({ b: 2, c: true });

expect([{ a: 1, b: 2 }]).toMatchObject([{ a: 1 }]);
```

**参数**

- <a id="generic-assertions-to-match-object-option-expected"></a>`expected` `Object | Array`

  要匹配的预期对象值。


### genericAssertions.toStrictEqual() {#generic-assertions-to-strict-equal}

<Badge type="info" text="Added in: v1.9" />

将值的内容与 [`expected`](/api/class-genericassertions#generic-assertions-to-strict-equal-option-expected) 的内容**及其类型**进行比较。

与 [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) 的区别：
* 检查具有 undefined 属性的键。例如，`{ a: undefined, b: 2 }` 不匹配 `{ b: 2 }`。
* 检查数组稀疏性。例如，`[, 1]` 不匹配 `[undefined, 1]`。
* 检查对象类型是否相等。例如，具有字段 `a` 和 `b` 的类实例不会等于具有字段 `a` 和 `b` 的字面量对象。

**用法**

```js
const value = { prop: 1 };
expect(value).toStrictEqual({ prop: 1 });
```

**参数**

- <a id="generic-assertions-to-strict-equal-option-expected"></a>`expected` `any`

  预期值。


### genericAssertions.toThrow() {#generic-assertions-to-throw}

<Badge type="info" text="Added in: v1.9" />

调用函数并确保它抛出错误。

可选地将错误与 [`expected`](/api/class-genericassertions#generic-assertions-to-throw-option-expected) 进行比较。允许的预期值：
* 正则表达式 - 错误消息应**匹配**模式。
* 字符串 - 错误消息应**包含**子字符串。
* 错误对象 - 错误消息应**等于**对象的 message 属性。
* 错误类 - 错误对象应是类的**实例**。

**用法**

```js
expect(() => {
  throw new Error('Something bad');
}).toThrow();

expect(() => {
  throw new Error('Something bad');
}).toThrow(/something/);

expect(() => {
  throw new Error('Something bad');
}).toThrow(Error);
```

**参数**

- <a id="generic-assertions-to-throw-option-expected"></a>`expected` `any` *(可选)*

  预期的错误消息或错误对象。


### genericAssertions.toThrowError() {#generic-assertions-to-throw-error}

<Badge type="info" text="Added in: v1.9" />

[`genericAssertions.toThrow()`](/api/class-genericassertions#generic-assertions-to-throw) 的别名。

**用法**

```js
expect(() => {
  throw new Error('Something bad');
}).toThrowError();
```

**参数**

- <a id="generic-assertions-to-throw-error-option-expected"></a>`expected` `any` *(可选)*

  预期的错误消息或错误对象。


## 属性

### genericAssertions.not {#generic-assertions-not}

<Badge type="info" text="Added in: v1.9" />

使断言检查相反的条件。

**用法**

例如，以下代码通过：

```js
const value = 1;
expect(value).not.toBe(2);
```

**类型**

- `GenericAssertions`


### genericAssertions.rejects {#generic-assertions-rejects}

<Badge type="info" text="Added in: v1.9" />

使用 `.rejects` 来解包被拒绝的 promise 的原因，以便可以链接任何其他匹配器。如果 promise 被履行，断言失败。

例如，此代码测试 promise 以原因 `'octopus'` 被拒绝：

```js
test('rejects to octopus', async () => {
  await expect(Promise.reject(new Error('octopus'))).rejects.toThrow('octopus');
});
```

**类型**

- `GenericAssertions`


### genericAssertions.resolves {#generic-assertions-resolves}

<Badge type="info" text="Added in: v1.9" />

使用 `resolves` 来解包已履行的 promise 的值，以便可以链接任何其他匹配器。如果 promise 被拒绝，断言失败。

例如，此代码测试 promise 解析并且结果值为 `'lemon'`：

```js
test('resolves to lemon', async () => {
  await expect(Promise.resolve('lemon')).resolves.toBe('lemon');
});
```

**类型**

- `GenericAssertions`
