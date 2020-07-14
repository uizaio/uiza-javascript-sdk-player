import events from '../events';
import i18n from '../utils/i18n';

const UzStats = {
  setup() {
    UzStats.ready.call(this);
  },

  ready() {
    const player = this;
    const droppedOf = i18n.get('dropped_of', this.config);
    player.setUiza({
      currentDropped: 0,
      viewport_dropped: `${player.media.clientWidth}x${player.media.clientHeight} / 0 ${droppedOf}`,
    });

    player.on(events.FPS_DROP, event => {
      const { detail: data = undefined } = event || {};

      if (data) {
        let { currentDropped } = data;
        currentDropped += this.uiza.currentDropped;
        player.setUiza({
          currentDropped,
          viewport_dropped: `${player.media.clientWidth}x${player.media.clientHeight} / ${currentDropped} ${droppedOf}`,
        });
      }
    });

    // Listen level switched
    player.on(events.LEVEL_SWITCHED, event => {
      const { detail: { level = -1 } = {} } = event || {};

      if (level > -1) {
        const videoBitrate = Math.round(window.hls.levels[level].bitrate / 1000);
        player.quality = window.hls.levels[level].height;
        player.setUiza({
          bitrate: `${videoBitrate} kbps`,
        });
      }
    });

    // Listen progress to get buffered
    player.on(events.PROGRESS, () => {
      let videoBufferLength = 0;
      const { buffered } = player.media;
      const { currentTime } = player;
      for (let i = 0; i < buffered.length; i += 1) {
        if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
          videoBufferLength = player.media.buffered.end(i) - currentTime;
        }
      }
      // The duration of the forward buffer
      videoBufferLength = parseFloat(videoBufferLength.toFixed(2));

      player.setUiza({
        buffered: `${videoBufferLength} s`,
      });
    });

    // Listen fragment buffered
    player.on(events.FRAG_BUFFERED, event => {
      const { detail: { stats = undefined } = {} } = event || {};

      if (stats) {
        // The latency for the last requested segment. Latency is the time from request of segment to receipt of first byte
        const videoLatency = Math.round(stats.tfirst - stats.trequest);
        // The download time for the last requested segment from first byte being received to the last byte (ignoring latency)
        const videoDownloadTime = Math.round(stats.tload - stats.tfirst);
        // The measured client throughput from the last segment downloaded (ignoring latency)
        const videoBandwidth = Math.round((8 * stats.total) / (stats.tbuffered - stats.tfirst));

        player.setUiza({
          bandwidth: `${videoBandwidth} kbps`,
          download: `${videoDownloadTime} ms`,
          latency: `${videoLatency} ms`,
        });
      }
    });
  },
};

export default UzStats;
