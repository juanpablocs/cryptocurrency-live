import React from 'react';
import { useSelector } from 'react-redux';
import { priceCompact } from '../utils';

export const AreaBottom = () => {
  const volume = useSelector((state) => state.coin.volume);
  const windowSize = useSelector((state) => state.ui.windowSize);
  return (
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
        <p>Volume ({windowSize})</p>
        <div><strong>{priceCompact(volume)}</strong> <small>USD</small></div>
      </div>
      {/* <div className="card-stat">
          <p>All-time hight</p>
          <div><strong>$58.5K</strong> <small>USD</small></div>
        </div> */}
    </div>
  )
}
