import React from 'react'
import { Chart } from './Chart';
import { IoIosHeartEmpty, IoIosHeart, IoIosEyeOff, IoIosEye } from 'react-icons/io';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import btcIcon from 'cryptocurrency-icons/svg/color/btc.svg';

export const AreaInfo = () => {
  return (
    <>
      <div className='area__top'>
        <div>
          <img src={btcIcon} width={18} />
          <h1>Bitcoin</h1>
          <small>BTC</small>
        </div>
        <div>
          <span className='btn btn--active'><AiFillPushpin /></span>
          <span className='btn'><IoIosHeartEmpty /></span>
        </div>
      </div>
      <div className="area__price">
        <h2>$18,232.22 <small>USD</small></h2>
        <p>icon $200.22 (2.4%)</p>
      </div>
      <div className="area__chart">
        <Chart />
      </div>
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
          <p>Volume (24h)</p>
          <div><strong>$785.5k</strong> <small>USD</small></div>
        </div>
        {/* <div className="card-stat">
          <p>All-time hight</p>
          <div><strong>$58.5K</strong> <small>USD</small></div>
        </div> */}
      </div>
    </>
  )
}
