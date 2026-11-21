---
title: "无障碍测试"
---

# 无障碍测试

## 简介

Playwright 可用于测试应用程序中多种类型的无障碍问题。

以下是一些可以检测到的问题示例：
- 由于与背景色对比度较差，视力障碍用户难以阅读的文本
- 没有标签的 UI 控件和表单元素，屏幕阅读器无法识别
- 具有重复 ID 的交互元素，可能会混淆辅助技术

以下示例依赖于 [`com.deque.html.axe-core/playwright`](https://mvnrepository.com/artifact/com.deque.html.axe-core/playwright) Maven 包，该包支持在 Playwright 测试中运行 [axe 无障碍测试引擎](https://www.deque.com/axe/)。

## 免责声明

自动化无障碍测试可以检测一些常见的无障碍问题，例如缺失或无效的属性。但许多无障碍问题只能通过手动测试来发现。我们建议结合使用自动化测试、手动无障碍评估和包容性用户测试。

对于手动评估，我们推荐使用 [Accessibility Insights for Web](https://accessibilityinsights.io/docs/web/overview/?referrer=playwright-accessibility-testing-java)，这是一个免费的开源开发工具，可引导您评估网站是否符合 [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa) 标准。

## 无障碍测试示例

无障碍测试的工作方式与其他 Playwright 测试相同。您可以为它们创建单独的测试用例，也可以将无障碍扫描和断言集成到现有的测试用例中。

以下示例演示了一些基本的无障碍测试场景。

### 示例 1：扫描整个页面

此示例演示如何测试整个页面的自动检测无障碍违规。测试流程：
1. 导入 [`com.deque.html.axe-core/playwright`](https://mvnrepository.com/artifact/com.deque.html.axe-core/playwright) 包
1. 使用普通的 JUnit 5 `@Test` 语法定义测试用例
1. 使用普通的 Playwright 语法打开浏览器并导航到待测页面
1. 调用 `AxeBuilder.analyze()` 对页面运行无障碍扫描
1. 使用普通的 JUnit 5 测试断言验证返回的扫描结果中没有违规

```java
import com.deque.html.axecore.playwright.*; // 1
import com.deque.html.axecore.utilities.axeresults.*;

import org.junit.jupiter.api.*;
import com.microsoft.playwright.*;

import static org.junit.jupiter.api.Assertions.*;

public class HomepageTests {
  @Test // 2
  void shouldNotHaveAutomaticallyDetectableAccessibilityIssues() throws Exception {
    Playwright playwright = Playwright.create();
    Browser browser = playwright.chromium().launch();
    BrowserContext context = browser.newContext();
    Page page = context.newPage();

    page.navigate("https://your-site.com/"); // 3

    AxeResults accessibilityScanResults = new AxeBuilder(page).analyze(); // 4

    assertEquals(Collections.emptyList(), accessibilityScanResults.getViolations()); // 5
  }
}
```

### 示例 2：配置 axe 扫描页面的特定部分

`com.deque.html.axe-core/playwright` 支持 axe 的许多配置选项。您可以使用 `AxeBuilder` 类的 Builder 模式来指定这些选项。

例如，您可以使用 [`AxeBuilder.include()`](https://github.com/dequelabs/axe-core-maven-html/blob/develop/playwright/README.md#axebuilderincludeliststring-selector) 将无障碍扫描限制为仅针对页面的某个特定部分运行。

`AxeBuilder.analyze()` 会扫描页面*调用时的当前状态*。要扫描基于 UI 交互显示的页面部分，请在调用 `analyze()` 之前使用[定位器](./locators.md)与页面进行交互：

```java
public class HomepageTests {
  @Test
  void navigationMenuFlyoutShouldNotHaveAutomaticallyDetectableAccessibilityViolations() throws Exception {
    page.navigate("https://your-site.com/");

    page.locator("button[aria-label=\"Navigation Menu\"]").click();

    // 重要的是在运行 analyze() 之前使用 waitFor() 等待页面
    // 达到预期状态。否则，axe 可能无法找到测试期望扫描的所有元素。
    page.locator("#navigation-menu-flyout").waitFor();

    AxeResults accessibilityScanResults = new AxeBuilder(page)
      .include(Arrays.asList("#navigation-menu-flyout"))
      .analyze();

    assertEquals(Collections.emptyList(), accessibilityScanResults.getViolations());
  }
}
```

### 示例 3：扫描 WCAG 违规

默认情况下，axe 会检查各种无障碍规则。其中一些规则对应于 [Web 内容无障碍指南 (WCAG)](https://www.w3.org/TR/WCAG21/) 的特定成功标准，而其他规则是"最佳实践"规则，不是任何 WCAG 标准特别要求的。

您可以使用 [`AxeBuilder.withTags()`](https://github.com/dequelabs/axe-core-maven-html/blob/develop/playwright/README.md#axebuilderwithtagsliststring-rules) 将无障碍扫描限制为仅运行标记为对应特定 WCAG 成功标准的规则。例如，[Accessibility Insights for Web 的自动检查](https://accessibilityinsights.io/docs/web/getstarted/fastpass/?referrer=playwright-accessibility-testing-java) 仅包含测试违反 WCAG A 和 AA 成功标准的 axe 规则；要匹配该行为，您可以使用标签 `wcag2a`、`wcag2aa`、`wcag21a` 和 `wcag21aa`。

请注意，[自动化测试无法检测所有类型的 WCAG 违规](#免责声明)。

```java
AxeResults accessibilityScanResults = new AxeBuilder(page)
  .withTags(Arrays.asList("wcag2a", "wcag2aa", "wcag21a", "wcag21aa"))
  .analyze();

assertEquals(Collections.emptyList(), accessibilityScanResults.getViolations());
```

您可以在 [axe API 文档的"Axe-core Tags"部分](https://www.deque.com/axe/core-documentation/api-documentation/#axecore-tags) 中找到 axe-core 支持的完整规则标签列表。

## 处理已知问题

在应用程序中添加无障碍测试时，一个常见问题是"如何抑制已知违规？"以下示例演示了几种可用的技术。

### 从扫描中排除单个元素

如果您的应用程序包含一些具有已知问题的特定元素，您可以使用 [`AxeBuilder.exclude()`](https://github.com/dequelabs/axe-core-maven-html/blob/develop/playwright/README.md#axebuilderexcludeliststring-selector) 在能够修复问题之前将它们排除在扫描之外。

这通常是最简单的选项，但有一些重要的缺点：
* `exclude()` 会排除指定的元素*及其所有后代*。避免将其用于包含许多子元素的组件。
* `exclude()` 会阻止*所有*规则针对指定元素运行，而不仅仅是与已知问题对应的规则。

以下是在一个特定测试中排除一个元素的示例：

```java
AxeResults accessibilityScanResults = new AxeBuilder(page)
  .exclude(Arrays.asList("#element-with-known-issue"))
  .analyze();

assertEquals(Collections.emptyList(), accessibilityScanResults.getViolations());
```

如果相关元素在许多页面中重复使用，请考虑[使用测试夹具](#使用测试夹具进行通用-axe-配置)在多个测试中重用相同的 `AxeBuilder` 配置。

### 禁用单个扫描规则

如果您的应用程序包含许多特定规则的预先存在的违规，您可以使用 [`AxeBuilder.disableRules()`](https://github.com/dequelabs/axe-core-maven-html/blob/develop/playwright/README.md#axebuilderdisablerulesliststring-rules) 在能够修复问题之前临时禁用单个规则。

您可以在要抑制的违规的 `id` 属性中找到要传递给 `disableRules()` 的规则 ID。`axe-core` 文档中可以找到 [axe 规则的完整列表](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)。

```java
AxeResults accessibilityScanResults = new AxeBuilder(page)
  .disableRules(Arrays.asList("duplicate-id"))
  .analyze();

assertEquals(Collections.emptyList(), accessibilityScanResults.getViolations());
```

### 使用违规指纹识别特定的已知问题

如果您想允许更细粒度的已知问题集，可以使用以下模式：
1. 执行预期会发现一些已知违规的无障碍扫描
1. 将违规转换为"违规指纹"对象
1. 断言指纹集与预期的相同

这种方法避免了使用 `AxeBuilder.exclude()` 的缺点，但代价是稍微增加了复杂性和脆弱性。

以下是使用仅基于规则 ID 和指向每个违规的"目标"选择器的指纹的示例：

```java
public class HomepageTests {
  @Test
  shouldOnlyHaveAccessibilityViolationsMatchingKnownFingerprints() throws Exception {
    page.navigate("https://your-site.com/");

    AxeResults accessibilityScanResults = new AxeBuilder(page).analyze();

    List<ViolationFingerprint> violationFingerprints = fingerprintsFromScanResults(accessibilityScanResults);

    assertEquals(Arrays.asList(
      new ViolationFingerprint("aria-roles", "[span[role=\"invalid\"]]"),
      new ViolationFingerprint("color-contrast", "[li:nth-child(2) > span]"),
      new ViolationFingerprint("label", "[input]")
    ), violationFingerprints);
  }

  // 您可以根据需要使"指纹"尽可能具体。此示例认为违规是
  // "相同的"，如果它对应于同一元素上的同一 Axe 规则。
  //
  // 使用 record 类型可以轻松地使用 assertEquals 比较指纹
  public record ViolationFingerprint(String ruleId, String target) { }

  public List<ViolationFingerprint> fingerprintsFromScanResults(AxeResults results) {
    return results.getViolations().stream()
      // 每个违规引用一个规则和多个违反它的"节点"
      .flatMap(violation -> violation.getNodes().stream()
        .map(node -> new ViolationFingerprint(
          violation.getId(),
          // 每个节点包含一个"目标"，它是唯一标识它的 CSS 选择器
          // 如果页面涉及 iframe 或 shadow DOM，它可能是 CSS 选择器链
          node.getTarget().toString()
        )))
      .collect(Collectors.toList());
  }
}
```

## 使用测试夹具进行通用 axe 配置

[`TestFixtures` 类](./test-runners#running-tests-in-parallel)是在许多测试之间共享通用 `AxeBuilder` 配置的好方法。以下是一些可能有用的场景：
* 在所有测试中使用通用规则集
* 在出现在许多不同页面中的通用元素中抑制已知违规
* 为许多扫描一致地附加独立的无障碍报告

以下示例演示了如何使用新夹具扩展[测试运行器示例](./test-runners#running-tests-in-parallel)中的 `TestFixtures` 类，该夹具包含一些通用的 `AxeBuilder` 配置。

### 创建夹具

此示例夹具创建了一个预配置了共享 `withTags()` 和 `exclude()` 配置的 `AxeBuilder` 对象。

```java
class AxeTestFixtures extends TestFixtures {
 AxeBuilder makeAxeBuilder() {
   return new AxeBuilder(page)
     .withTags(new String[]{"wcag2a", "wcag2aa", "wcag21a", "wcag21aa"})
     .exclude("#commonly-reused-element-with-known-issue");
 }
}
```

### 使用夹具

要使用夹具，请将前面示例中的 `new AxeBuilder(page)` 替换为新定义的 `makeAxeBuilder` 夹具：

```java
public class HomepageTests extends AxeTestFixtures {
  @Test
  void exampleUsingCustomFixture() throws Exception {
    page.navigate("https://your-site.com/");

    AxeResults accessibilityScanResults = makeAxeBuilder()
      // 自动使用共享的 AxeBuilder 配置，
      // 但也支持其他特定于测试的配置
      .include("#specific-element-under-test")
      .analyze();

    assertEquals(Collections.emptyList(), accessibilityScanResults.getViolations());
  }
}
```

请参阅实验性的 [JUnit 集成](./junit.md)，以自动初始化 Playwright 对象等。
