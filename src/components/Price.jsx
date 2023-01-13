import React, { useEffect, useMemo, useRef } from 'react'
import { priceFormat } from '../utils';

export const Price = ({ value: currentPrice, defaultValue, initial: initialPrice }) => {

  const prevPrice = useRef();
  const finalPrice = currentPrice || prevPrice.current || defaultValue;
  const percentageDiff = useMemo(() => {
    return ((finalPrice - initialPrice) / initialPrice) * 100;
  }, [finalPrice, initialPrice]);

  useEffect(() => {
    prevPrice.current = currentPrice;
  }, [currentPrice]);

  return (
    <div className='price-percentage'>
      <p>{priceFormat.format(finalPrice)}</p>
      <small className={percentageDiff > 0 ? 'color-green' : 'color-red'}>{percentageDiff.toFixed(2)}%</small>
    </div>
  )
}
