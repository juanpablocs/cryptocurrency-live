import React, { useEffect, useMemo, useRef } from 'react'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 4, // (causes 2500.99 to be printed as $2,501)
});

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
      <p>{formatter.format(finalPrice)}</p>
      <small className={percentageDiff > 0 ? 'color-green' : 'color-red'}>{percentageDiff.toFixed(2)}%</small>
    </div>
  )
}
