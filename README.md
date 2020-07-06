<p align="center">
<img src="https://d3co7cvuqq9u2k.cloudfront.net/public/image/logo/uiza_logo_color.png" data-canonical-src="https://uiza.io" width="450" height="220" />
</p>

# Uiza Player Web SDK

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://npmjs.org/package/@uizaio/playerjs)
[![NPM version](http://img.shields.io/npm/dm/@uizaio/playerjs.svg?style=flat)](https://npmjs.org/package/@uizaio/playerjs)
[![Build Status](https://travis-ci.org/uizaio/uiza-javascript-sdk-player.svg?branch=master)](https://travis-ci.org/uizaio/uiza-javascript-sdk-player)
[![dependencies Status](https://david-dm.org/uizaio/uiza-javascript-sdk-player/status.svg)](https://david-dm.org/uizaio/uiza-javascript-sdk-player)
[![devDependencies Status](https://david-dm.org/uizaio/uiza-javascript-sdk-player/dev-status.svg)](https://david-dm.org/uizaio/uiza-javascript-sdk-player?type=dev)
[![](https://data.jsdelivr.com/v1/package/npm/@uizaio/playerjs/badge)](https://www.jsdelivr.com/package/npm/@uizaio/playerjs)

[![NPM](https://nodei.co/npm/@uizaio/playerjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@uizaio/playerjs/)

Uiza Player is a simple, lightweight, accessible and customizable HTML5, media player that supports [_modern_](#browser-support) browsers.


### Demos

You can try Uiza in Codepen using our minimal templates. For Streaming we also have example integrations with: [Hls.js](https://playcode.io/614075), [Dash.js](https://playcode.io/628492) and [VOD](https://playcode.io/614073/)

# Quick setup

## HTML

Uiza Player extends upon the standard [HTML5 media element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) markup so that's all you need for those types.

| Attribute | Value |Description |
| -- | --  | -- |
| `autoplay` | autoplay | Specifies that the video will start playing as soon as it is ready |
| `controls` | controls | Specifies that video controls should be displayed (such as a play/pause button etc). |
| `src` | URL | Specifies the URL of the video file |
| `height` | pixels | Sets the height of the video player |
| `width` | pixels | Sets the width of the video player |
| `loop` | loop | Specifies that the video will start over again, every time it is finished |
| `muted` | muted | Specifies that the audio output of the video should be muted |
| `poster` | URL | Specifies an image to be shown while the video is downloading, or until the user hits the play button |
| `preload` | auto / metadata / none | Specifies if and how the author thinks the video should be loaded when the page loads |


### HLS Stream Video

```html
<video id='playerUz' crossorigin playsinline autoplay></video>
<script>
  var videoStreamURL = 'https://1955897154.rsc.cdn77.org/live/116881ad-3463-4209-b16f-50e0e48add10/master.m3u8?cm=eyJlbnRpdHlfaWQiOiI2ZWUyMzk5NS1mNGFhLTQ1ZDMtOTM5NS0xN2NlNjBlZWJjNDAiLCJlbnRpdHlfc291cmNlIjoibGl2ZSIsImFwcF9pZCI6IjkyYThkMjAzMmZlODQ5MmFhNzc4MDRiNGMyYzUxOWM1In0=';

(async (options) => {
  var uiza = await new Uiza(document.getElementById('playerUz'), options);
  return { uiza, time: Date.now() };
})({src: videoStreamURL});
</script>
```

See [initialising](#initialising) for more information on advanced setups.

You can use our CDN for the JavaScript. There's 2 versions; one with and one without [polyfills](#polyfills). My recommendation would be to manage polyfills seperately as part of your application but to make life easier you can use the polyfilled build.

```html
<script src="https://sdk.uiza.io/v5/release/uiza.min.js"></script>
```

...or...

```html
<script src="https://sdk.uiza.io/v5/release/uiza.polyfilled.js"></script>
```

## CSS

Include the `uiza.css` stylsheet into your `<head>`.

```html
<link rel="stylesheet" href="https://sdk.uiza.io/v5/release/uiza.css" />
```

## Example

example.html

```html
<!DOCTYPE html>
<html lang='en' dir='ltr'>

<head>
  <meta charset='utf-8'>
  <title></title>
  <meta name='viewport' content='width=device-width,initial-scale=1'>

  <link href='https://sdk.uiza.io/v5/release/uiza.css' rel='stylesheet'>
  <script src='https://sdk.uiza.io/v5/release/uiza.min.js'></script>

</head>

<body>
  <video id='playerUz' crossorigin playsinline autoplay></video>

  <script>
    var videoStreamURL = 'https://1955897154.rsc.cdn77.org/live/116881ad-3463-4209-b16f-50e0e48add10/master.m3u8?cm=eyJlbnRpdHlfaWQiOiI2ZWUyMzk5NS1mNGFhLTQ1ZDMtOTM5NS0xN2NlNjBlZWJjNDAiLCJlbnRpdHlfc291cmNlIjoibGl2ZSIsImFwcF9pZCI6IjkyYThkMjAzMmZlODQ5MmFhNzc4MDRiNGMyYzUxOWM1In0=';

    ((options) => {
      window.UZplayer = new Uiza(document.getElementById('playerUz'), options);
    })({ src: videoStreamURL });
  </script>

</body>

</html>
```


# Advanced

## Customizing HLS buffer

```
buffer: {
  maxBufferLength: 15
  maxMaxBufferLength: 90
}
```

`maxBufferLength` (default: 10 seconds, maximum 30 seconds)

Maximum buffer length in seconds. If buffer length is/become less than this value, a new fragment will be loaded. This is the guaranteed buffer length hls.js will try to reach, regardless of maxBufferSize.

`maxMaxBufferLength`: (default 60 seconds, maximum 120 seconds)
Maximum buffer length in seconds. Hls.js will never exceed this value, even if maxBufferSize is not reached yet.

hls.js tries to buffer up to a maximum number of bytes (6 MB by default) rather than to buffer up to a maximum nb of seconds. this is to mimic the browser behaviour (the buffer eviction algorithm is starting after the browser detects that video buffer size reaches a limit in bytes)

Example for maxBufferLengthand maxMaxBufferLength.  [Demo here](https://playcode.io/628085)
```html
<!DOCTYPE html>
<html lang='en' dir='ltr'>

<head>
  <meta charset='utf-8'>
  <title></title>
  <meta name='viewport' content='width=device-width,initial-scale=1'>

  <link href='https://sdk.uiza.io/v5/release/uiza.css' rel='stylesheet'>
  <script src='https://sdk.uiza.io/v5/release/uiza.min.js'></script>

</head>

<body>
  <video id='playerUz' crossorigin playsinline autoplay></video>

  <script>
    var videoStreamURL = 'https://1955897154.rsc.cdn77.org/live/116881ad-3463-4209-b16f-50e0e48add10/master.m3u8?cm=eyJlbnRpdHlfaWQiOiI2ZWUyMzk5NS1mNGFhLTQ1ZDMtOTM5NS0xN2NlNjBlZWJjNDAiLCJlbnRpdHlfc291cmNlIjoibGl2ZSIsImFwcF9pZCI6IjkyYThkMjAzMmZlODQ5MmFhNzc4MDRiNGMyYzUxOWM1In0=';

    ((options) => {
      window.UZplayer = new Uiza(document.getElementById('playerUz'), options);
    })({
      buffer: {
        maxBufferLength: 10,
        maxMaxBufferLength: 60
      },
      src: videoStreamURL
    });
  </script>

</body>

</html>
```

## Customizing the UI button

| Attribute | Default | Description |
| -- | --  | -- |
| `restart` | `true` | Only for VOD, Set the value to `false` to disable restart button on the video player |
| `rewind` | `true` | Only for VOD, Set the value to `false` to disable rewind button on the video player |
| `play` | `true` | Set the value to `false` to disable play button on the video player. Remember: should autoplay on video tag |
| `mute` | `true` | Set the value to `false` to disable mute button on the video player |
| `volume` | `true` | Set the value to `false` to disable volume button on the video player |
| `currentTime` | `true` | Set the value to `false` to hide the current time on the video player |
| `toggleLiveViewer` | `true` | Set the value to `false` to hide the viewer count on the video player |
| `progress` | `true` | Set the value to `false` to hide the progress bar on the video player |
| `fastForward` | `true` | Set the value to `false` to disable the fast forward button on the video player |
| `captions` | `true` | Set the value to `false` to disable the captions button on the video player |
| `settings` | `true` | Set the value to `false` to disable the settings button on the video player |
| `pip` | `true` | Set the value to `false` to disable the picture-in-picture button on the video player |
| `live` | `true` | Set the value to `false` to hide the live button on the video player |
| `fullscreen` | `true` | Set the value to `false` to disable the fullscreen button on the video player |
| `speed` | `true` | Set the value to `false` to disable the speed button on the video player |
```
ui: {
    restart: true,
    rewind: true,
    play: true,
    mute: true,
    volume: true,
    currentTime: true,
    toggleLiveViewer: true,
    fastForward: true,
    progress: true,
    captions: true,
    settings: true,
    pip: true,
    live: true,
    fullscreen: true,
    speed: true
}
```

Example for hide button `pip` and `settings`, only override configure to false. [Demo here](https://playcode.io/608599/)
```html
<!DOCTYPE html>
<html lang='en' dir='ltr'>

<head>
  <meta charset='utf-8'>
  <title></title>
  <meta name='viewport' content='width=device-width,initial-scale=1'>

  <link href='https://sdk.uiza.io/v5/release/uiza.css' rel='stylesheet'>
  <script src='https://sdk.uiza.io/v5/release/uiza.min.js'></script>

</head>

<body>
  <video id='playerUz' crossorigin playsinline autoplay muted></video>

  <script>
    var videoStreamURL = 'https://1955897154.rsc.cdn77.org/live/116881ad-3463-4209-b16f-50e0e48add10/master.m3u8?cm=eyJlbnRpdHlfaWQiOiI2ZWUyMzk5NS1mNGFhLTQ1ZDMtOTM5NS0xN2NlNjBlZWJjNDAiLCJlbnRpdHlfc291cmNlIjoibGl2ZSIsImFwcF9pZCI6IjkyYThkMjAzMmZlODQ5MmFhNzc4MDRiNGMyYzUxOWM1In0=';

    ((options) => {
      window.UZplayer = new Uiza(document.getElementById('playerUz'), options);
    })({
      ui: {
        pip: false,
        settings: false
      }, 
      src: videoStreamURL
    });
  </script>

</body>

</html>
```

## Customizing the CSS

If you want to change any design tokens used for the rendering of the player, you can do so using [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

Here's a list of the properties and what they are used for:

| Name | Description | Default / Fallback |
| -- | -- | -- |
| `--uiza-color-main` | The primary UI color. | ![#f03c15](https://placehold.it/15/00b3ff/000000?text=+) `#00b3ff` |
| `--uiza-tab-focus-color` | The color used for the dotted outline when an element is `:focus-visible` (equivalent) keyboard focus.  | `--uiza-color-main` |
| `--uiza-badge-background` | The background color for badges in the menu. | ![#4a5464](https://placehold.it/15/4a5464/000000?text=+) `#4a5464` | 
| `--uiza-badge-text-color` | The text color for badges. | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff` |
| `--uiza-badge-border-radius` | The border radius used for badges. | `2px` |
| `--uiza-tab-focus-color` | The color used to highlight tab (keyboard) focus.                                                       | `--uiza-color-main` |
| `--uiza-captions-background` | The color for the background of captions. | `rgba(0, 0, 0, 0.8)` |
| `--uiza-captions-text-color` | The color used for the captions text. | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff` |
| `--uiza-control-icon-size` | The size of the icons used in the controls. | `18px` |
| `--uiza-control-spacing` | The space between controls (sometimes used in a multiple - e.g. `10px / 2 = 5px`).                      | `10px` |
| `--uiza-control-padding` | The padding inside controls.                                                                            | `--uiza-control-spacing * 0.7` (`7px`) |
| `--uiza-control-radius` | The border radius used on controls. | `3px` |
| `--uiza-control-toggle-checked-background` | The background color used for checked menu items. | `--uiza-color-main` |
| `--uiza-video-controls-background` | The background for the video controls. | `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))` |
| `--uiza-video-control-color` | The text/icon color for video controls. | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff` |
| `--uiza-video-control-color-hover` | The text/icon color used when video controls are `:hover`, `:focus` and `:focus-visible` (equivalent).  | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff`    |
| `--uiza-video-control-background-hover` | The background color used when video controls are `:hover`, `:focus` and `:focus-visible` (equivalent). | `--uiza-color-main`                                                   |
| `--uiza-audio-controls-background` | The background for the audio controls. | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff` |
| `--uiza-audio-control-color` | The text/icon color for audio controls. | ![#4a5464](https://placehold.it/15/4a5464/000000?text=+) `#4a5464` |
| `--uiza-audio-control-color-hover` | The text/icon color used when audio controls are `:hover`, `:focus` and `:focus-visible` (equivalent).  | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff` |
| `--uiza-audio-control-background-hover`        | The background color used when video controls are `:hover`, `:focus` and `:focus-visible` (equivalent). | `--uiza-color-main`                                                   |
| `--uiza-menu-background` | The background color for menus. | `rgba(255, 255, 255, 0.9)` |
| `--uiza-menu-color` | The text/icon color for menu items. | ![#4a5464](https://placehold.it/15/4a5464/000000?text=+) `#4a5464` |
| `--uiza-menu-shadow` | The shadow used on menus. | `0 1px 2px rgba(0, 0, 0, 0.15)` |
| `--uiza-menu-radius` | The border radius on the menu. | `4px` |
| `--uiza-menu-arrow-size` | The size of the arrow on the bottom of the menu. | `6px` |
| `--uiza-menu-item-arrow-color` | The color of the arrows in the menu. | ![#728197](https://placehold.it/15/728197/000000?text=+) `#728197`    |
| `--uiza-menu-item-arrow-size` | The size of the arrows in the menu. | `4px` |
| `--uiza-menu-border-color` | The border color for the bottom of the back button in the top of the sub menu pages. | ![#dcdfe5](https://placehold.it/15/dcdfe5/000000?text=+) `#dcdfe5` |
| `--uiza-menu-border-shadow-color` | The shadow below the border of the back button in the top of the sub menu pages. | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff`    |
| `--uiza-progress-loading-size` | The size of the stripes in the loading state in the scrubber. | `25px` |
| `--uiza-progress-loading-background` | The background color on the loading state in the scrubber. | `rgba(35, 40, 47, 0.6)` |
| `--uiza-video-progress-buffered-background` | The fill color for the buffer indication in the scrubber for video. | `rgba(255, 255, 255, 0.25)` |
| `--uiza-audio-progress-buffered-background` | The fill color for the buffer indication in the scrubber for audio. | `rgba(193, 200, 209, 0.6)` |
| `--uiza-range-thumb-height` | The height of the scrubber handle/thumb. | `13px` |
| `--uiza-range-thumb-background` | The background of the scrubber handle/thumb. | ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff` |
| `--uiza-range-thumb-shadow` | The shadow of the scrubber handle/thumb. | `0 1px 1px rgba(215, 26, 18, 0.15), 0 0 0 1px rgba(215, 26, 18, 0.2)` |
| `--uiza-range-thumb-active-shadow-width` | The width of the shadow when the scrubber handle/thumb is `:active` (pressed). | `3px` |
| `--uiza-range-track-height` | The height of the scrubber/progress track. | `5px` |
| `--uiza-range-fill-background` | The fill color of the scrubber/progress. | `--uiza-color-main` |
| `--uiza-video-range-track-background` | The background of the scrubber/progress. | `--uiza-video-progress-buffered-background` |
| `--uiza-video-range-thumb-active-shadow-color` | The color of the shadow when the video scrubber handle/thumb is `:active` (pressed). | `rgba(255, 255, 255, 0.5)` |
| `--uiza-audio-range-track-background` | The background of the scrubber/progress. | `--uiza-video-progress-buffered-background` |
| `--uiza-audio-range-thumb-active-shadow-color` | The color of the shadow when the audio scrubber handle/thumb is `:active` (pressed). | `rgba(215, 26, 18, 0.1)` |
| `--uiza-tooltip-background` | The background color for tooltips. | `rgba(255, 255, 255, 0.9)` |
| `--uiza-tooltip-color` | The text color for tooltips. | ![#4a5464](https://placehold.it/15/4a5464/000000?text=+) `#4a5464` |
| `--uiza-tooltip-padding` | The padding for tooltips. | `calc(var(--uiza-control-spacing) / 2))` |
| `--uiza-tooltip-arrow-size` | The size of the arrow under tooltips. | `4px` |
| `--uiza-tooltip-radius` | The border radius on tooltips. | `3px` |
| `--uiza-tooltip-shadow` | The shadow on tooltips. | `0 1px 2px rgba(0, 0, 0, 0.15)` |
| `--uiza-font-family` | The font family used in the player. | |
| `--uiza-font-size-base` | The base font size. Mainly used for captions. | `15px` |
| `--uiza-font-size-small` | The smaller font size. Mainly used for captions. | `13px` |
| `--uiza-font-size-large` | The larger font size. Mainly used for captions. | `18px` |
| `--uiza-font-size-xlarge` | The even larger font size. Mainly used for captions. | `21px` |
| `--uiza-font-size-time` | The font size for the time. | `--uiza-font-size-small` |
| `--uiza-font-size-menu` | The font size used in the menu. | `--uiza-font-size-small` |
| `--uiza-font-size-badge` | The font size used for badges. | `9px` |
| `--uiza-font-weight-regular` | The regular font weight. | `400` |
| `--uiza-font-weight-bold` | The bold font weight. | `600` |
| `--uiza-line-height` | The line height used within the player. | `1.7` |
| `--uiza-font-smoothing` | Whether to enable font antialiasing within the player. | `false` |

You can set them in your CSS for all players:

```css
:root {
  --uiza-color-main: #1ac266;
}
```

...or for a specific class name:

```css
.player {
  --uiza-color-main: #1ac266;
}
```

...or in your HTML:

```html
<video class="player" style="--uiza-color-main: #1ac266;">
    ...
</vieo>
```

## Cross Origin (CORS)

You'll notice the `crossorigin` attribute on the example `<video>` elements. This is because the TextTrack captions are loaded from another domain. If your
TextTrack captions are also hosted on another domain, you will need to add this attribute and make sure your host has the correct headers setup. For more info
on CORS checkout the MDN docs:
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

## Captions

WebVTT captions are supported. To add a caption track, check the HTML example above and look for the `<track>` element. Be sure to
[validate your caption files](https://quuz.org/webvtt/).

## JavaScript

### Initialising

You can specify a range of arguments for the constructor to use:

- A [CSS string selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- A [`HTMLElement`](https://developer.mozilla.org/en/docs/Web/API/HTMLElement)
- A [jQuery](https://jquery.com) object

_Note_: If a `NodeList`, `Array`, or jQuery object are passed, the first element will be used for setup. To setup multiple players, see [multiple players](#multiple-players) below.

#### Single player

Passing a CSS string selector that's compatible with [`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector):

```javascript
const player = new Uiza('#playerUz');
```

Passing a [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement):

```javascript
const player = new Uiza(document.getElementById('playerUz'));
```

```javascript
const player = new Uiza(document.querySelector('.js-player'));
```

The HTMLElement or string selector can be the target `<video>`, `<audio>`, or `<div>` wrapper for embeds.

#### Multiple players

You have two choices here. You can either use a simple array loop to map the constructor:

```javascript
const players = Array.from(document.querySelectorAll('.js-player')).map(p => new Uiza(p));
```

...or use a static method where you can pass a [CSS string selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors), a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement), or a [JQuery](https://jquery.com) object:

```javascript
const players = Uiza.setup('.js-player');
```

Both options will also return an array of instances in the order of they were in the DOM for the string selector or the source NodeList or Array.

#### Options

The second argument for the constructor is the [options](#options) object:

```javascript
const player = new Uiza('#playerUz', {
  title: 'Example Title',
});
```

Options can be passed as an object to the constructor as above or as JSON in `data-uiza-config` attribute on each of your target elements:

```html
<video src="/path/to/video.mp4" id="playerUz" controls data-uiza-config='{ "title": "Example Title" }'></video>
```

Note the single quotes encapsulating the JSON and double quotes on the object keys. Only string values need double quotes.

| Option               | Type                       | Default                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Boolean                    | `true`                                                                                                                         | Completely disable Uiza. This would allow you to do a User Agent check or similar to programmatically enable or disable Uiza for a certain UA. Example below.                                                                                                                                                                                                                                           |
| `debug`              | Boolean                    | `false`                                                                                                                        | Display debugging information in the console                                                                                                                                                                                                                                                                                                                                                            |
| `controls`           | Array, Function or Element | `['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']` | If a function is passed, it is assumed your method will return either an element or HTML string for the controls. Three arguments will be passed to your function; `id` (the unique id for the player), `seektime` (the seektime step in seconds), and `title` (the media title). See [CONTROLS.md](CONTROLS.md) for more info on how the html needs to be structured.                                  |
| `settings`           | Array                      | `['captions', 'quality', 'speed', 'loop']`                                                                                     | If the default controls are used, you can specify which settings to show in the menu                                                                                                                                                                                                                                                                                                                    |
| `i18n`               | Object                     | See [defaults.js](/src/js/config/defaults.js)                                                                                  | Used for internationalization (i18n) of the text within the UI.                                                                                                                                                                                                                                                                                                                                         |
| `loadSprite`         | Boolean                    | `true`                                                                                                                         | Load the SVG sprite specified as the `iconUrl` option (if a URL). If `false`, it is assumed you are handling sprite loading yourself.                                                                                                                                                                                                                                                                   |
| `iconUrl`            | String                     | `null`                                                                                                                         | Specify a URL or path to the SVG sprite. See the [SVG section](#svg) for more info.                                                                                                                                                                                                                                                                                                                     |
| `iconPrefix`         | String                     | `uiza`                                                                                                                         | Specify the id prefix for the icons used in the default controls (e.g. "uiza-play" would be "uiza"). This is to prevent clashes if you're using your own SVG sprite but with the default controls. Most people can ignore this option.                                                                                                                                                                  |
| `blankVideo`         | String                     | `https://cdn.Uiza.io/static/blank.mp4`                                                                                         | Specify a URL or path to a blank video file used to properly cancel network requests.                                                                                                                                                                                                                                                                                                                   |
| `autoplay`&sup2;     | Boolean                    | `false`                                                                                                                        | Autoplay the media on load. If the `autoplay` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true.                                                                                                                                                                                                                                                         |
| `autopause`&sup1;    | Boolean                    | `true`                                                                                                                         | Only allow one player playing at once.                                                                                                                                                                                                                                                                                                                                                                  |
| `seekTime`           | Number                     | `10`                                                                                                                           | The time, in seconds, to seek when a user hits fast forward or rewind.                                                                                                                                                                                                                                                                                                                                  |
| `volume`             | Number                     | `1`                                                                                                                            | A number, between 0 and 1, representing the initial volume of the player.                                                                                                                                                                                                                                                                                                                               |
| `muted`              | Boolean                    | `false`                                                                                                                        | Whether to start playback muted. If the `muted` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true.                                                                                                                                                                                                                                                       |
| `clickToPlay`        | Boolean                    | `true`                                                                                                                         | Click (or tap) of the video container will toggle play/pause.                                                                                                                                                                                                                                                                                                                                           |
| `disableContextMenu` | Boolean                    | `true`                                                                                                                         | Disable right click menu on video to <em>help</em> as very primitive obfuscation to prevent downloads of content.                                                                                                                                                                                                                                                                                       |
| `hideControls`       | Boolean                    | `true`                                                                                                                         | Hide video controls automatically after 2s of no mouse or focus movement, on control element blur (tab out), on playback start or entering fullscreen. As soon as the mouse is moved, a control element is focused or playback is paused, the controls reappear instantly.                                                                                                                              |
| `resetOnEnd`         | Boolean                    | false                                                                                                                          | Reset the playback to the start once playback is complete.                                                                                                                                                                                                                                                                                                                                              |
| `keyboard`           | Object                     | `{ focused: true, global: false }`                                                                                             | Enable [keyboard shortcuts](#shortcuts) for focused players only or globally                                                                                                                                                                                                                                                                                                                            |
| `tooltips`           | Object                     | `{ controls: false, seek: true }`                                                                                              | `controls`: Display control labels as tooltips on `:hover` & `:focus` (by default, the labels are screen reader only). `seek`: Display a seek tooltip to indicate on click where the media would seek to.                                                                                                                                                                                               |
| `duration`           | Number                     | `null`                                                                                                                         | Specify a custom duration for media.                                                                                                                                                                                                                                                                                                                                                                    |
| `displayDuration`    | Boolean                    | `true`                                                                                                                         | Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. This will only work if the `preload` attribute is not set to `none` (or is not set at all) and you choose not to display the duration (see `controls` option).                                                                                                                               |
| `invertTime`         | Boolean                    | `true`                                                                                                                         | Display the current time as a countdown rather than an incremental counter.                                                                                                                                                                                                                                                                                                                             |
| `toggleInvert`       | Boolean                    | `true`                                                                                                                         | Allow users to click to toggle the above.                                                                                                                                                                                                                                                                                                                                                               |
| `listeners`          | Object                     | `null`                                                                                                                         | Allows binding of event listeners to the controls before the default handlers. See the `defaults.js` for available listeners. If your handler prevents default on the event (`event.preventDefault()`), the default handler will not fire.                                                                                                                                                              |
| `captions`           | Object                     | `{ active: false, language: 'auto', update: false }`                                                                           | `active`: Toggles if captions should be active by default. `language`: Sets the default language to load (if available). 'auto' uses the browser language. `update`: Listen to changes to tracks and update menu. This is needed for some streaming libraries, but can result in unselectable language options).                                                                                        |
| `fullscreen`         | Object                     | `{ enabled: true, fallback: true, iosNative: false, container: null }`                                                         | `enabled`: Toggles whether fullscreen should be enabled. `fallback`: Allow fallback to a full-window solution (`true`/`false`/`'force'`). `iosNative`: whether to use native iOS fullscreen when entering fullscreen (no custom controls). `container`: A selector for an ancestor of the player element, allows contextual content to remain visual in fullscreen mode. Non-ancestors are ignored.     |
| `ratio`              | String                     | `null`                                                                                                                         | Force an aspect ratio for all videos. The format is `'w:h'` - e.g. `'16:9'` or `'4:3'`. If this is not specified then the default for HTML5 and Vimeo is to use the native resolution of the video. As dimensions are not available from YouTube via SDK, 16:9 is forced as a sensible default.                                                                                                         |
| `storage`            | Object                     | `{ enabled: true, key: 'uiza' }`                                                                                               | `enabled`: Allow use of local storage to store user settings. `key`: The key name to use.                                                                                                                                                                                                                                                                                                               |
| `speed`              | Object                     | `{ selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] }`                                                                 | `selected`: The default speed for playback. `options`: The speed options to display in the UI. YouTube and Vimeo will ignore any options outside of the 0.5-2 range, so options outside of this range will be hidden automatically.                                                                                                                                                                     |
| `quality`            | Object                     | `{ default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] }`                                           | `default` is the default quality level (if it exists in your sources). `options` are the options to display. This is used to filter the available sources.                                                                                                                                                                                                                                              |
| `loop`               | Object                     | `{ active: false }`                                                                                                            | `active`: Whether to loop the current video. If the `loop` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true This is an object to support future functionality.                                                                                                                                                                                          |
| `urls`               | Object                     | See source.                                                                                                                    | If you wish to override any API URLs then you can do so here. You can also set a custom download URL for the download button.                                                                                                                                                                                                                                                                           |
| `previewThumbnails`  | Object                     | `{ enabled: false, src: '' }`                                                                                                  | `enabled`: Whether to enable the preview thumbnails (they must be generated by you). `src` must be either a string or an array of strings representing URLs for the VTT files containing the image URL(s). Learn more about [preview thumbnails](#preview-thumbnails) below.                                                                                                                            |

# API

There are methods, setters and getters on a Uiza object.

## Object

The easiest way to access the Uiza object is to set the return value from your call to the constructor to a variable. For example:

```javascript
const player = new Uiza('#player', {
  /* options */
});
```

You can also access the object through any events:

```javascript
element.addEventListener('ready', event => {
  const player = event.detail.uiza;
});
```

## Methods

Example method use:

```javascript
player.play(); // Start playback
player.fullscreen.enter(); // Enter fullscreen
```

| Method                     | Parameters       | Description                                                                                                |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `play()`&sup1;             | -                | Start playback.                                                                                            |
| `pause()`                  | -                | Pause playback.                                                                                            |
| `togglePlay(toggle)`&sup1; | Boolean          | Toggle playback, if no parameters are passed, it will toggle based on current status.                      |
| `stop()`                   | -                | Stop playback and reset to start.                                                                          |
| `restart()`                | -                | Restart playback.                                                                                          |
| `rewind(seekTime)`         | Number           | Rewind playback by the specified seek time. If no parameter is passed, the default seek time will be used. |
| `forward(seekTime)`        | Number           | Fast forward by the specified seek time. If no parameter is passed, the default seek time will be used.    |
| `increaseVolume(step)`     | Number           | Increase volume by the specified step. If no parameter is passed, the default step will be used.           |
| `decreaseVolume(step)`     | Number           | Increase volume by the specified step. If no parameter is passed, the default step will be used.           |
| `toggleCaptions(toggle)`   | Boolean          | Toggle captions display. If no parameter is passed, it will toggle based on current status.                |
| `fullscreen.enter()`       | -                | Enter fullscreen. If fullscreen is not supported, a fallback "full window/viewport" is used instead.       |
| `fullscreen.exit()`        | -                | Exit fullscreen.                                                                                           |
| `fullscreen.toggle()`      | -                | Toggle fullscreen.                                                                                         |
| `airplay()`                | -                | Trigger the airplay dialog on supported devices.                                                           |
| `toggleControls(toggle)`   | Boolean          | Toggle the controls (video only). Takes optional truthy value to force it on/off.                          |
| `on(event, function)`      | String, Function | Add an event listener for the specified event.                                                             |
| `once(event, function)`    | String, Function | Add an event listener for the specified event once.                                                        |
| `off(event, function)`     | String, Function | Remove an event listener for the specified event.                                                          |
| `supports(type)`           | String           | Check support for a mime type.                                                                             |
| `destroy()`                | -                | Destroy the instance and garbage collect any elements.                                                     |

1.  For HTML5 players, `play()` will return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for most browsers - e.g. Chrome, Firefox, Opera, Safari and Edge [according to MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) at time of writing.

## Getters and Setters

Example setters:

```javascript
player.volume = 0.5; // Sets volume at 50%
player.currentTime = 10; // Seeks to 10 seconds
```

Example getters:

```javascript
player.volume; // 0.5;
player.currentTime; // 10
player.fullscreen.active; // false;
```

| Property             | Getter | Setter | Description                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isHTML5`            | ✓      | -      | Returns a boolean indicating if the current player is HTML5.                                                                                                                                                                                                                                                                           |
| `isEmbed`            | ✓      | -      | Returns a boolean indicating if the current player is an embedded player.                                                                                                                                                                                                                                                              |
| `playing`            | ✓      | -      | Returns a boolean indicating if the current player is playing.                                                                                                                                                                                                                                                                         |
| `paused`             | ✓      | -      | Returns a boolean indicating if the current player is paused.                                                                                                                                                                                                                                                                          |
| `stopped`            | ✓      | -      | Returns a boolean indicating if the current player is stopped.                                                                                                                                                                                                                                                                         |
| `ended`              | ✓      | -      | Returns a boolean indicating if the current player has finished playback.                                                                                                                                                                                                                                                              |
| `buffered`           | ✓      | -      | Returns a float between 0 and 1 indicating how much of the media is buffered                                                                                                                                                                                                                                                           |
| `currentTime`        | ✓      | ✓      | Gets or sets the currentTime for the player. The setter accepts a float in seconds.                                                                                                                                                                                                                                                    |
| `seeking`            | ✓      | -      | Returns a boolean indicating if the current player is seeking.                                                                                                                                                                                                                                                                         |
| `duration`           | ✓      | -      | Returns the duration for the current media.                                                                                                                                                                                                                                                                                            |
| `volume`             | ✓      | ✓      | Gets or sets the volume for the player. The setter accepts a float between 0 and 1.                                                                                                                                                                                                                                                    |
| `muted`              | ✓      | ✓      | Gets or sets the muted state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                              |
| `hasAudio`           | ✓      | -      | Returns a boolean indicating if the current media has an audio track.                                                                                                                                                                                                                                                                  |
| `speed`              | ✓      | ✓      | Gets or sets the speed for the player. The setter accepts a value in the options specified in your config. Generally the minimum should be 0.5.                                                                                                                                                                                        |
| `quality`&sup1;      | ✓      | ✓      | Gets or sets the quality for the player. The setter accepts a value from the options specified in your config.                                                                                                                                                                                                                         |
| `loop`               | ✓      | ✓      | Gets or sets the current loop state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                       |
| `source`             | ✓      | ✓      | Gets or sets the current source for the player. The setter accepts an object. See [source setter](#the-source-setter) below for examples.                                                                                                                                                                                              |
| `poster`             | ✓      | ✓      | Gets or sets the current poster image for the player. The setter accepts a string; the URL for the updated poster image.                                                                                                                                                                                                               |
| `autoplay`           | ✓      | ✓      | Gets or sets the autoplay state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                           |
| `currentTrack`       | ✓      | ✓      | Gets or sets the caption track by index. `-1` means the track is missing or captions is not active                                                                                                                                                                                                                                     |
| `language`           | ✓      | ✓      | Gets or sets the preferred captions language for the player. The setter accepts an ISO two-letter language code. Support for the languages is dependent on the captions you include. If your captions don't have any language data, or if you have multiple tracks with the same language, you may want to use `currentTrack` instead. |
| `fullscreen.active`  | ✓      | -      | Returns a boolean indicating if the current player is in fullscreen mode.                                                                                                                                                                                                                                                              |
| `fullscreen.enabled` | ✓      | -      | Returns a boolean indicating if the current player has fullscreen enabled.                                                                                                                                                                                                                                                             |
| `pip`&sup1;          | ✓      | ✓      | Gets or sets the picture-in-picture state of the player. The setter accepts a boolean. This currently only supported on Safari 10+ (on MacOS Sierra+ and iOS 10+) and Chrome 70+.                                                                                                                                                      |
| `ratio`              | ✓      | ✓      | Gets or sets the video aspect ratio. The setter accepts a string in the same format as the `ratio` option.                                                                                                                                                                                                                             |
| `download`           | ✓      | ✓      | Gets or sets the URL for the download button. The setter accepts a string containing a valid absolute URL.                                                                                                                                                                                                                             |

1.  HTML5 only

_Note:_ `src` property for YouTube and Vimeo can either be the video ID or the whole URL.

| Property                  | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                    | String | Either `video` or `audio`.                                                                                                                                                                                                                                                                                                           |
| `title`                   | String | _Optional._ Title of the new media. Used for the `aria-label` attribute on the play button, and outer container. YouTube and Vimeo are populated automatically.                                                                                                                                                                                                                                                |
| `sources`                 | Array  | This is an array of sources. For HTML5 media, the properties of this object are mapped directly to HTML attributes so more can be added to the object if required.                                                                                                                                                                                                                                             |
| `poster`&sup1;            | String | The URL for the poster image (HTML5 video only).                                                                                                                                                                                                                                                                                                                                                               |
| `tracks`&sup1;            | String | An array of track objects. Each element in the array is mapped directly to a track element and any keys mapped directly to HTML attributes so as in the example above, it will render as `<track kind="captions" label="English" srclang="en" src="https://cdn.selz.com/uiza/1.0/example_captions_en.vtt" default>` and similar for the French version. Booleans are converted to HTML5 value-less attributes. |
| `previewThumbnails`&sup1; | Object | The same object like in the `previewThumbnails` constructor option. This means you can either change the thumbnails vtt via the `src` key or disable the thumbnails plugin for the next video by passing `{ enabled: false }`.                                                                                                                                                                                 |

1.  HTML5 only

# Events

You can listen for events on the target element you setup Uiza on (see example under the table). Some events only apply to HTML5 audio and video. Using your
reference to the instance, you can use the `on()` API method or `addEventListener()`. Access to the API can be obtained this way through the `event.detail.uiza`
property. Here's an example:

```javascript
player.on('ready', event => {
  const instance = event.detail.uiza;
});
```

## Standard Media Events

| Event Type         | Description                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `progress`         | Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's `buffered` attribute. |
| `playing`          | Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).                                                                                         |
| `play`             | Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior `pause` event.                                                                                        |
| `pause`            | Sent when playback is paused.                                                                                                                                                                                          |
| `timeupdate`       | The time indicated by the element's `currentTime` attribute has changed.                                                                                                                                               |
| `volumechange`     | Sent when the audio volume changes (both when the volume is set and when the `muted` state is changed).                                                                                                                |
| `seeking`          | Sent when a seek operation begins.                                                                                                                                                                                     |
| `seeked`           | Sent when a seek operation completes.                                                                                                                                                                                  |
| `ratechange`       | Sent when the playback speed changes.                                                                                                                                                                                  |
| `ended`            | Sent when playback completes. _Note:_ This does not fire if `autoplay` is true.                                                                                                                                        |
| `enterfullscreen`  | Sent when the player enters fullscreen mode (either the proper fullscreen or full-window fallback for older browsers).                                                                                                 |
| `exitfullscreen`   | Sent when the player exits fullscreen mode.                                                                                                                                                                            |
| `captionsenabled`  | Sent when captions are enabled.                                                                                                                                                                                        |
| `captionsdisabled` | Sent when captions are disabled.                                                                                                                                                                                       |
| `languagechange`   | Sent when the caption language is changed.                                                                                                                                                                             |
| `controlshidden`   | Sent when the controls are hidden.                                                                                                                                                                                     |
| `controlsshown`    | Sent when the controls are shown.                                                                                                                                                                                      |
| `ready`            | Triggered when the instance is ready for API calls.                                                                                                                                                                    |

### HTML5 only

| Event Type       | Description                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loadstart`      | Sent when loading of the media begins.                                                                                                                                                                                                                                                                                                         |
| `loadeddata`     | The first frame of the media has finished loading.                                                                                                                                                                                                                                                                                             |
| `loadedmetadata` | The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.                                                                                                                                                                                                                          |
| `qualitychange`  | The quality of playback has changed.                                                                                                                                                                                                                                                                                                           |
| `canplay`        | Sent when enough data is available that the media can be played, at least for a couple of frames. This corresponds to the `HAVE_ENOUGH_DATA` `readyState`.                                                                                                                                                                                     |
| `canplaythrough` | Sent when the ready state changes to `CAN_PLAY_THROUGH`, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. _Note:_ Manually setting the `currentTime` will eventually fire a `canplaythrough` event in firefox. Other browsers might not fire this event. |
| `stalled`        | Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.                                                                                                                                                                                                                                              |
| `waiting`        | Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).                                                                                                                                                                                                                  |
| `emptied`        | he media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the `load()` method is called to reload it.                                                                                                                                                                         |
| `cuechange`      | Sent when a `TextTrack` has changed the currently displaying cues.                                                                                                                                                                                                                                                                             |
| `error`          | Sent when an error occurs. The element's `error` attribute contains more information.                                                                                                                                                                                                                                                          |


# Shortcuts

By default, a player will bind the following keyboard shortcuts when it has focus. If you have the `global` option to `true` and there's only one player in the
document then the shortcuts will work when any element has focus, apart from an element that requires input.

| Key        | Action                                 |
| ---------- | -------------------------------------- |
| `0` to `9` | Seek from 0 to 90% respectively        |
| `space`    | Toggle playback                        |
| `K`        | Toggle playback                        |
| &larr;     | Seek backward by the `seekTime` option |
| &rarr;     | Seek forward by the `seekTime` option  |
| &uarr;     | Increase volume                        |
| &darr;     | Decrease volume                        |
| `M`        | Toggle mute                            |
| `F`        | Toggle fullscreen                      |
| `C`        | Toggle captions                        |
| `L`        | Toggle loop                            |

# Preview thumbnails

It's possible to display preview thumbnails as per the demo when you hover over the scrubber or while you are scrubbing in the main video area. This can be used for all video types but is easiest with HTML5 of course. You will need to generate the sprite or images yourself. This is possible using something like AWS transcoder to generate the frames and then combine them into a sprite image. Sprites are recommended for performance reasons - they will be much faster to download and easier to compress into a small file size making them load faster.

You can see the example VTT files [here](https://cdn.uiza.io/static/demo/thumbs/100p.vtt) and [here](https://cdn.Uizuizaa.io/static/demo/thumbs/240p.vtt) for how the sprites are done. The coordinates are set as the `xywh` hash on the URL in the order X Offset, Y Offset, Width, Height (e.g. `240p-00001.jpg#xywh=1708,480,427,240` is offset `1708px` from the left, `480px` from the top and is `427x240px`. If you want to include images per frame, this is also possible but will be slower, resulting in a degraded experience.

# Fullscreen

Fullscreen in Uiza is supported by all browsers that [currently support it](http://caniuse.com/#feat=fullscreen).

# Browser support

Uiza supports the last 2 versions of most _modern_ browsers.

| Browser       | Supported       |
| ------------- | --------------- |
| Safari        | ✓               |
| Mobile Safari | ✓&sup1;         |
| Firefox       | ✓               |
| Chrome        | ✓               |
| Opera         | ✓               |
| Edge          | ✓               |
| IE11          | ✓&sup3;         |
| IE10          | ✓<sup>2,3</sup> |

1.  Mobile Safari on the iPhone forces the native player for `<video>` unless the `playsinline` attribute is present. Volume controls are also disabled as they are handled device wide.
2.  Native player used (no support for `<progress>` or `<input type="range">`) but the API is supported. No native fullscreen support, fallback can be used (see [options](#options)).
3.  Polyfills required. See below.

## Polyfills

Uiza uses ES6 which isn't supported in all browsers quite yet. This means some features will need to be polyfilled to be available otherwise you'll run into issues. We've elected to not burden the ~90% of users that do support these features with extra JS and instead leave polyfilling to you to work out based on your needs. The easiest method I've found is to use [polyfill.io](https://polyfill.io) which provides polyfills based on user agent. This is the method the demo uses.

## Checking for support

You can use the static method to check for support. For example

```javascript
const supported = Uiza.supported('video', 'html5', true);
```

The arguments are:

- Media type (`audio` or `video`)
- Provider (`html5` or `hls`)
- Whether the player has the `playsinline` attribute (only applicable to iOS 10+)

## Disable support programmatically

The `enabled` option can be used to disable certain User Agents. For example, if you don't want to use Uiza for smartphones, you could use:

```javascript
{
  enabled: !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}
```

If a User Agent is disabled but supports `<video>` and `<audio>` natively, it will use the native player.


# Copyright and License

[The MIT license](LICENSE.md)
