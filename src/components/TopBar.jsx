import React from 'react'
import { IoMdSettings } from 'react-icons/io';
import { FiCoffee } from 'react-icons/fi';
export const TopBar = () => {
  return (
    <>
      <div className='top--left'>
        <span className='btn'><IoMdSettings /></span>
        <span className='btn'> <FiCoffee /> <span style={{ marginLeft: 5, position: 'relative', bottom: -0.5 }}>Donate coffe</span></span>

      </div>
      <ul>
        <li className='btn btn--active'>1h</li>
        <li className='btn'>1d</li>
        <li className='btn'>7d</li>
      </ul>
    </>
  )
}
