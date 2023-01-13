import { configureStore } from '@reduxjs/toolkit';
import coinSlice from './coinSlice';
import uiSlice from './uiSlice';

export default configureStore({
  reducer: {
    ui: uiSlice,
    coin: coinSlice
  },
})