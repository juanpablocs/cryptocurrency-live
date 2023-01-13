import React from 'react'
import { Chart } from './Chart';
import { AreaPrice } from './AreaPrice';
import { AreaInfoTop } from './AreaInfoTop';

export const AreaInfo = () => {

  return (
    <>
      <AreaInfoTop />
      <AreaPrice />
      <div className="area__chart">
        <Chart />
      </div>
      <div className="area__bottom">
        <div className="card-stat">
          <p>Market cap</p>
          <div><strong>$1.34M</strong> <small>USD</small></div>
        </div>
        <div className="card-stat">
          <p>Circulating supply</p>
          <div><strong>$1.34M</strong> <small>BTC</small></div>
        </div>
        <div className="card-stat">
          <p>Volume (24h)</p>
          <div><strong>$785.5k</strong> <small>USD</small></div>
        </div>
        {/* <div className="card-stat">
          <p>All-time hight</p>
          <div><strong>$58.5K</strong> <small>USD</small></div>
        </div> */}
      </div>
    </>
  )
}
