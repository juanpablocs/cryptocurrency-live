import React, { forwardRef } from 'react';
import { mergeDeepRight } from 'ramda';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import {
  crosshairLabelNumberFormatter,
  tooltipNumberFormatter,
  yAxisLabelNumberFormatter,
} from './../utils';

Highcharts.setOptions({
  time: {
    timezoneOffset: new Date().getTimezoneOffset()
  }
});

export const Chart = forwardRef(({ }, ref) => {
  const options = {
    title: {
      enabled: false,
    },
    chart: {
      spacingLeft: 0,
      spacingRight: 0,
      backgroundColor: 'transparent',
      height: null
    },

    credits: {
      enabled: false,
      text: '',
      href: '',
    },
    navigator: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
      formatter: function (tooltip) {
        // return [
        //   Highcharts.dateFormat('%e.%m.%Y %H:%M:%S', new Date(this.x)),
        //   `<b>${tooltipNumberFormatter.format(this.y)}</b>`
        // ];
        return `<b>${tooltipNumberFormatter.format(this.y)}</b>`;
      },
      useHTML: true,
    },
    xAxis: [{
      // crosshair: false,
      // ordinal: false,
      // endOnTick: true,
      // maxPadding: 0.25,
      // tickInterval: 15 * 1000, // 15 seconds
      gridLineColor: '',
      gridLineWidth: 1,
      lineColor: '#2e3748',
      tickColor: '#2e3748',
      labels: {
        style: {
          color: '#6f737e',
        },
      },
      // labels: {
      //   enabled: false
      // }
    }],
    yAxis: [{
      labels: {
        enabled: false
      },
      opposite: true,
      crosshair: false,
      showFirstLabel: false,
      showLastLabel: false,
      gridLineColor: '#2e3748',
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={options}
      containerProps={{ className: 'chartContainer' }}
      ref={ref}
    />
  )
});

export const dataSeriesDefaultOptions = {
  type: 'area',
  id: 'dataseries',
  lastPrice: {
    enabled: true,
    color: 'red',
  },
  // enableMouseTracking: false,
  dataGrouping: {
    enabled: true,
    forced: true,
    units: [
      ['second', [1]]
    ]
  },
  threshold: null,
  color: '#67b8f8',
  fillColor: {
    // https://api.highcharts.com/class-reference/Highcharts.GradientColorObject
    linearGradient: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1
    },
    stops: [
      [0, '#264769'],
      [1, Highcharts.Color('#264769').setOpacity(0).get('rgba')]
    ]
  },
  states: {
    hover: {
      lineWidthPlus: 0,
    },
  },
};

export function getCrosshairConfig() {
  return {
    xAxis: [{
      crosshair: {
        color: '#2f4e6d',
        snap: false,
        label: {
          enabled: true,
          shape: 'rect',
          backgroundColor: '#2f4e6d',
          formatter: function (value) {
            if (value) {
              return Highcharts.dateFormat('%e.%m.%Y %H:%M:%S', new Date(value));
            }
          },
        },
      },
    }],
    yAxis: [{
      crosshair: {
        color: '#2f4e6d',
        snap: false,
        label: {
          enabled: true,
          backgroundColor: '#2f4e6d',
          padding: 4,
          formatter: function (value) {
            if (value) {
              return crosshairLabelNumberFormatter.format(value);
            }
          },
        },
        zIndex: 4,
      },
    }],
  };
}

export function enrichDataSeriesWithDefaultOptions(series) {
  return mergeDeepRight(dataSeriesDefaultOptions, series);
}
