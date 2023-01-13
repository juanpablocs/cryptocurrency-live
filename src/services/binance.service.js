import axios from 'axios';
import { EventEmitter } from 'events';

const INTERVAL = '1000m';
const WS_BASE = 'wss://stream.binance.com:9443';
const API_BASE = 'https://api.binance.com';
const SYMBOL_DEFAULT = 'BTCUSDT';
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
  'aggTrades': { 'url': '/api/v1/aggTrades', 'method': 'GET' },
  'klines': { 'url': '/api/v1/klines', 'method': 'GET' },
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

  getApiCandlestickUrl(symbol) {
    return `${this.getApiBase()}${apiMethod.klines.url}?symbol=${symbol}&interval=${INTERVAL}&limit=2`;
  }

  getApiAggTradesUrl(symbols) {
    return `${this.getApiBase()}${apiMethod.aggTrades.url}?symbol=${symbols[0]}&limit=50`;
  }

  getApiTickerUrl(symbols) {
    return `${this.getApiBase()}${apiMethod.ticker.url}?symbols=${JSON.stringify(symbols)}&windowSize=1h`;
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

  async getInitialData(symbol = [SYMBOL_DEFAULT]) {
    const response = await axios.get(this.getApiTickerUrl(symbol));
    return response.data;
  }
}

const binanceService = new BinanceService();

export {
  BinanceServiceEvent,
  binanceService,
}