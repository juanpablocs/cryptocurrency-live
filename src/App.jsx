import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { AreaInfo, TickerList, TopBar } from './components';
import { setCurrentSymbol } from './store/coinSlice';
import { setPinSymbol } from './store/uiSlice';

async function syncInitialStorage(handler) {
  const storage = await chrome.storage?.local?.get(["pinSymbol", "currentSymbol"]);

  if (storage?.pinSymbol) {
    handler(setPinSymbol(storage.pinSymbol));
  }
  if (storage?.currentSymbol) {
    handler(setCurrentSymbol(storage.currentSymbol));
  }
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    chrome.storage?.local?.set({ popup: 'VISIBLE' });
    syncInitialStorage(dispatch);
    document.addEventListener("visibilitychange", () => {
      chrome.storage?.local?.set({ popup: 'INVISIBLE' });
    });
  }, []);

  return (
    <div className="App">
      <div className="App__top">
        <TopBar />
      </div>
      <div className="App__area">
        <AreaInfo />
      </div>
      <div className="App__sidebar">
        <TickerList />
      </div>
    </div>
  )
}

export default App
