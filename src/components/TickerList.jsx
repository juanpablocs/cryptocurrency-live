import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SymbolPairTitle } from '../constants';
import { setCurrentPrice, setCurrentSymbol, setInitialPrice } from '../store/coinSlice';
import useExchange from './../hooks/useExchange';
import { Price } from './Price';

export const TickerList = () => {
  const windowSize = useSelector((state) => state.ui.windowSize);
  const currentSymbol = useSelector((state) => state.coin.currentSymbol);
  const { data, currentPrices } = useExchange(windowSize, currentSymbol);
  const dispatch = useDispatch();

  const handlerClick = (symbol) => {
    dispatch(setCurrentSymbol(symbol));
  };

  useEffect(() => {
    if (currentPrices[currentSymbol]) {
      dispatch(setCurrentPrice(currentPrices[currentSymbol]))
    }
  }, [currentPrices, currentSymbol])

  return (
    <div>
      <ul className='list-ticker'>
        {data.map((item, k) => (
          <li onClick={() => handlerClick(item.symbol)} key={k} className={currentSymbol === item.symbol ? 'active' : ''}>
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
