import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdSettings } from 'react-icons/io';
import { FiCoffee } from 'react-icons/fi';
import { setWindowSize } from './../store/uiSlice';

export const TopBar = () => {
  const dispatch = useDispatch();
  const windowSize = useSelector((state) => state.ui.windowSize);
  const windowSizes = ['1h', '1d', '7d'];

  const handlerClickSetting = () => {
    alert('wip');
  };

  return (
    <>
      <div className='top--left'>
        <span className='btn' onClick={handlerClickSetting}><IoMdSettings /></span>
        {/* <span className='btn'> <FiCoffee /> <span style={{ marginLeft: 5, position: 'relative', bottom: -0.5 }}>Donate coffe</span></span> */}

      </div>
      <ul>
        {windowSizes.map(size => (
          <li key={size} onClick={() => dispatch(setWindowSize(size))} className={`btn ${size === windowSize ? 'btn--active' : ''}`}>{size}</li>
        ))}
      </ul>
    </>
  )
}
