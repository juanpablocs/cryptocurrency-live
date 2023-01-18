import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { binanceService } from '../services/binance.service';
import { Chart, enrichDataSeriesWithDefaultOptions, getCrosshairConfig } from './Chart';

export const AreaChart = () => {
  const chartRef = React.createRef();
  const [loading, setLoading] = useState(false);
  const currentSymbol = useSelector((state) => state.coin.currentSymbol);
  const windowSize = useSelector((state) => state.ui.windowSize);


  useEffect(() => {
    // setLoading(true);
    binanceService
      .getInitialDataChart(currentSymbol, windowSize)
      .then((data) => {
        // setInit(true)
        console.log({ data })

        const chart = chartRef.current?.chart;
        console.log({ chart })
        if (chart) {
          chart.update({
            series: [
              enrichDataSeriesWithDefaultOptions({ data }),
            ],
            ...getCrosshairConfig(),
          }, true, true, true);
        }

      }).finally(() => {
        // setLoading(false);
      });
  }, [currentSymbol, windowSize]);

  return (
    <div className="area__chart">
      <Chart ref={chartRef} title={currentSymbol} />
      {loading && <div className='area__chart__loading'>loading</div>}
    </div>
  )
}
