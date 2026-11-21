---
title: "Frames"
---

# Frames

## Introduction

A [Page](/java/api/class-page) can have one or more [Frame](/java/api/class-frame) objects attached to it. Each page has a main frame and page-level interactions
(like `click`) are assumed to operate in the main frame.

A page can have additional frames attached with the `iframe` HTML tag. These frames can be accessed for interactions
inside the frame.

```java
// Locate element inside frame
Locator username = page.frameLocator(".frame-class").getByLabel("User Name");
username.fill("John");
```

## Frame objects

One can access frame objects using the [`page.frame()`](/java/api/class-page#page-frame) API:

```java
// Get frame using the frame"s name attribute
Frame frame = page.frame("frame-login");

// Get frame using frame"s URL
Frame frame = page.frameByUrl(Pattern.compile(".*domain.*"));

// Interact with the frame
frame.fill("#username-input", "John");
```
