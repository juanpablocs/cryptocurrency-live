import React from 'react'
import { SymbolPairTitle } from '../constants';
import useExchange from './../hooks/useExchange';
import { Price } from './Price';

export const TickerList = () => {
  const { data, currentPrices } = useExchange();
  console.log({ data })
  return (
    <div>
      <ul className='list-ticker'>
        {data.map((item, k) => (
          <li key={k} className={k === 0 ? 'active' : ''}>
            <div className='ticker-name'>
              <p>{SymbolPairTitle[item.symbol].full}</p>
              <small>{SymbolPairTitle[item.symbol].short}</small>
            </div>
            <Price value={currentPrices[item.symbol]} defaultValue={item.lastPrice} initial={item.openPrice} />
          </li>
        ))}
      </ul>
    </div>
  )
}
