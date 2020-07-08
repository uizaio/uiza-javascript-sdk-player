// ==========================================================================
// Uiza HTML5 helpers
// ==========================================================================

import { providers } from './config/types';
import events from './events';
import { toggleClass } from './utils/elements';
import { triggerEvent } from './utils/events';
import is from './utils/is';
import loadScript from './utils/load-script';

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
    const player = this;
    if (!window.Hls.isSupported()) {
      this.provider = providers.html5;
      player.media.src = player.config.src;
    } else {
      // eslint-disable-next-line no-undef
      const hls = new Hls({
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

      player.on(events.LEVEL_UPDATED, () => {
        if (this.isLive) {
          const now = (new Date().getTime() / 1000).toFixed(0);
          const { programDateTime } = this.uiza;
          if (programDateTime && now - programDateTime > player.targetDuration * 3) {
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

        if (this.isLive) {
          player.currentTime = player.duration - 1;
        }

        if (this.uiza.playing) {
          player.play();
        }

        const qualities = hls.levels.map(level => level.height);
        player.options.quality = [-1, ...qualities]; // clone array without ref
        player.config.quality.options = qualities[0] < qualities[qualities.length - 1] ? [-1, ...qualities.reverse()] : [-1, ...qualities]; // force support quality from manifest
        player.quality = -1;
        this.setQualityMenu.call(player, player.options.quality);
      });

      hls.on(window.Hls.Events.FRAG_PARSED, () => {
        const { attrs } = hls.levels[window.hls.currentLevel] || {};
        if (attrs) {
          const frameRate = Number(attrs['FRAME-RATE']).toFixed(0);
          player.setUiza({ codecs: attrs.CODECS, resolution: [attrs.RESOLUTION, '@', frameRate].join('') });
        }
      });

      hls.on(window.Hls.Events.FRAG_CHANGED, () => {
        const now = (new Date().getTime() / 1000).toFixed(0);
        player.setUiza({ programDateTime: now, live_ended: false });
      });

      hls.on(window.Hls.Events.LEVEL_LOADED, (event, data) => {
        const { details } = data;
        const { programDateTime } = this.uiza;
        const now = (new Date().getTime() / 1000).toFixed(0);

        // Pause request with timeout 60 seconds
        if (now - programDateTime > 60) {
          player.pause();
          player.setUiza({ live_ended: true });
          hlsjs.cancelRequests.call(this);
        }

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

      // Quality
      Object.defineProperty(player.media, 'quality', {
        get() {
          const { currentLevel, levels } = window.hls;
          return levels && levels[currentLevel] ? levels[currentLevel].height : -1;
        },
        set(input) {
          // If we're using an an external handler...
          if (player.config.quality.forced && is.function(player.config.quality.onChange)) {
            player.config.quality.onChange(input);
          } else if (input === -1) {
            player.debug.log('Set quality to auto');
            window.hls.nextLevel = -1;
          } else {
            player.debug.log(`Set quality to manual: ${input}p`);
            const newLevel = window.hls.levels.map(o => o.height).indexOf(input);
            window.hls.currentLevel = newLevel;
          }

          // Trigger change event
          triggerEvent.call(player, player.media, events.QUALITY_CHANGE, false, {
            quality: input,
          });
        },
      });
    }
  },

  // Cancel current network requests
  cancelRequests() {
    if (!this.isHlsjs && !!window.hls) {
      return;
    }

    window.hls.destroy();
    this.debug.log('Cancelled network requests');
  },
};

export default hlsjs;
