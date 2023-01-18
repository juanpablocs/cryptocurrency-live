import React from 'react'

import { AreaPrice } from './AreaPrice';
import { AreaInfoTop } from './AreaInfoTop';
import { AreaBottom } from './AreaBottom';
import { AreaChart } from './AreaChart';

export const AreaInfo = () => {

  return (
    <>
      <AreaInfoTop />
      <AreaPrice />
      <AreaChart />
      <AreaBottom />
    </>
  )
}
