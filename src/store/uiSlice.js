import { createSlice } from '@reduxjs/toolkit';
import { SYMBOL_DEFAULT } from '../constants';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    pinnedSymbol: SYMBOL_DEFAULT,
    windowSize: '1h',
    loading: false,
    favorites: []
  },
  reducers: {
    setPinSymbol: (state, action) => {
      state.pinnedSymbol = action.payload;
      chrome.storage?.local?.set({ pinSymbol: action.payload, currentSymbol: action.payload });
    },
    setFavorite: (state, action) => {
      state.favorites = [...state.favorites, action.payload];
    },
    setWindowSize: (state, action) => {
      state.windowSize = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPinSymbol, setFavorite, setWindowSize, setLoading } = uiSlice.actions

export default uiSlice.reducer