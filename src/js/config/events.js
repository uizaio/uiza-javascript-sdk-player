// ==========================================================================
// Uiza events
// ==========================================================================

const events = {
  // Events to watch on HTML5 media elements and bubble
  // https://developer.mozilla.org/en/docs/Web/Guide/Events/Media_events
  // https://html.spec.whatwg.org/#mediaevents
  ABORT: 'abort',
  CAN_PLAY: 'canplay',
  CAN_PLAY_THROUGH: 'canplaythrough',
  DURATION_CHANGE: 'durationchange',
  EMPTIED: 'emptied',
  ENCRYPTED: 'encrypted',
  ENDED: 'ended',
  ERROR: 'error',
  INTERRUPT_BEGIN: 'interruptbegin',
  INTERRUPT_END: 'interruptend',
  LOADED_DATA: 'loadeddata',
  LOADED_META_DATA: 'loadedmetadata',
  LOAD_START: 'loadstart',
  MOZ_AUDIO_AVAILABLE: 'mozaudioavailable',
  PAUSE: 'pause',
  PLAY: 'play',
  PLAYING: 'playing',
  PROGRESS: 'progress',
  RATE_CHANGE: 'ratechange',
  RESIZE: 'resize',
  SEEKED: 'seeked',
  SEEKING: 'seeking',
  STALLED: 'stalled',
  SUSPEND: 'suspend',
  TIME_UPDATE: 'timeupdate',
  VOLUME_CHANGE: 'volumechange',
  WAITING: 'waiting',

  // Custom events
  CAPTIONS_ENABLED: 'captionsenabled',
  CAPTION_DISABLED: 'captionsdisabled',
  CONTROLS_HIDDEN: 'controlshidden',
  CONTROLS_SHOWN: 'controlsshown',
  CUE_CHANGE: 'cuechange',
  ENTER_FULLSCREEN: 'enterfullscreen',
  EXIT_FULLSCREEN: 'exitfullscreen',
  LANGUAGE_CHANGE: 'languagechange',
  READY: 'ready',

  // Quality
  QUALITY_CHANGE: 'qualitychange',

  // PIP
  ENTER_PIP: 'enterpip',
  EXIT_PIP: 'exitpip',

  // HLSjs
  // HLSjs: Manifest events
  MANIFEST_LOADING: 'manifestloading',
  MANIFEST_LOADED: 'manifestloaded',
  MANIFEST_PARSED: 'manifestparsed',
  // HLSjs: Level events
  LEVEL_SWITCHING: 'levelswitching',
  LEVEL_SWITCHED: 'levelswitched',
  LEVEL_LOADING: 'levelloading',
  LEVEL_LOADED: 'levelloaded',
  LEVEL_UPDATED: 'levelupdated',
  LEVEL_PTS_UPDATED: 'levelptsupdated',
  // HLSjs: Fragment events
  FRAG_LOADING: 'fragloading',
  FRAG_LOAD_PROGRESS: 'fragloadprogress',
  FRAG_LOAD_EMERGENCY_ABORTED: 'fragloademergencyaborted',
  FRAG_LOADED: 'fragloaded',
  FRAG_DECRYPTED: 'fragdecrypted',
  FRAG_PARSING_INIT_SEGMENT: 'fragparsinginitsegment',
  FRAG_PARSING_USERDATA: 'fragparsinguserdata',
  FRAG_PARSING_METADATA: 'fragparsingmetadata',
  FRAG_PARSING_DATA: 'fragparsingdata',
  FRAG_PARSED: 'fragparsed',
  FRAG_BUFFERED: 'fragbuffered',
  FRAG_CHANGED: 'fragchanged',
  // HLSjs: FPS drop events
  FPS_DROP: 'fpsdrop',
  FPS_DROP_LEVEL_CAPPING: 'fpsdroplevelcapping',
};

export default events;
