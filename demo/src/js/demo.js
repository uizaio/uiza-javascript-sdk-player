import config from './config';
import is from '../../../src/js/utils/is';
import sources from './sources';

import { extend } from '../../../src/js/utils/objects';
import { setAttributes } from '../../../src/js/utils/elements';

const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;

const updateMetrics = (metrics) => {
  extend(window.metrics, metrics);

  for (let m in metrics) {
    if (m in config.chart.series) {
      window.chart.series.find(x => x.name.toLowerCase() === m)
        .addPoint([new Date().getTime(), metrics[m]], true, false);
    }
  }
};

const logStatus = (status) => {
  const log = status + '\n';
  document.querySelector('#status').innerHTML += log;
};

const initPlayer = () => {
  const sourceURI = document.querySelector('#inputlink').value;
  if (sourceURI.indexOf('.m3u8') === -1) {
    document.querySelector('#status').style.display = 'none';
    return null;
  }

  let video = document.createElement('video');
  setAttributes(video, {
    'autoplay': 'autoplay',
    'controls': 'controls',
    'crossorigin': 'crossorigin',
    'data-uiza-provider': 'hlsjs',
    'id': 'player',
    'muted': 'muted',
    'playsinline': 'playsinline',
  });
  document.querySelector('.container').appendChild(video);

  let playerConfig = extend(config.player, {
    src: sourceURI,
  });

  const source = sources.find(x => x.src === sourceURI);
  if (source) {
    if (source.preview) {
      extend(playerConfig, {
        previewThumbnails: {
          enabled: true,
          src: source.preview,
        },
      });
    }
    if (source.poster) {
      extend(playerConfig, {
        poster: source.poster,
      });
    }
  }

  // Update player init time for Mux analytics
  window.muxData = {};
  if (config.mux && config.mux.enable) {
    extend(muxData, config.mux.data);
    muxData.player_init_time = window.playerInitTime = Date.now();
  }

  let player = new Uiza(video, playerConfig);

  if (typeof mux !== 'undefined' && config.mux && config.mux.enable) {
  	mux.monitor('#player', {
  		debug: false,

  		data: muxData,
  	});
  }
  return player;
};

const registerListener = (player) => {
  // Log events to status block
  const statusEvents = [
    Uiza.events.READY,
    Uiza.events.ERROR,

    Uiza.events.MANIFEST_LOADED,
    Uiza.events.LEVEL_LOADED,
    Uiza.events.QUALITY_CHANGE,

    Uiza.events.LANGUAGE_CHANGE,
    Uiza.events.CAPTIONS_ENABLED,
    Uiza.events.CAPTION_DISABLED,

    Uiza.events.ENTER_PIP,
    Uiza.events.EXIT_PIP,

    Uiza.events.ENTER_FULLSCREEN,
    Uiza.events.EXIT_FULLSCREEN,

    Uiza.events.LOAD_START,
    Uiza.events.LOADED_DATA,
    Uiza.events.LOADED_META_DATA,
    Uiza.events.RATE_CHANGE,
    Uiza.events.PAUSE,
    Uiza.events.PLAY,
    Uiza.events.PLAYING,
    Uiza.events.SEEKED,
    Uiza.events.SEEKING,
    Uiza.events.WAITING,
    Uiza.events.ENDED,
  ];
  player.on(statusEvents.join(' '), (event) => {
    logStatus('events: ' + event.type);
  });

  // Resize status block
  player.on(`${Uiza.events.READY} ${Uiza.events.LOADED_META_DATA}`, (event) => {
    document.querySelector('#status').style.height = `${player.elements.container.clientHeight}px`;
  });

  // Listen frame drop
  player.on(Uiza.events.FPS_DROP, (event) => {
    const {
      detail: data = undefined,
    } = event || {};

    if (data) {
      const currentDropped = data.currentDropped;
      updateMetrics({
        dropped: currentDropped,
      });
    }
  });

  // Listen level switched
  player.on(Uiza.events.LEVEL_SWITCHED, (event) => {
    const {
      detail: {
        level: level = -1,
      } = {},
    } = event || {};

    if (level > -1) {
      const videoBitrate = Math.round(player.hls.levels[level].bitrate / 1000);
      updateMetrics({
        bitrate: videoBitrate,
      });
    }
  });

  // Listen progress to get buffered
  player.on(Uiza.events.PROGRESS, (event) => {
    let videoBufferLength = 0;
    let buffered = player.media.buffered;
    let currentTime = player.currentTime;
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
        videoBufferLength = player.media.buffered.end(i) - currentTime;
      }
    }
    // The duration of the forward buffer
    videoBufferLength = parseFloat(videoBufferLength.toFixed(2));

    updateMetrics({
      buffered: videoBufferLength,
    });
  });

  // Listen fragment buffered
  player.on(Uiza.events.FRAG_BUFFERED, (event) => {
    const {
      detail: {
        stats: stats = undefined,
      } = {},
    } = event || {};

    if (stats) {
      // The latency for the last requested segment. Latency is the time from request of segment to receipt of first byte
      const videoLatency = Math.round(stats.tfirst - stats.trequest);
      // The download time for the last requested segment from first byte being received to the last byte (ignoring latency)
      const videoDownloadTime = Math.round(stats.tload - stats.tfirst);
      // The measured client throughput from the last segment downloaded (ignoring latency)
      const videoBandwidth = Math.round(8 * stats.total / (stats.tbuffered - stats.tfirst));

      updateMetrics({
        bandwidth: videoBandwidth,
        download: videoDownloadTime,
        latency: videoLatency,
      });
    }
  });
}

const destroyPlayer = () => {
  try {
    if (!is.empty(window.player) && !is.empty(window.player.hls)) {
      window.player.hls.destroy();
    }
    if (document.querySelector('.uiza')) {
      document.querySelector('.uiza').remove();
    }
  } catch (e) { console.error(e); }
};

const initChart = () => {
  // Theme dark or light
  const theme = darkMode ? config.chart.theme.dark : config.chart.theme.light;

  // Get config of series from localStorage
  if (localStorage.series) {
    try {
      config.chart.series = extend(config.chart.series, JSON.parse(localStorage.series));
    } catch (e) { console.error(e); }
  } else {
    localStorage.series = JSON.stringify(config.chart.series);
  }

  // Generate highchart series from config
  let series = [];
  for (let s in config.chart.series) {
    series.push(extend(config.chart.series[s], {
      events: {
        // Update new config to localStorage
        show: function () {
          config.chart.series[this.name.toLowerCase()].visible = true;
          localStorage.series = JSON.stringify(config.chart.series);
        },
        hide: function () {
          config.chart.series[this.name.toLowerCase()].visible = false;
          localStorage.series = JSON.stringify(config.chart.series);
        },
      },
    }));
  };

  let configHighchart = extend(config.chart.default, theme, {
    chart: {
      events: {
        load: function () {
          window.chart = this;
        },
      },
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormatter: function () {
        const unit = config.chart.series[this.series.name.toLowerCase()] ?
          config.chart.series[this.series.name.toLowerCase()].unit : '';

        return `${this.series.chart.time.dateFormat('%Y-%m-%d %H:%M:%S.%L', this.x)}<br/>` +
          `${Highcharts.numberFormat(this.y, -1, '.', ',')}${unit}`;
      },
    },
    series: series
  });

  Highcharts.chart('chart', extend(configHighchart, theme));
};


window.onSelectLinkChange = () => {
  document.querySelector('#inputlink').value = document.querySelector('#selectlink').value;
  if ('createEvent' in document) {
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', false, true);
    document.querySelector('#inputlink').dispatchEvent(evt);
  } else {
    document.querySelector('#inputlink').fireEvent('oninput');
  }
};

window.onInputLinkChange = () => {
  // Destroy old player
  destroyPlayer();

  // Reset metrics
  window.metrics = {};

  // Reset status
  document.querySelector('#status').style.display = 'block';
  document.querySelector('#status').innerHTML = '';


  // Init new player
  window.player = initPlayer();
  if (player) {
    registerListener(player);
  }

  initChart();
};

(() => {
  let selectLink = document.querySelector('#selectlink');
  for (let i = sources.length - 1; i >= 0; i--) {
    let option = document.createElement('option');
    option.setAttribute('value', sources[i].src);
    option.innerHTML = sources[i].title;
    selectLink.appendChild(option);
  }
})();