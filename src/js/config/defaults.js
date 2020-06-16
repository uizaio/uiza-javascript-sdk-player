// ==========================================================================
// Uiza default config
// ==========================================================================

import { version as VERSION } from '../../../package.json';
import events from '../events';

const CLOUD_URL = `https://cdn.jsdelivr.net/npm/@uizaio/playerjs@${VERSION}/dist/`;

const defaults = {
  // Disable
  enabled: true,

  // Custom media title
  title: '',

  // Logging to console
  debug: false,

  // Dark mode
  dark: false,
  darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,

  // Analytic Plugin
  analytic: true,

  // Embed and Share video
  sharing: true,

  // Toggle Live timeshift
  timeshift: true,

  // Stats
  stats: true,
  statsShow: ['version', 'codecs', 'bitrate', 'buffered', 'bandwidth', 'latency', 'resolution', 'viewport_dropped', 'entity_id', 'app_id'],

  // Auto play (if supported)
  autoplay: false,

  // Allow inline playback on iOS (HTML5 requires the attribute present)
  // TODO: Remove iosNative fullscreen option in favour of this (logic needs work)
  playsinline: true,

  // Default time to skip when rewind/fast forward
  seekTime: 10,

  // Default volume
  volume: 1,
  muted: false,

  // Pass a custom duration
  duration: null,

  // Display the media duration on load in the current time position
  // If you have opted to display both duration and currentTime, this is ignored
  displayDuration: true,

  // Invert the current time to be a countdown
  invertTime: true,

  // Clicking the currentTime inverts it's value to show time left rather than elapsed
  toggleInvert: true,

  // Force an aspect ratio
  // The format must be `'w:h'` (e.g. `'16:9'`)
  ratio: null,

  // Click video container to play/pause
  clickToPlay: true,

  // Auto hide the controls
  hideControls: true,

  // Reset to start when playback ended
  resetOnEnd: true,

  // Disable the standard context menu
  disableContextMenu: true,

  // Sprite (for icons)
  loadSprite: true,
  iconPrefix: 'uiza',
  iconUrl: `${CLOUD_URL}uiza.svg`,

  // Blank video (used to prevent errors on source change)
  blankVideo: '',

  // Quality default
  quality: {
    forced: false,
    options: [],
  },

  // Set loops
  loop: {
    active: false,
    // start: null,
    // end: null,
  },

  // Speed default and options to display
  speed: {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  },

  // Keyboard shortcut settings
  keyboard: {
    focused: true,
    global: false,
  },

  // Captions settings
  captions: {
    active: false,
    language: 'auto',
    // Listen to new tracks added after Uiza is initialized.
    // This is needed for streaming captions, but may result in unselectable options
    update: true,
  },

  // Display tooltips
  tooltips: {
    controls: false,
    seek: true,
  },

  // Fullscreen settings
  fullscreen: {
    enabled: true, // Allow fullscreen?
    fallback: true, // Fallback using full viewport/window
    iosNative: true, // Use the native fullscreen in iOS (disables custom controls)
  },

  // Local storage
  storage: {
    enabled: true,
    key: 'uiza',
  },

  // Default controls
  controls: ['play-large', 'play', 'mute', 'volume', 'current-time', 'progress', 'captions', 'settings', 'pip', 'fullscreen'],
  settings: ['captions', 'quality', 'speed', 'stats', 'timeshift'],
  contextmenus: ['sharelink', 'embed', 'timeshift', 'stats'],

  ui: {
    restart: true,
    rewind: true,
    play: true,
    mute: true,
    volume: true,
    currentTime: true,
    fastForward: true,
    progress: true,
    captions: true,
    settings: true,
    pip: true,
    live: true,
    fullscreen: true,
    speed: true,

    // USDK-22 `toggleLiveViewer`, receiving `true` or `false` ( `true` by default ).
    // If the flag is `false` then we still report the watching events but won't show it on the Player Screen.
    toggleLiveViewer: true,
  },

  // Localisation
  i18n: {
    dropped_of: 'dropped frame',
    codecs: 'Codecs',
    resolution: 'Resolution',
    viewport_dropped: 'Viewport / Frames',
    app_id: 'App ID',
    entity_id: 'Entity ID',
    version: 'Version',
    targetduration: 'Target Duration',
    totalduration: 'Total Duration',
    bandwidth: 'Bandwidth',
    download: 'Download',
    latency: 'Latency',
    bitrate: 'Bitrate',
    restart: 'Restart',
    rewind: 'Rewind {seektime}s',
    live: '● LIVE',
    viewer: 'Viewer',
    viewers: 'Viewers',
    play: 'Play',
    pause: 'Pause',
    fastForward: 'Forward {seektime}s',
    seek: 'Seek',
    seekLabel: '{currentTime} of {duration}',
    played: 'Played',
    buffered: 'Buffered',
    currentTime: 'Current time',
    duration: 'Duration',
    volume: 'Volume',
    mute: 'Mute',
    unmute: 'Unmute',
    enableCaptions: 'Enable captions',
    disableCaptions: 'Disable captions',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
    frameTitle: 'Player for {title}',
    captions: 'Captions',
    settings: 'Settings',
    stats: 'Stats',
    timeshift: 'Time Shift',
    embed: 'Copy embed code',
    sharelink: 'Copy share link',
    menuBack: 'Go back to previous menu',
    speed: 'Speed',
    normal: 'Normal',
    quality: 'Quality',
    loop: 'Loop',
    start: 'Start',
    end: 'End',
    all: 'All',
    reset: 'Reset',
    disabled: 'Disabled',
    enabled: 'Enabled',
    qualityBadge: {
      '4k': '4K',
      hd: 'HD',
      sd: 'SD',
    },
  },

  // URLs
  urls: {
    hlsjs: {
      sdk: `https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.13.2/hls.min.js`,
    },
    fingerprintjs2: {
      sdk: `https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/2.1.0/fingerprint2.min.js`,
    },
  },

  // Custom control listeners
  listeners: {
    seek: null,
    play: null,
    pause: null,
    restart: null,
    rewind: null,
    fastForward: null,
    mute: null,
    volume: null,
    captions: null,
    fullscreen: null,
    pip: null,
    speed: null,
    quality: null,
    loop: null,
    language: null,
  },

  // Events to watch and bubble
  events: Object.values(events),

  // Selectors
  // Change these to match your template if using custom HTML
  selectors: {
    editable: 'input, textarea, select, [contenteditable]',
    container: '.uiza',
    controls: {
      container: null,
      wrapper: '.uiza__controls',
    },
    labels: '[data-uiza]',
    buttons: {
      play: '[data-uiza="play"]',
      pause: '[data-uiza="pause"]',
      restart: '[data-uiza="restart"]',
      rewind: '[data-uiza="rewind"]',
      fastForward: '[data-uiza="fast-forward"]',
      mute: '[data-uiza="mute"]',
      captions: '[data-uiza="captions"]',
      fullscreen: '[data-uiza="fullscreen"]',
      pip: '[data-uiza="pip"]',
      settings: '[data-uiza="settings"]',
      loop: '[data-uiza="loop"]',
    },
    inputs: {
      seek: '[data-uiza="seek"]',
      volume: '[data-uiza="volume"]',
      speed: '[data-uiza="speed"]',
      language: '[data-uiza="language"]',
      quality: '[data-uiza="quality"]',
    },
    display: {
      currentTime: '.uiza__time--current',
      duration: '.uiza__time--duration',
      buffer: '.uiza__progress__buffer',
      loop: '.uiza__progress__loop', // Used later
      volume: '.uiza__volume--display',
    },
    progress: '.uiza__progress',
    captions: '.uiza__captions',
    caption: '.uiza__caption',
  },

  // Class hooks added to the player in different states
  classNames: {
    type: 'uiza--{0}',
    provider: 'uiza--{0}',
    video: 'uiza__video-wrapper',
    embed: 'uiza__video-embed',
    videoFixedRatio: 'uiza__video-wrapper--fixed-ratio',
    embedContainer: 'uiza__video-embed__container',
    poster: 'uiza__poster',
    watching: 'uiza--watching',
    live: 'uiza--live uiza__live',
    stats: 'uiza--stats',
    posterEnabled: 'uiza__poster-enabled',
    control: 'uiza__control',
    controlPressed: 'uiza__control--pressed',
    playing: 'uiza--playing',
    paused: 'uiza--paused',
    stopped: 'uiza--stopped',
    loading: 'uiza--loading',
    hover: 'uiza--hover',
    tooltip: 'uiza__tooltip',
    cues: 'uiza__cues',
    hidden: 'uiza__sr-only',
    hideControls: 'uiza--hide-controls',
    isIos: 'uiza--is-ios',
    isTouch: 'uiza--is-touch',
    uiSupported: 'uiza--full-ui',
    noTransition: 'uiza--no-transition',
    display: {
      time: 'uiza__time',
    },
    contextmenu: 'uiza__contextmenu',
    menu: {
      value: 'uiza__menu__value',
      badge: 'uiza__badge',
      open: 'uiza--menu-open',
    },
    captions: {
      enabled: 'uiza--captions-enabled',
      active: 'uiza--captions-active',
    },
    fullscreen: {
      enabled: 'uiza--fullscreen-enabled',
      fallback: 'uiza--fullscreen-fallback',
    },
    pip: {
      supported: 'uiza--pip-supported',
      active: 'uiza--pip-active',
    },
    tabFocus: 'uiza__tab-focus',
    previewThumbnails: {
      // Tooltip thumbs
      thumbContainer: 'uiza__preview-thumb',
      thumbContainerShown: 'uiza__preview-thumb--is-shown',
      imageContainer: 'uiza__preview-thumb__image-container',
      timeContainer: 'uiza__preview-thumb__time-container',
      // Scrubbing
      scrubbingContainer: 'uiza__preview-scrubbing',
      scrubbingContainerShown: 'uiza__preview-scrubbing--is-shown',
    },
  },

  // Embed attributes
  attributes: {
    provider: 'data-uiza-provider',
    id: 'data-uiza-id',
    src: 'src',
  },

  // Preview Thumbnails plugin
  previewThumbnails: {
    enabled: false,
    src: '',
  },

  // Buffer
  buffer: {
    maxBufferLength: 10, // 10 forward
    maxMaxBufferLength: 60, // 60s total
  },

  // Adaptive
  adaptive: {
    startLevel: 0,
  },

  // Retry
  retry: {
    manifestLoadingMaxRetry: 3,
    manifestLoadingRetryDelay: 1000,
    levelLoadingMaxRetry: 3,
    levelLoadingRetryDelay: 1000,
    fragLoadingMaxRetry: 6,
    fragLoadingRetryDelay: 1000,
  },
};

export default defaults;
