const config = {
  player: {
    debug: true,
    ratio: '16:9',
  },
  mux: {
    enable: false,
    data: {
      player_name: 'Uiza',
      video_title: 'Video test Uiza',

      env_key: 'agdpp48009jcsu0d0rleclldp',
      player_init_time: Date.now(),
    }
  },
  chart: {
    default: {
      credits: false,
      chart: {
        type: 'line',
        zoomType: 'x',
        marginRight: 10,
      },
      time: {
        useUTC: false,
        timezoneOffset: (new Date()).getTimezoneOffset(),
      },
      title: {
        text: 'Metrics chart'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
      },
      yAxis: {
        title: {
          text: 'Value',
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080',
        }]
      },
    },
    theme: {
      dark: {
        chart: {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
              [0, '#2a2a2b'],
              [1, '#3e3e40'],
            ]
          },
          style: {
            fontFamily: '\'Unica One\', sans-serif',
          },
          plotBorderColor: '#606063',
        },
        title: {
          style: {
            color: '#E0E0E3',
          }
        },
        xAxis: {
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3',
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          title: {
            style: {
              color: '#A0A0A3',
            }
          }
        },
        yAxis: {
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3',
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          title: {
            style: {
              color: '#A0A0A3',
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: {
            color: '#F0F0F0',
          }
        },
        plotOptions: {
          series: {
            dataLabels: {
              color: '#F0F0F3',
            },
            marker: {
              lineColor: '#333',
            }
          },
          boxplot: {
            fillColor: '#505053',
          },
          candlestick: {
            lineColor: 'white',
          },
          errorbar: {
            color: 'white',
          }
        },
        legend: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          itemStyle: {
            color: '#E0E0E3',
          },
          itemHoverStyle: {
            color: '#FFF',
          },
          itemHiddenStyle: {
            color: '#606063',
          },
          title: {
            style: {
              color: '#C0C0C0',
            }
          }
        },
        labels: {
          style: {
            color: '#707073',
          }
        },
        drilldown: {
          activeAxisLabelStyle: {
            color: '#F0F0F3',
          },
          activeDataLabelStyle: {
            color: '#F0F0F3',
          }
        },
        navigation: {
          buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
              fill: '#505053',
            }
          }
        },
      },
      light: {},
    },
    series: {
      bandwidth: {
        name: 'Bandwidth',
        tooltip: '',
        unit: ' kbps',
        visible: true,
      },
      bitrate: {
        name: 'Bitrate',
        tooltip: '',
        unit: ' kbps',
        visible: false,
      },
      buffered: {
        name: 'Buffered',
        tooltip: '',
        unit: ' s',
        visible: false,
      },
      dropped: {
        name: 'Dropped',
        tooltip: '',
        unit: '',
        visible: false,
      },
      download: {
        name: 'Download',
        tooltip: '',
        unit: ' ms',
        visible: false,
      },
      latency: {
        name: 'Latency',
        tooltip: '',
        unit: ' ms',
        visible: false,
      },
    },
  }
};

export default config;
