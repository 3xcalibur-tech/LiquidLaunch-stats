import React, { useState, useRef } from "react";
import {
  Wallet,
  TrendingUp,
  BarChart3,
  Calendar,
  Activity,
  DollarSign,
  Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import { Analytics } from "@vercel/analytics/react";

interface WalletStats {
  address: string;
  total_volume: string;
  total_trades: number;
  buy_count: number;
  sell_count: number;
  first_trade: number;
  last_trade: number;
}

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const statsCardRef = useRef<HTMLDivElement>(null);

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const formatNumber = (num: number | string) => {
    const number = typeof num === "string" ? parseFloat(num) : num;
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "K";
    }
    return number.toFixed(2);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchWalletStats = async () => {
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidAddress(walletAddress.trim())) {
      setError("Please enter a valid Ethereum wallet address");
      return;
    }

    setLoading(true);
    setError("");
    setStats(null);

    try {
      const response = await fetch(
        `https://donkey-api.liquidlaunch.app/api/wallet/${walletAddress.trim()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wallet statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWalletStats();
  };

  const downloadStatsImage = async () => {
    if (!statsCardRef.current || !stats) return;

    setIsGeneratingImage(true);

    // Hide the save button during image generation
    const saveButton = statsCardRef.current.querySelector(
      "[data-save-button]"
    ) as HTMLElement;
    if (saveButton) {
      saveButton.style.display = "none";
    }

    try {
      const canvas = await html2canvas(statsCardRef.current, {
        backgroundColor: "#000000",
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: statsCardRef.current.offsetWidth,
        height: statsCardRef.current.offsetHeight,
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `wallet-stats-${stats.address.slice(0, 8)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      // Show the save button again
      if (saveButton) {
        saveButton.style.display = "flex";
      }
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 backdrop-blur-md bg-black/80">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Liquid Launch</h1>
              <p className="text-sm text-gray-500">Wallet Analytics</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Search Section - Twitter-like compose box */}
        <div className="bg-black border border-gray-800 rounded-2xl mb-4">
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address (0x...)"
                  className="w-full px-3 py-2 text-base bg-transparent text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none font-mono focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !walletAddress.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg border border-blue-400/50 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-800/50 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section - Twitter card style */}
        {stats && (
          <div
            ref={statsCardRef}
            className="bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-base">
                      Wallet Statistics
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-gray-400 text-sm">
                        Liquid Launch Analytics
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Image Button */}
                <button
                  data-save-button
                  onClick={downloadStatsImage}
                  disabled={isGeneratingImage}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-full border border-gray-600 transition-colors disabled:opacity-50 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingImage ? "Saving..." : "Save Image"}</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-b from-gray-900/20 to-transparent">
              {/* Key Metrics - Enhanced layout */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Total Volume */}
                <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                      <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-semibold tracking-wide">
                      VOLUME / FEES
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2 mb-1">
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(stats.total_volume)}
                    </p>
                    <span className="text-gray-500 font-bold text-lg">/</span>
                    <p className="text-lg font-bold text-gray-300">
                      {formatNumber(parseFloat(stats.total_volume) * 0.01)}
                    </p>
                  </div>
                  <p className="text-sm text-blue-400 font-medium">HYPE</p>
                </div>

                {/* Total Trades */}
                <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                      <Activity className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-semibold tracking-wide">
                      TRADES
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {stats.total_trades}
                  </p>
                  <p className="text-sm text-green-400 font-medium">TOTAL</p>
                </div>

                {/* Buy Orders */}
                <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-semibold tracking-wide">
                      BUYS
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {stats.buy_count}
                  </p>
                  <p className="text-sm text-emerald-400 font-medium">ORDERS</p>
                </div>

                {/* Sell Orders */}
                <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                      <BarChart3 className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-semibold tracking-wide">
                      SELLS
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {stats.sell_count}
                  </p>
                  <p className="text-sm text-red-400 font-medium">ORDERS</p>
                </div>
              </div>

              {/* Trading Activity - Enhanced */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-300 tracking-wide mb-4">
                  TRADING PERIOD
                </h4>

                {/* Trading Period */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                        <Calendar className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <span className="text-xs text-gray-400 font-semibold tracking-wide">
                        FIRST TRADE
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {formatDate(stats.first_trade)}
                    </p>
                  </div>

                  <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <span className="text-xs text-gray-400 font-semibold tracking-wide">
                        LAST TRADE
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {formatDate(stats.last_trade)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Analytics />
    </div>
  );
}

export default App;
