const API_BASE = 'https://api.binance.com';
const defaultCoin = 'BTCUSDT';
const createAlarm = () => chrome.alarms.create('xxx', { periodInMinutes: 1 / 60 });
const deleteAlarm = () => chrome.alarms.clear('xxx');
let _popupActive = false;

self.addEventListener('install', async (event) => {
  console.log('====install', event);
  createAlarm();
});

chrome.runtime.onMessage.addListener((message) => {
  const o = JSON.parse(message);
  if (o.currentSymbol) {
    setIcon(o.currentSymbol);
  }
  if (o.price >= 0) {
    setPrice(o.price);
  }
});

chrome.alarms.onAlarm.addListener(async () => {
  const { popup } = await chrome.storage.local.get(["popup"]);
  if (popup === 'VISIBLE') {
    return;
  }

  const res = await chrome.storage.local.get(["pinSymbol"]);
  const pinSymbol = res.pinSymbol ?? defaultCoin;
  const json = await fetch(`${API_BASE}/api/v3/ticker/price?symbol=${pinSymbol}`).then(res => res.json());
  setIcon(pinSymbol);
  setPrice(json.price);
});

function setIcon(symbol) {
  if (symbol) {
    chrome.action.setIcon({
      path: `img/coins/${symbol.toLowerCase().replace('usdt', '') || 'generic'}.png`
    });
  }
}

function setPrice(price) {
  chrome.action.setBadgeText({
    text: `${priceCompact(price)}`,
  });
}

function priceCompact(currentRate) {
  let rateString;
  if (currentRate > 1000) {
    rateString = (currentRate / 1000).toFixed(2).substring(0, 4) + 'k';
  } else if (currentRate > 100) {
    rateString = (Math.floor(currentRate * 10) / 10).toString();
  } else if (currentRate > 10) {
    rateString = (Math.floor(currentRate * 100) / 100).toString();
  } else if (currentRate > 1) {
    rateString = (Math.floor(currentRate * 1000) / 1000).toString();
  } else if (currentRate >= 0.01) {
    rateString = (Math.floor(currentRate * 10000) / 10000).toString().substring(2);
  } else {
    rateString = (Math.floor(currentRate * 10000) / 10000).toString().substring(2);
  }
  return rateString;
}