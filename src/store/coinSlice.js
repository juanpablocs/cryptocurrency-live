import { createSlice } from '@reduxjs/toolkit';
import { SYMBOL_DEFAULT } from '../constants';

export const coinSlice = createSlice({
  name: 'coin',
  initialState: {
    currentSymbol: SYMBOL_DEFAULT,
    currentPrice: 0,
    initialPrice: 0,
  },
  reducers: {
    setCurrentPrice: (state, action) => {
      state.currentPrice = action.payload
    },
    setCurrentSymbol: (state, action) => {
      state.currentSymbol = action.payload
    },
    setInitialPrice: (state, action) => {
      state.initialPrice = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentPrice, setCurrentSymbol, setInitialPrice } = coinSlice.actions

export default coinSlice.reducer