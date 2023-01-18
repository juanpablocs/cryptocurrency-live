import axios from 'axios';
import { EventEmitter } from 'events';
import { SymbolPair } from '../constants';

const INTERVAL = '1m';
const WS_BASE = 'wss://stream.binance.com:9443';
const API_BASE = 'https://api.binance.com';
const SYMBOL_PLACEHOLDER = '<symbol>';
const STREAM_CANDLESTICK_PATH = `/stream?streams=${SYMBOL_PLACEHOLDER}@kline_${INTERVAL}`;
const STREAM_MINI_TICKER_PATH = `/stream?streams=!miniTicker@arr`;

const apiMethod = {
  // public methods
  'ping': { 'url': '/api/v1/ping', 'method': 'GET' },
  'time': { 'url': '/api/v1/time', 'method': 'GET' },
  'exchangeInfo': { 'url': '/api/v1/exchangeInfo', 'method': 'GET' },
  'depth': { 'url': '/api/v1/depth', 'method': 'GET' },
  'trades': { 'url': '/api/v1/trades', 'method': 'GET' },
  'historicalTrades': { 'url': '/api/v1/historicalTrades', 'method': 'GET' },
  'aggTrades': { 'url': '/api/v3/aggTrades', 'method': 'GET' },
  'klines': { 'url': '/api/v3/klines', 'method': 'GET' },
  'ticker24hr': { 'url': '/api/v1/ticker/24hr', 'method': 'GET' },
  'tickerPrice': { 'url': '/api/v3/ticker/price', 'method': 'GET' },
  'ticker': { 'url': '/api/v3/ticker', 'method': 'GET' },
  'tickerBookTicker': { 'url': '/api/v3/ticker/bookTicker', 'method': 'GET' },
};

const WebSocketEvent = {
  OPEN: 'open',
  MESSAGE: 'message',
  ERROR: 'error',
  CLOSE: 'close',
};

const BinanceServiceEvent = {
  MESSAGE: 'message',
  ERROR: 'error',
  CLOSE: 'close',
  RECONNECT: 'reconnect',
  RECONNECTING: 'reconnecting',
};

const AUTO_RECONNECT_INTERVAL = 5 * 1000; // ms

class BinanceService extends EventEmitter {
  connection;
  url;

  getWsBase() {
    return `${WS_BASE}`;
  }

  getApiBase() {
    return API_BASE;
  }

  getStreamCandlestickUrl(symbol) {
    return `${this.getWsBase()}${STREAM_CANDLESTICK_PATH.replace(SYMBOL_PLACEHOLDER, symbol.toLowerCase())}`;
  }

  getStreamMiniTickerUrl() {
    return `${this.getWsBase()}${STREAM_MINI_TICKER_PATH}`;
  }

  getApiCandlestickUrl(symbol, windowSize) {
    const endTime = Date.now();
    const hours = {};
    hours['1h'] = 1;
    hours['1d'] = 24;
    hours['7d'] = 24 * 7;

    const interval = {};
    interval['1h'] = '1m';
    interval['1d'] = '1h';
    interval['7d'] = '2h';

    const startTime = endTime - ((hours[windowSize] || 1) * 60 * 60 * 1000);
    console.log('startTime', new Date(startTime));
    console.log('endTime', new Date(endTime));
    return `${this.getApiBase()}${apiMethod.klines.url}?symbol=${symbol}&interval=${interval[windowSize] || '1h'}&limit=100&startTime=${startTime}&endTime=${endTime}`;
  }

  getApiKlinesUrl(symbol) {
    return `${this.getApiBase()}${apiMethod.klines.url}?symbol=${symbol}&limit=1000&startTime=${startTime}`;
  }

  getApiTickerUrl(symbols, windowSize = '1h') {
    return `${this.getApiBase()}${apiMethod.ticker.url}?symbols=${JSON.stringify(symbols)}&windowSize=${windowSize}`;
  }

  connectToStream() {
    this.url = this.getStreamMiniTickerUrl();
    this.open(this.url);
  }

  open() {
    this.connection = new WebSocket(this.url);
    this.connection.addEventListener(WebSocketEvent.OPEN, this.handleStreamOpen);
    this.connection.addEventListener(WebSocketEvent.MESSAGE, this.handleStreamMessage);
    this.connection.addEventListener(WebSocketEvent.ERROR, this.handleStreamError);
    this.connection.addEventListener(WebSocketEvent.CLOSE, this.handleStreamClose);

    // test reconnection
    // setTimeout(() => {this.connection.close()}, 5000);
  }

  removeAllWebSocketListeners() {
    if (this.connection) {
      this.connection.removeEventListener(WebSocketEvent.OPEN, this.handleStreamOpen);
      this.connection.removeEventListener(WebSocketEvent.MESSAGE, this.handleStreamMessage);
      this.connection.removeEventListener(WebSocketEvent.ERROR, this.handleStreamError);
      this.connection.removeEventListener(WebSocketEvent.CLOSE, this.handleStreamClose);
    }
  }

  handleStreamOpen = (event) => {
    console.log('BinanceService: connected');
  };

  handleStreamMessage = (event) => {
    const msg = JSON.parse(event.data);
    this.emit(BinanceServiceEvent.MESSAGE, this.streamMiniTickerMapper(msg.data));
  };

  handleStreamError = (event) => {
    console.error('BinanceService: error', event);
    this.emit(BinanceServiceEvent.ERROR);
    // todo: 'ECONNREFUSED' -> reconnect
    // switch (e.code){
    //   case 'ECONNREFUSED':
    //     this.reconnect(e);
    //     break;
    //   default:
    //     this.onerror(e);
    //     break;
    // }
  };

  handleStreamClose = (event) => {
    console.log('BinanceService: closed', event);
    this.emit(BinanceServiceEvent.CLOSE);
    this.reconnect();
  };

  // https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect
  reconnect() {
    console.log(`BinanceService: retry in ${AUTO_RECONNECT_INTERVAL}ms`);
    this.emit(BinanceServiceEvent.RECONNECT);
    this.removeAllWebSocketListeners();
    setTimeout(() => {
      console.log('BinanceService: reconnecting...');
      this.emit(BinanceServiceEvent.RECONNECTING);
      this.open();
    }, AUTO_RECONNECT_INTERVAL);
  }

  streamMiniTickerMapper(tickers = []) {
    return tickers.reduce((acc, curr) => {
      const closePrice = parseFloat(curr.c);
      acc[curr.s] = closePrice;
      return acc;
    }, {})
  }

  apiCandlestickMapper(candlestick) {
    // [
    //   1499040000000,      // Open time
    //   "0.01634790",       // Open
    //   "0.80000000",       // High
    //   "0.01575800",       // Low
    //   "0.01577100",       // Close
    //   "148976.11427815",  // Volume
    //   1499644799999,      // Close time
    //   "2434.19055334",    // Quote asset volume
    //   308,                // Number of trades
    //   "1756.87402397",    // Taker buy base asset volume
    //   "28.46694368",      // Taker buy quote asset volume
    //   "17928899.62484339" // Ignore.
    // ]
    const closeTime = candlestick[6];
    // todo: check that parseFloat gets accurate number as for currency.
    const closePrice = parseFloat(candlestick[4]);
    return {
      x: closeTime,
      y: closePrice,
    };
  }

  async getInitialData(windowSize) {
    const response = await axios.get(this.getApiTickerUrl(Object.keys(SymbolPair), windowSize));
    return response.data;
  }

  async getInitialDataChart(symbol, windowSize) {
    const response = await axios.get(this.getApiCandlestickUrl(symbol, windowSize));
    return response.data?.map(this.apiCandlestickMapper) || [];
  }

}

const binanceService = new BinanceService();

export {
  BinanceServiceEvent,
  binanceService,
}