import { useState, useEffect } from "react";
import { binanceService, BinanceServiceEvent } from '../services/binance.service';
import { SymbolPair } from '../constants';

const NOTIFICATION_TEXT_DEFAULT = '';
const TEXT_API_UNAVAILABLE = 'Binance api is unavailable.';
const TEXT_STREAM_ERROR = 'Error in Binance data stream.';
const TEXT_STREAM_RECONNECT = 'Reconnecting to Binance data stream';


export default function useExchange() {
  const [initialized, setInitialized] = useState(false);
  const [currentPrices, setCurrentPrices] = useState({});
  const [data, setData] = useState([]);


  const events = {};
  events.handleStreamMessage = (dataPoint) => {
    setCurrentPrices(dataPoint);
  };

  events.handleStreamError = () => {
    console.log('notificationText', TEXT_STREAM_ERROR);
    // this.setState({ notificationText: TEXT_STREAM_ERROR });
    // this.showNotification();
    // this.hideDeal();
  };

  events.handleStreamReconnect = () => {
    console.log('notificationText', TEXT_STREAM_RECONNECT);
    // this.showNotification();
    // this.hideDeal();
  };

  useEffect(() => {
    binanceService.on(BinanceServiceEvent.MESSAGE, events.handleStreamMessage);
    binanceService.on(BinanceServiceEvent.ERROR, events.handleStreamError);
    binanceService.on(BinanceServiceEvent.RECONNECT, events.handleStreamReconnect);
    binanceService
      .getInitialData(Object.keys(SymbolPair))
      .then((data) => {
        setInitialized(true);
        setData(data);
        binanceService.connectToStream();
      })
      .catch((error) => {
        // there are all errors from `then`'s
        // treat them as binance unavailable.
        setInitialized(false);
        // this.setState({ notificationText: TEXT_API_UNAVAILABLE });
      });
    return () => {
      binanceService.removeAllListeners();
      binanceService.removeAllWebSocketListeners();
    }
  }, []);

  return {
    initialized,
    currentPrices,
    data
  }
}