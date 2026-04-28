"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CrosshairMode } from "lightweight-charts";

interface TradeData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface LivePriceChartProps {
  symbol: string;
  height?: number;
}

export default function LivePriceChart({ symbol, height = 400 }: LivePriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart with candlestick configuration
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: "#0f172a" },
        textColor: "#94a3b8",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#3b82f6",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: "#3b82f6",
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: "#1e293b",
        textColor: "#94a3b8",
      },
      timeScale: {
        borderColor: "#1e293b",
        textColor: "#94a3b8",
        timeVisible: true,
        secondsVisible: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#10b981",
      wickDownColor: "#ef4444",
      wickUpColor: "#10b981",
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: "#3b82f6",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Initialize with some mock data
    const initialData: TradeData[] = [
      { time: Math.floor(Date.now() / 1000) - 3600, open: 0.15, high: 0.155, low: 0.148, close: 0.152, volume: 1000 },
      { time: Math.floor(Date.now() / 1000) - 3000, open: 0.152, high: 0.158, low: 0.150, close: 0.156, volume: 1200 },
      { time: Math.floor(Date.now() / 1000) - 2400, open: 0.156, high: 0.160, low: 0.153, close: 0.158, volume: 900 },
      { time: Math.floor(Date.now() / 1000) - 1800, open: 0.158, high: 0.162, low: 0.155, close: 0.159, volume: 1100 },
      { time: Math.floor(Date.now() / 1000) - 1200, open: 0.159, high: 0.165, low: 0.157, close: 0.163, volume: 1300 },
      { time: Math.floor(Date.now() / 1000) - 600, open: 0.163, high: 0.168, low: 0.160, close: 0.166, volume: 1050 },
      { time: Math.floor(Date.now() / 1000) - 300, open: 0.166, high: 0.170, low: 0.164, close: 0.169, volume: 950 },
      { time: Math.floor(Date.now() / 1000) - 60, open: 0.169, high: 0.172, low: 0.167, close: 0.171, volume: 800 },
    ];

    candlestickSeries.setData(initialData);
    volumeSeries.setData(initialData);

    // Store references
    chartRef.current = { chart, candlestickSeries, volumeSeries };

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.chart.remove();
      }
    };
  }, [height]);

  useEffect(() => {
    // WebSocket connection for live data
    const ws = new WebSocket("ws://127.0.0.1:3001");

    ws.onopen = () => {
      console.log("WebSocket connected for live price data");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle different message types
        if (data.type === "trade" && data.symbol === symbol) {
          const tradeData = data.payload;

          if (chartRef.current && tradeData) {
            const { candlestickSeries, volumeSeries } = chartRef.current;

            // Convert incoming trade data to candlestick format
            const newCandle: TradeData = {
              time: Math.floor(tradeData.timestamp / 1000),
              open: tradeData.open,
              high: tradeData.high,
              low: tradeData.low,
              close: tradeData.close,
              volume: tradeData.volume,
            };

            // Update chart with new candle
            candlestickSeries.update(newCandle);
            volumeSeries.update(newCandle);

            // Update price display
            setLastPrice(tradeData.close);

            // Calculate price change
            if (tradeData.previousClose) {
              const change = ((tradeData.close - tradeData.previousClose) / tradeData.previousClose) * 100;
              setPriceChange(change);
            }

            console.log("Chart updated with new trade data:", newCandle);
          }
        } else if (data.type === "price_tick" && data.symbol === symbol) {
          // Handle real-time price ticks
          const tickData = data.payload;
          setLastPrice(tickData.price);

          if (tickData.previousPrice) {
            const change = ((tickData.price - tickData.previousPrice) / tickData.previousPrice) * 100;
            setPriceChange(change);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    // Subscribe to symbol
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "subscribe",
        payload: {
          symbol: symbol,
          channel: "trades",
        },
      }));
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      {/* Header with symbol and price info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <div className={`px-2 py-1 rounded text-xs font-medium ${isConnected
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}>
            {isConnected ? "LIVE" : "DISCONNECTED"}
          </div>
        </div>

        {lastPrice !== null && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ${lastPrice.toFixed(6)}
            </div>
            {priceChange !== null && (
              <div className={`text-sm font-medium ${priceChange >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart container */}
      <div
        ref={chartContainerRef}
        className="w-full"
        style={{ height: `${height}px` }}
      />

      {/* Chart info */}
      <div className="mt-4 flex justify-between text-xs text-slate-400">
        <span>Real-time price data via WebSocket</span>
        <span>1m candles</span>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
