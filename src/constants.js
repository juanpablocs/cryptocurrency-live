export const SymbolPair = {
  BTCUSDT: 'BTCUSDT',
  ETHUSDT: 'ETHUSDT',
  SOLUSDT: 'SOLUSDT',
  ADAUSDT: 'ADAUSDT',
  DOTUSDT: 'DOTUSDT',
};

export const SymbolPairTitle = {
  [SymbolPair.BTCUSDT]: { short: 'BTC', full: 'Bitcoin' },
  [SymbolPair.ETHUSDT]: { short: 'ETH', full: 'Ethereum' },
  [SymbolPair.SOLUSDT]: { short: 'SOL', full: 'Solana' },
  [SymbolPair.ADAUSDT]: { short: 'ADA', full: 'Cardano' },
  [SymbolPair.DOTUSDT]: { short: 'DOT', full: 'Polkadot' },
};

export const SYMBOL_DEFAULT = SymbolPair.BTCUSDT;