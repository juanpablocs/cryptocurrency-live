import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { binanceService, BinanceServiceEvent } from '../services/binance.service';
import { setLoading } from "../store/uiSlice";
import { setCurrentPrice, setInitialPrice } from "../store/coinSlice";

const NOTIFICATION_TEXT_DEFAULT = '';
const TEXT_API_UNAVAILABLE = 'Binance api is unavailable.';
const TEXT_STREAM_ERROR = 'Error in Binance data stream.';
const TEXT_STREAM_RECONNECT = 'Reconnecting to Binance data stream';

export default function useExchange(windowSize, currentSymbol) {
  const [currentPrices, setCurrentPrices] = useState({});
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const events = {};
  events.handleStreamMessage = (dataPoint) => {
    setCurrentPrices(dataPoint);
  };

  events.handleStreamError = () => {
    console.log('notificationText', TEXT_STREAM_ERROR);
    // this.setState({ notificationText: TEXT_STREAM_ERROR });
  };

  events.handleStreamReconnect = () => {
    console.log('notificationText', TEXT_STREAM_RECONNECT);
    // this.showNotification();
  };

  useEffect(() => {
    dispatch(setLoading(true));
    binanceService
      .getInitialData(windowSize)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        // this.setState({ notificationText: TEXT_API_UNAVAILABLE });
      }).finally(() => {
        dispatch(setLoading(false));
      });

  }, [windowSize]);

  useEffect(() => {
    if (data) {
      const c = data.filter(d => d.symbol === currentSymbol)[0];
      dispatch(setInitialPrice(c?.openPrice));
      dispatch(setCurrentPrice(c?.lastPrice));
    }
  }, [data, currentSymbol]);

  useEffect(() => {
    if (currentPrices[currentSymbol]) {
      dispatch(setCurrentPrice(currentPrices[currentSymbol]))
    }
  }, [currentPrices, currentSymbol]);

  useEffect(() => {
    binanceService.on(BinanceServiceEvent.MESSAGE, events.handleStreamMessage);
    binanceService.on(BinanceServiceEvent.ERROR, events.handleStreamError);
    binanceService.on(BinanceServiceEvent.RECONNECT, events.handleStreamReconnect);
    setTimeout(() => {
      binanceService.connectToStream();
    }, 1000);
    return () => {
      binanceService.removeAllListeners();
      binanceService.removeAllWebSocketListeners();
    }
  }, []);

  return {
    currentPrices,
    data
  }
}