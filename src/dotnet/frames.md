---
title: "Frames"
---

# Frames

## Introduction

A [Page](/dotnet/api/class-page) can have one or more [Frame](/dotnet/api/class-frame) objects attached to it. Each page has a main frame and page-level interactions
(like `click`) are assumed to operate in the main frame.

A page can have additional frames attached with the `iframe` HTML tag. These frames can be accessed for interactions
inside the frame.

```csharp
// Locate element inside frame
var username = await page.FrameLocator(".frame-class").GetByLabel("User Name");
await username.FillAsync("John");
```

## Frame objects

One can access frame objects using the [`Page.Frame()`](/dotnet/api/class-page#page-frame) API:

```csharp
// Create a page.
var page = await context.NewPageAsync();

// Get frame using the frame's name attribute
var frame = page.Frame("frame-login");

// Get frame using frame's URL
var frame = page.FrameByUrl("*domain.");

// Get frame using any other selector
var frameElementHandle = await page.EvaluateAsync("window.frames[1]");
var frame = await frameElementHandle.ContentFrameAsync();

// Interact with the frame
await frame.FillAsync("#username-input", "John");
```
