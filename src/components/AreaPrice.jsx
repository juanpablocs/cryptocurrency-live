import React from 'react';
import { BsArrowUpRight, BsArrowDownLeft } from 'react-icons/bs';

import { useSelector } from 'react-redux';
import { priceFormat } from '../utils';

export const AreaPrice = () => {
  const loading = useSelector(state => state.ui.loading);
  const { initialPrice, currentPrice } = useSelector((state) => state.coin);
  const percentageDiff = ((currentPrice - initialPrice) / initialPrice) * 100;
  return (
    <div className="area__price">
      {loading ? <p>loading...</p> : (
        <>
          <h2>{priceFormat(currentPrice)} <small>USD</small></h2>
          <p>{percentageDiff > 0 ? <BsArrowUpRight /> : <BsArrowDownLeft />} <span className={percentageDiff > 0 ? 'color-green' : 'color-red'}>${(currentPrice - initialPrice).toFixed(2)} ({percentageDiff.toFixed(2)}%)</span></p>
        </>
      )}
    </div>
  )
}
