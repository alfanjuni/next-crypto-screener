import axios from "axios";

const TELEGRAM_BOT_TOKEN = "8495696305:AAE6wApa4py3fg30Fi3elCALo6hk7Fr9yiA";
const TELEGRAM_CHAT_ID = "483286201";

// Only send for these signals
const ALLOWED_SIGNALS = [
  "strong buy",
  "strong sell",
  "ULTRA BUY",
  "ULTRA SELL",
];

export async function sendSignalToTelegram(symbol: {
  symbol: string;
  signal: string;
  rsi: number;
  rsiMTF: number;
  rsiHTF: number;
  price: number;
}) {
  try {
    // Filter signals
    if (!ALLOWED_SIGNALS.includes(symbol.signal)) {
      return;
    }

    // Pick icon & color
    let icon = "⚪️";
    if (symbol.signal.toLowerCase().includes("buy")) {
      icon = "🟢"; // green circle for BUY
    } else if (symbol.signal.toLowerCase().includes("sell")) {
      icon = "🔴"; // red circle for SELL
    }

    // TradingView permalink
    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=${symbol.symbol}.P`;

    const message = `
📊 *Crypto Signal Alert*  
───────────────
💎 Symbol: *${symbol.symbol}*
💲 Price: ${symbol.price}
${icon} Direction: *${symbol.signal.toUpperCase()}*  
🔹 RSI: ${symbol.rsi.toFixed(2)}  
🔹 RSI MTF: ${symbol.rsiMTF.toFixed(2)}  
🔹 RSI HTF: ${symbol.rsiHTF.toFixed(2)}  
───────────────
🔗 [Open in TradingView](${tradingViewUrl})
`;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );
  } catch (err) {
    console.error("Failed to send Telegram signal:", err);
  }
}
