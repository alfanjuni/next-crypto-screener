// lib/discord-bot.ts
import axios from "axios";
import { CryptoSymbol, ScreenerSettings } from "@/lib/types";

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1408150130670043136/ccLSZtZt5OvWmRwUETyxr__YnC7HPMK70PJJJZQOEZy5O6O6sKR1Arkx5wkN5wveczgN";

const ALLOWED_SIGNALS = [
  "strong buy",
  "strong sell",
  "ULTRA BUY",
  "ULTRA SELL",
];

export async function sendSignalToDiscord(
  symbol: CryptoSymbol,
  settings: ScreenerSettings
) {
  try {
    if (!ALLOWED_SIGNALS.includes(symbol.signal)) return;

    let icon = "⚪️";
    if (symbol.signal.toLowerCase().includes("buy")) icon = "🟢";
    else if (symbol.signal.toLowerCase().includes("sell")) icon = "🔴";

    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=${symbol.symbol}.P`;
    const lighterTag = settings.lighterOnly ? " 🔆 **LIGHTER**" : "";

    const embed = {
      title: "📊 Crypto Signal Alert",
      description: `
💎 Symbol: **${symbol.symbol}**${lighterTag} 
💎 Timeframe: **${settings.timeframe}**
💲 Price: ${symbol.price}  
${icon} Direction: **${symbol.signal.toUpperCase()}**  
🔹 RSI: ${symbol.rsi.toFixed(2)}  
🔹 RSI MTF: ${symbol.rsiMTF.toFixed(2)}  
🔹 RSI HTF: ${symbol.rsiHTF.toFixed(2)}  
───────────────
[🔗 Open in TradingView](${tradingViewUrl})
      `,
      color: symbol.signal.toLowerCase().includes("buy") ? 0x00ff00 : 0xff0000,
      timestamp: new Date().toISOString(),
      footer: { text: "Signal Bot" },
    };

    await axios.post(DISCORD_WEBHOOK_URL, { embeds: [embed] });
  } catch (err) {
    console.error("Failed to send Discord signal:", err);
  }
}
