import React from 'react'
import { Chart } from './Chart';
import { AreaPrice } from './AreaPrice';
import { AreaInfoTop } from './AreaInfoTop';
import { AreaBottom } from './AreaBottom';

export const AreaInfo = () => {

  return (
    <>
      <AreaInfoTop />
      <AreaPrice />
      <div className="area__chart">
        <Chart />
      </div>
      <AreaBottom />
    </>
  )
}
