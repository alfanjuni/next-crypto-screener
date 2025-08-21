import axios from "axios";

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1408150130670043136/ccLSZtZt5OvWmRwUETyxr__YnC7HPMK70PJJJZQOEZy5O6O6sKR1Arkx5wkN5wveczgN";

// Only send for these signals
const ALLOWED_SIGNALS = [
  "strong buy",
  "strong sell",
  "ULTRA BUY",
  "ULTRA SELL",
  "buy",
  "sell",
];

export async function sendSignalToDiscord(symbol: {
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

    // Pick icon
    let icon = "⚪️";
    if (symbol.signal.toLowerCase().includes("buy")) {
      icon = "🟢";
    } else if (symbol.signal.toLowerCase().includes("sell")) {
      icon = "🔴";
    }

    // TradingView permalink
    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=${symbol.symbol}.P`;

    // Build Discord embed
    const embed = {
      title: "📊 Crypto Signal Alert",
      description: `
💎 Symbol: **${symbol.symbol}**  
💲 Price: ${symbol.price}  
${icon} Direction: **${symbol.signal.toUpperCase()}**  
🔹 RSI: ${symbol.rsi.toFixed(2)}  
🔹 RSI MTF: ${symbol.rsiMTF.toFixed(2)}  
🔹 RSI HTF: ${symbol.rsiHTF.toFixed(2)}  
───────────────
[🔗 Open in TradingView](${tradingViewUrl})
      `,
      color: symbol.signal.toLowerCase().includes("buy") ? 0x00ff00 : 0xff0000, // green or red
      timestamp: new Date().toISOString(),
      footer: {
        text: "Signal Bot",
      },
    };

    // Send to Discord webhook
    await axios.post(DISCORD_WEBHOOK_URL, {
      embeds: [embed],
    });
  } catch (err) {
    console.error("Failed to send Discord signal:", err);
  }
}
