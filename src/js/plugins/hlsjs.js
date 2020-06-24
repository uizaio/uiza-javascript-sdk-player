// ==========================================================================
// HLSjs plugin
// ==========================================================================

import { providers } from '../config/types';
import controls from '../controls';
import events from '../events';
import { toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import is from '../utils/is';
import loadScript from '../utils/load-script';
import { setAspectRatio } from '../utils/style';

const fowardEvents = [
  // Foward events of HLSjs
  // https://github.com/video-dev/hls.js/blob/master/docs/API.md#runtime-events

  // Manifest events
  'MANIFEST_LOADING',
  'MANIFEST_LOADED',
  'MANIFEST_PARSED',

  // Level events
  'LEVEL_SWITCHING',
  'LEVEL_SWITCHED',
  'LEVEL_LOADING',
  'LEVEL_LOADED',
  'LEVEL_UPDATED',
  'LEVEL_PTS_UPDATED',

  // Fragment events
  'FRAG_LOADING',
  'FRAG_LOAD_PROGRESS',
  'FRAG_LOAD_EMERGENCY_ABORTED',
  'FRAG_LOADED',
  'FRAG_DECRYPTED',
  'FRAG_PARSING_INIT_SEGMENT',
  'FRAG_PARSING_USERDATA',
  'FRAG_PARSING_METADATA',
  'FRAG_PARSING_DATA',
  'FRAG_PARSED',
  'FRAG_BUFFERED',
  'FRAG_CHANGED',

  // FPS drop events
  'FPS_DROP',
  'FPS_DROP_LEVEL_CAPPING',
];

const hlsjs = {
  setup() {
    // Add type class
    toggleClass(this.elements.container, this.config.classNames.type.replace('{0}', this.type), true);

    // Add provider class
    toggleClass(this.elements.container, this.config.classNames.provider.replace('{0}', 'html5'), true);
    toggleClass(this.elements.container, this.config.classNames.provider.replace('{0}', this.provider), true);

    // Set intial ratio
    setAspectRatio.call(this);

    // Load the SDK if not already
    if (!is.function(window.Hls)) {
      loadScript(this.config.urls.hlsjs.sdk)
        .then(() => {
          hlsjs.ready.call(this);
        })
        .catch(error => {
          this.debug.warn('Hlsjs failed to load', error);
        });
    } else {
      hlsjs.ready.call(this);
    }
  },

  ready() {
    this.debug.log('Hlsjs ready');
    const player = this;

    // Playback speed
    player.options.speed = player.config.speed.options;

    if (!window.Hls.isSupported()) {
      this.provider = providers.html5;
      player.media.src = player.config.src;
    } else {
      // eslint-disable-next-line no-undef
      const hls = new Hls({
        debug: true,
        startLevel: this.config.adaptive.startLevel,
        // Buffer config
        maxBufferLength: this.config.buffer.maxBufferLength < 30 ? this.config.buffer.maxBufferLength : 10,
        maxMaxBufferLength: this.config.buffer.maxMaxBufferLength < 60 ? this.config.buffer.maxMaxBufferLength : 60,
      });

      // Forward Hlsjs events
      fowardEvents.forEach(evt => {
        hls.on(window.Hls.Events[evt], (event, data) => {
          triggerEvent.call(player, player.elements.container, events[evt], false, data);
        });
      });

      // Captions
      player.on(`${events.LANGUAGE_CHANGE} ${events.CAPTIONS_ENABLED}`, () => {
        setTimeout(() => {
          hls.subtitleTrack = player.currentTrack;
        }, 50);
      });

      player.on(events.CAPTION_DISABLED, () => {
        setTimeout(() => {
          hls.subtitleTrack = -1;
        }, 50);
      });

      player.on(events.LEVEL_UPDATED, () => {
        if (this.isLive) {
          const now = (new Date().getTime() / 1000).toFixed(0);
          const lastUpdateDuration = sessionStorage.getItem('uiza-last_update_duration');
          if (lastUpdateDuration && Number(now) - Number(lastUpdateDuration) > player.targetDuration * 3) {
            toggleClass(this.elements.live, 'show', false);
            toggleClass(this.elements.watching, 'show', false);
          } else {
            toggleClass(this.elements.live, 'show', true);
            toggleClass(this.elements.watching, 'show', true);
          }

          // Toggle progress for non-timeshift and timeshift livestream
          if (!this.uiza.timeshift) {
            toggleClass(this.elements.progress, 'show', false);
            toggleClass(this.elements.settings.buttons.speed, 'hide', true);
          } else {
            toggleClass(this.elements.progress, 'show', true);
            toggleClass(this.elements.settings.buttons.speed, 'hide', false);
          }
        }
      });

      player.on(events.DURATION_CHANGE, () => {
        const now = (new Date().getTime() / 1000).toFixed(0);
        sessionStorage.setItem('uiza-last_update_duration', now);
      });

      hls.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
        const { timeshift } = data;
        if (timeshift === 'extras/master.m3u8' || timeshift === 'master.m3u8') {
          player.setUiza({
            src: player.config.src.replace('extras/master.m3u8', 'master.m3u8'),
            extras: player.config.src.replace('master.m3u8', 'extras/master.m3u8').replace('extras/extras', 'extras'),
          });
          toggleClass(this.elements.settings.buttons.timeshift, 'show', true);
        } else {
          toggleClass(this.elements.progress, 'show', true);
        }

        const qualities = [];

        if (this.isLive) {
          player.currentTime = player.duration - 1;
        }

        if (this.uiza.playing) {
          player.play();
        }

        hls.levels.forEach(level => {
          qualities.push(level.height);
        });

        player.options.quality = [-1, ...qualities]; // clone array without ref
        player.config.quality.options = qualities[0] < qualities[qualities.length - 1] ? [-1, ...qualities.reverse()] : [-1, ...qualities]; // force support quality from manifest
        // player.quality = player.options.quality[0];
        player.quality = -1;

        controls.setQualityMenu.call(player, player.options.quality);
      });

      hls.on(window.Hls.Events.FRAG_PARSED, (event, data) => {
        const { attrs } = hls.levels[window.hls.currentLevel] || {};
        if (attrs) {
          const frameRate = Number(attrs['FRAME-RATE']).toFixed(0);
          player.setUiza({ codecs: attrs.CODECS, resolution: [attrs.RESOLUTION, '@', frameRate].join('') });
        }
      });

      hls.on(window.Hls.Events.LEVEL_LOADED, (event, data) => {
        const { details } = data;
        if (details && details.targetduration) {
          player.setUiza({
            targetduration: details.targetduration,
            totalduration: details.totalduration,
            version: details.version,
            live: details.live,
            vod: details.type === 'VOD',
          });
        }
      });

      hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(this.config.src);
      });

      hls.detachMedia();
      hls.attachMedia(player.media);

      window.hls = hls;
    }
  },
};

export default hlsjs;
