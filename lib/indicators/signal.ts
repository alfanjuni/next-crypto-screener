// Signal indicator calculation

import { CryptoSymbol } from "../types";

export const getSignal = (
  symbol: CryptoSymbol
):
  | "buy"
  | "sell"
  | "hold"
  | "strong buy"
  | "strong sell"
  | "ULTRA BUY"
  | "ULTRA SELL" => {
  // RSI HTF > 50 + RSI MTF > 50 + Stoch Oversold + RSI < 30 → ULTRA BUY
  if (
    symbol.rsiHTF > 50 &&
    symbol.rsiMTF > 50 &&
    symbol.slowK < 20 &&
    symbol.slowD < 20 &&
    symbol.rsi < 30
  ) {
    return "ULTRA BUY";
  }

  //    RSI HTF < 50 + RSI MTF < 50 + Stoch Overbought + RSI > 70 → ULTRA SELL
  if (
    symbol.rsiHTF < 50 &&
    symbol.rsiMTF < 50 &&
    symbol.slowK > 80 &&
    symbol.slowD > 80 &&
    symbol.rsi > 70
  ) {
    return "ULTRA SELL";
  }

  //  RSI MTF > 50 + Stoch Oversold + RSI < 30 → STRONG BUY
  if (
    symbol.rsiMTF > 50 &&
    symbol.slowK < 20 &&
    symbol.slowD < 20 &&
    symbol.rsi < 30
  ) {
    return "strong buy";
  }

  // RSI MTF < 50 + Stoch Overbought + RSI > 70 → STRONG SELL
  if (
    symbol.rsiMTF < 50 &&
    symbol.slowK > 80 &&
    symbol.slowD > 80 &&
    symbol.rsi > 70
  ) {
    return "strong sell";
  }

  // RSI HTF > 50 + Stoch Oversold → BUY
  if (symbol.rsiMTF > 50 && symbol.slowK < 20 && symbol.slowD < 20) {
    return "buy";
  }

  // RSI HTF < 50 + Stoch Overbought → SELL
  if (symbol.rsiMTF < 50 && symbol.slowK > 80 && symbol.slowD > 80) {
    return "sell";
  }

  return "hold";
};
