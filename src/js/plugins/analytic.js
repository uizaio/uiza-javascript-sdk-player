/* eslint-disable camelcase */
/* eslint-disable no-console */
import listEvents from '../events';
import is from '../utils/is';
import loadScript from '../utils/load-script';

// Replace by gulp build, read from environment.json
const urlAnalytic = '__API_ANALYTIC_POST__';
const urlTotalviewer = '__API_ANALYTIC_GET__';

// simple uuidv4
const uuidv4 = () => {
  let x = new Date().getTime();
  let e = (performance && performance.now && 1e3 * performance.now()) || 0;
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, r => {
    let o = 16 * Math.random();
    return (
      x > 0 ? ((o = (x + o) % 16 | 0), (x = Math.floor(x / 16))) : ((o = (e + o) % 16 | 0), (e = Math.floor(e / 16))),
      (r === 'x' ? o : (3 & o) | 8).toString(16)
    );
  });
};

const timeout = (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
};

const postEvent = (event = '', type = 'ccuevent', entity = {}) => {
  if (event) {
    const dt = new Date();
    const viewer_session_id = sessionStorage.getItem('uiza-viewer_session_id');
    const viewer_user_id = localStorage.getItem('uiza-viewer_user_id');
    const { entity_id, entity_source, app_id } = entity;
    const bodyPost = {
      specversion: '1.0',
      source: 'UZData/WebSDK/1.1.0',
      type: `io.uiza.${type}`,
      time: dt,
      data: {
        event,
        viewer_user_id,
        viewer_session_id,
        entity_id,
        entity_source,
        app_id,
        timestamp: dt,
      },
    };

    const param = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        // TODO:  Brian HN  anh nhớ thêm `Content-Encoding: gzip` và Content-Type:application/gzip giúp em nhanh nhé
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(bodyPost),
    };
    try {
      timeout(5000, fetch(urlAnalytic, param))
        .then(() => {
          // TODO for missing event
          // if (res.status === 200){
          //   sessionStorage.removeItem(`uiza-analytic`);
          // }
        })
        .catch(err => console.log(err));
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
};

const addTracking = (data, entity) => {
  // TODO for missing event
  // const uizaAnalytic = sessionStorage.getItem(`uiza-analytic`) || [];
  // const dt = new Date();
  // uizaAnalytic.push({ timestamp: dt, event: data });
  // postEvent(uizaAnalytic, 'ccuevent', entity);
  const { app_id, entity_id } = entity;
  if (app_id && entity_id) {
    switch (data) {
      case 'watching':
        postEvent(data, 'watchingevent', entity);
        break;
      case 'view':
        postEvent(data, 'viewevent', entity);
        break;
      default:
        postEvent(data, 'ccuevent', entity);
        break;
    }
  }
};

const initFinger = () => {
  // Require fingerprint2 for uiza-player analytic
  window.Fingerprint2.get(components => {
    const values = components.map(component => component.value);
    // eslint-disable-next-line no-undef
    const fingerHash = window.Fingerprint2.x64hash128(values.join(''), 31);
    localStorage.setItem('uiza-viewer_user_id', fingerHash);
  });
};

const initSessionId = () => {
  let sessionId = sessionStorage.getItem('uiza-viewer_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(`uiza-viewer_session_id`, sessionId);
  }
};

const playUrlInfo = url => {
  const info = url.split('?cm=')[1] || '';
  let appInfo;
  try {
    appInfo = JSON.parse(atob(info));
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return appInfo || {};
};

const UZAnalytic = {
  setup() {
    if (!is.function(window.Fingerprint2)) {
      loadScript(this.config.urls.fingerprintjs2.sdk)
        .then(() => {
          UZAnalytic.ready.call(this);
        })
        .catch(error => {
          this.debug.warn('Fingerprint2 failed to load', error);
        });
    } else {
      UZAnalytic.ready.call(this);
    }
  },

  ready() {
    const player = this;
    const playerEvents = [...player.config.events, 'fullscreenchange'];
    initFinger();
    initSessionId();

    const entity = playUrlInfo(player.config.src);
    player.setUiza({ ...entity, live_ended: false, viewed: false });

    // 'watching': the user is watching live, and this information is sent every 5 seconds.
    const checkLiveEnded = () => {
      setInterval(() => {
        const now = (new Date().getTime() / 1000).toFixed(0);
        const lastUpdateDuration = sessionStorage.getItem('uiza-last_update_duration');
        this.uiza.live_ended = lastUpdateDuration && Number(now) - Number(lastUpdateDuration) > 30;
      }, 500);
    };

    // 'watching': the user is watching live, and this information is sent every 5 seconds.
    const playingEvent = () => {
      setInterval(() => {
        if (player.playing && !this.uiza.live_ended) {
          addTracking('watching', entity);
        }
      }, 5000);
    };

    // 'view': the event that occurs when watching a video or live for 5s (only sent once in a play session).
    const viewEvent = () => {
      (time =>
        setTimeout(() => {
          if (player.playing && !this.uiza.viewed) {
            this.uiza.viewed = true;
            addTracking('view', entity);
          }
        }, time))(5000);
    };

    // GET total viewer is watching live, and this information is sent every 5 seconds.

    const getLiveViewers = () => {
      setInterval(() => {
        try {
          const { app_id, entity_id } = entity;
          if (app_id && entity_id) {
            const params = { app_id, entity_id };
            const queryString = Object.keys(params)
              .map(key => `${key}=${params[key]}`)
              .join('&');

            if (app_id && entity_id && queryString && !this.uiza.live_ended) {
              try {
                fetch(`${urlTotalviewer}?${queryString}`)
                  .then(res => res.json())
                  .then(data => {
                    const { views } = data;
                    player.setUiza({ analytic_total_views: views });
                  });
                // eslint-disable-next-line no-empty
              } catch (e) {}
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }, 5000);
    };

    const triggEvents = () => {
      player.on(playerEvents.join(' '), e => {
        switch (e.type) {
          case listEvents.PLAYING:
            viewEvent();
            break;
          case listEvents.ENDED:
            break;
          default:
            break;
        }
      });
    };

    checkLiveEnded();
    getLiveViewers();
    playingEvent();
    triggEvents();
  },
};

export default UZAnalytic;
