import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SymbolPairTitle } from '../constants';
import { IoIosHeartEmpty, IoIosHeart, IoIosEyeOff, IoIosEye } from 'react-icons/io';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import { setPinSymbol } from '../store/uiSlice';

export const AreaInfoTop = () => {
  const currentSymbol = useSelector((state) => state.coin.currentSymbol);
  const currentPin = useSelector((state) => state.ui.pinnedSymbol);

  const dispatch = useDispatch();
  const title = SymbolPairTitle[currentSymbol];
  const code = (title?.short ?? 'generic').toLowerCase();
  const img = `/img/coins/${code}.png`;

  const handlerClickPin = () => {
    dispatch(setPinSymbol(currentSymbol));
  };

  const handlerClickFavorite = () => {
    alert('implement me');
  }

  return (
    <div className='area__top'>
      <div>
        <img src={img} width={18} />
        <h1>{title?.full}</h1>
        <small>{title?.short}</small>
      </div>
      <div>
        <span onClick={handlerClickPin} className={`btn ${currentPin === currentSymbol ? 'btn--active' : ''}`}>{currentPin === currentSymbol ? <AiFillPushpin /> : <AiOutlinePushpin />}</span>
        <span onClick={handlerClickFavorite} className='btn'><IoIosHeartEmpty /></span>
      </div>
    </div>
  )
}
