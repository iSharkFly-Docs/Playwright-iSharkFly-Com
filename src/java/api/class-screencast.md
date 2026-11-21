---
title: Screencast
outline: 2
---

# Screencast

<Badge type="info" text="Added in: v1.59" />

Interface for capturing screencast frames from a page.

## Methods

### screencast.hideActions() {#screencast-hide-actions}

<Badge type="info" text="Added in: v1.59" />

Removes action decorations.


### screencast.hideOverlays() {#screencast-hide-overlays}

<Badge type="info" text="Added in: v1.59" />

Hides overlays without removing them.


### screencast.showActions() {#screencast-show-actions}

<Badge type="info" text="Added in: v1.59" />

Enables visual annotations on interacted elements. Returns a disposable that stops showing actions when disposed.

**Arguments**

- <a id="screencast-show-actions-option-options"></a>`options` `Object` *(optional)*

  - <a id="screencast-show-actions-option-cursor"></a>`cursor` `"none" | "pointer"` *(optional)* <Badge type="info" text="Added in: v1.61" />

    Cursor decoration shown for pointer actions. `"pointer"` (the default) renders
    a mouse pointer that animates from the previous action point to the next one.
    `"none"` disables the cursor decoration.
  - <a id="screencast-show-actions-option-duration"></a>`duration` `float` *(optional)*

    How long each annotation is displayed in milliseconds. Defaults to `500`.
  - <a id="screencast-show-actions-option-font-size"></a>`fontSize` `int` *(optional)*

    Font size of the action title in pixels. Defaults to `24`.
  - <a id="screencast-show-actions-option-position"></a>`position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(optional)*

    Position of the action title overlay. Defaults to `"top-right"`.
  - <a id="screencast-show-actions-option-style"></a>`style` `Object` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Styles of the action decorations. All decorations fade out over [`duration`](/java/api/class-screencast#screencast-show-actions-option-duration).

    **Usage**

    - `point` `string` *(optional)* <Badge type="info" text="Added in: v1.64" />

      CSS declarations for the marker at the action point. The marker is positioned at the action point, has zero size and is centered on the point, so its size and look come from this style. Not shown when omitted.
    - `highlight` `string` *(optional)* <Badge type="info" text="Added in: v1.64" />

      CSS declarations for the box that covers the target element. The box is positioned and sized to the element bounds. Not shown when omitted.
    - `title` `string` *(optional)* <Badge type="info" text="Added in: v1.64" />

      CSS declarations for the action title, for example `'font-size: 32px; background: #333'`. The title is placed according to [`position`](/java/api/class-screencast#screencast-show-actions-option-position).

**Returns**

- `Disposable`


### screencast.showChapter() {#screencast-show-chapter}

<Badge type="info" text="Added in: v1.59" />

Shows a chapter overlay with a title and optional description, centered on the page with a blurred backdrop. Useful for narrating video recordings. The overlay is removed after the specified duration, or 2000ms.

**Arguments**

- <a id="screencast-show-chapter-option-title"></a>`title` `string`

  Title text displayed prominently in the overlay.
- <a id="screencast-show-chapter-option-options"></a>`options` `Object` *(optional)*

  - <a id="screencast-show-chapter-option-description"></a>`description` `string` *(optional)*

    Optional description text displayed below the title.
  - <a id="screencast-show-chapter-option-duration"></a>`duration` `float` *(optional)*

    Duration in milliseconds after which the overlay is automatically removed. Defaults to `2000`.


### screencast.showOverlay() {#screencast-show-overlay}

<Badge type="info" text="Added in: v1.59" />

Adds an overlay with the given HTML content. The overlay is displayed on top of the page until removed. Returns a disposable that removes the overlay when disposed.

**Arguments**

- <a id="screencast-show-overlay-option-html"></a>`html` `string`

  HTML content for the overlay.
- <a id="screencast-show-overlay-option-options"></a>`options` `Object` *(optional)*

  - <a id="screencast-show-overlay-option-duration"></a>`duration` `float` *(optional)*

    Duration in milliseconds after which the overlay is automatically removed. Overlay stays until dismissed if not provided.

**Returns**

- `Disposable`


### screencast.showOverlays() {#screencast-show-overlays}

<Badge type="info" text="Added in: v1.59" />

Shows overlays.


### screencast.start() {#screencast-start}

<Badge type="info" text="Added in: v1.59" />

Starts the screencast. When [`path`](/java/api/class-screencast#screencast-start-option-path) is provided, it saves video recording to the specified file.
When [`onFrame`](/java/api/class-screencast#screencast-start-option-on-frame) is provided, delivers JPEG-encoded frames to the callback. Both can be used together.

**Usage**

**Arguments**

- <a id="screencast-start-option-options"></a>`options` `Object` *(optional)*

  - <a id="screencast-start-option-fps"></a>`fps` `int` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Frame rate of the video recording in frames per second. Only used together with [`path`](/java/api/class-screencast#screencast-start-option-path). Defaults to `25`.

    Higher frame rates make animations and scrolling smoother at the cost of more CPU spent on encoding. Combine with [`size`](/java/api/class-screencast#screencast-start-option-size) to record high resolution videos. The video can only contain as many distinct frames as the browser produces; Firefox and WebKit currently capture up to 25 frames per second.
  - <a id="screencast-start-option-on-frame"></a>`onFrame` `function(Object): Promise` *(optional)*

    Callback that receives JPEG-encoded frame data along with the page viewport size at the time of capture.

    - `data` `Buffer`

      JPEG-encoded frame data.
    - `timestamp` `float`

      The timestamp of when the frame was presented by the browser, in milliseconds since the Unix epoch.
    - `viewportWidth` `int`

      Width of the page viewport at the time the frame was captured.
    - `viewportHeight` `int`

      Height of the page viewport at the time the frame was captured.
  - <a id="screencast-start-option-path"></a>`path` `path` *(optional)*

    Path where the video should be saved when the screencast is stopped. When provided, video recording is started.
  - <a id="screencast-start-option-quality"></a>`quality` `int` *(optional)*

    The quality of the image, between 0-100.
  - <a id="screencast-start-option-size"></a>`size` `Object` *(optional)*

    Specifies the dimensions of screencast frames. The actual frame is scaled to preserve the page's aspect ratio and may be smaller than these bounds.
    If a screencast is already active (e.g. started by tracing or video recording), the existing configuration takes precedence and the frame size may exceed these bounds or this option may be ignored.
    If not specified the size will be equal to page viewport scaled down to fit into 800×800.

    - `width` `int`

      Max frame width in pixels.
    - `height` `int`

      Max frame height in pixels.

**Returns**

- `Disposable`


### screencast.stop() {#screencast-stop}

<Badge type="info" text="Added in: v1.59" />

Stops the screencast and video recording if active. If a video was being recorded, saves it to the path specified in [`screencast.start()`](/java/api/class-screencast#screencast-start).

