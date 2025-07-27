/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Moon, Sun } from "lucide-react";
import CryptoCard from "./CryptoCard";
import Loading from "./Loading";
import Chart from "./Chart";
import ErrorLoadingData from "./ErrorLoadingData";

interface CryptoData {
   id: string;
   name: string;
   symbol: string;
   current_price: number;
   price_change_percentage_24h: number;
   market_cap: number;
   market_cap_rank: number;
   image: string;
   total_volume: number;
   sparkline_in_7d?: {
      price: number[];
   };
}

interface ChartData {
   timestamp: number;
   date: string;
   time: string;
   price: number;
   open?: number;
   high?: number;
   low?: number;
   close?: number;
}

type ChartType = "line" | "candlestick";

export default function CryptoDashboard() {
   const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
   const [darkMode, setDarkMode] = useState<boolean>(true);

   // Chart related state
   const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");
   const [chartData, setChartData] = useState<ChartData[]>([]);
   const [chartLoading, setChartLoading] = useState(true);
   const [chartType, setChartType] = useState<ChartType>("line");
   const [chartError, setChartError] = useState<string | null>(null);

   const fetchCryptoData = async () => {
      try {
         setError(null);
         const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true&price_change_percentage=24h"
         );

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();
         setCryptoData(data);
         setLastUpdated(new Date());
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
         setLoading(false);
      }
   };

   const generateMockOHLCData = (prices: number[]): ChartData[] => {
      const data: ChartData[] = [];
      const now = new Date();

      for (let i = 0; i < prices.length; i++) {
         const timestamp = now.getTime() - (prices.length - i) * 3600000; // hourly data
         const price = prices[i] ?? 1;
         const volatility = price * 0.02; // 2% volatility

         const open: number = i > 0 ? (prices[i - 1] ?? price) : price;
         const high = price + Math.random() * volatility;
         const low = price - Math.random() * volatility;
         const close = price;

         data.push({
            timestamp,
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString([], {
               hour: "2-digit",
               minute: "2-digit",
            }),
            price,
            open,
            high: Math.max(high, open, close),
            low: Math.min(low, open, close),
            close,
         });
      }

      return data;
   };

   const fetchChartData = async (cryptoId: string) => {
      try {
         setChartLoading(true);
         setChartError(null);

         // First, try to use sparkline data from the main API call
         const selectedCryptoData = cryptoData.find(
            (crypto) => crypto.id === cryptoId
         );
         if (selectedCryptoData?.sparkline_in_7d?.price) {
            const sparklineData = selectedCryptoData.sparkline_in_7d.price;
            const formattedData = generateMockOHLCData(sparklineData);
            setChartData(formattedData);
            setChartLoading(false);
            return;
         }

         // Fallback: Try to fetch detailed chart data
         let url = "";
         if (chartType === "line") {
            url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&interval=hourly`;
         } else {
            url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/ohlc?vs_currency=usd&days=7`;
         }

         const response = await fetch(url);

         if (!response.ok) {
            throw new Error(`Failed to fetch chart data: ${response.status}`);
         }

         const data = await response.json();

         if (chartType === "line" && data.prices) {
            const formattedData: ChartData[] = data.prices.map(
               ([timestamp, price]: [number, number]) => ({
                  timestamp,
                  date: new Date(timestamp).toLocaleDateString(),
                  time: new Date(timestamp).toLocaleTimeString([], {
                     hour: "2-digit",
                     minute: "2-digit",
                  }),
                  price: price,
               })
            );
            setChartData(formattedData);
         } else if (chartType === "candlestick" && Array.isArray(data)) {
            const formattedData: ChartData[] = data.map(
               ([timestamp, open, high, low, close]: [
                  number,
                  number,
                  number,
                  number,
                  number,
               ]) => ({
                  timestamp,
                  date: new Date(timestamp).toLocaleDateString(),
                  time: new Date(timestamp).toLocaleTimeString([], {
                     hour: "2-digit",
                     minute: "2-digit",
                  }),
                  price: close,
                  open,
                  high,
                  low,
                  close,
               })
            );
            setChartData(formattedData);
         } else {
            throw new Error("Invalid data format received");
         }
      } catch (err) {
         console.error("Error fetching chart data:", err);
         setChartError(
            err instanceof Error ? err.message : "Failed to load chart data"
         );

         // Generate fallback data based on current price
         const selectedCryptoData = cryptoData.find(
            (crypto) => crypto.id === cryptoId
         );
         if (selectedCryptoData) {
            const fallbackData = generateFallbackChartData(
               selectedCryptoData.current_price
            );
            setChartData(fallbackData);
         }
      } finally {
         setChartLoading(false);
      }
   };

   const generateFallbackChartData = (currentPrice: number): ChartData[] => {
      const data: ChartData[] = [];
      const now = new Date();
      const points = 168; // 7 days * 24 hours

      for (let i = 0; i < points; i++) {
         const timestamp = now.getTime() - (points - i) * 3600000;
         const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
         const price = currentPrice * (1 + variation * (i / points));
         const volatility = price * 0.02;

         const open = i > 0 ? (data[i - 1]?.close ?? price) : price;
         const high = price + Math.random() * volatility;
         const low = price - Math.random() * volatility;
         const close = price;

         data.push({
            timestamp,
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString([], {
               hour: "2-digit",
               minute: "2-digit",
            }),
            price,
            open,
            high: Math.max(high, open, close),
            low: Math.min(low, open, close),
            close,
         });
      }

      return data;
   };

   useEffect(() => {
      fetchCryptoData();
   }, []);

   useEffect(() => {
      if (cryptoData.length > 0) {
         fetchChartData(selectedCrypto);
      }
   }, [selectedCrypto, chartType, cryptoData]);

   const handleCryptoSelect = (cryptoId: string) => {
      setSelectedCrypto(cryptoId);
   };

   if (error) {
      return (
         <ErrorLoadingData error={error} fetchCryptoData={fetchCryptoData} />
      );
   }

   useEffect(() => {
      if (cryptoData.length > 0) {
         fetchChartData(selectedCrypto);
      }
   }, [selectedCrypto, chartType, cryptoData]);

   useEffect(() => {
      const localValue = localStorage.getItem("darkMode");
      if (localValue === null) {
         localStorage.setItem("darkMode", "true");
         setDarkMode(true);
      } else {
         setDarkMode(localValue === "true");
      }
   }, []);

   useEffect(() => {
      const savedMode = localStorage.getItem("darkMode");
      const isDark = savedMode === null || savedMode === "true";

      setDarkMode(isDark);

      // Ensure the class is applied on mount
      if (isDark) {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
   }, []);

   const toggleDark = () => {
      const newValue = !darkMode;
      setDarkMode(newValue);
      localStorage.setItem("darkMode", newValue.toString());

      // Apply or remove dark mode class on <html>
      if (newValue) {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
   };

   return (
      <div className='min-h-screen bg-background'>
         <div className='container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-4 py-8 max-w-7xl'>
            <div className='flex items-center justify-between mb-8'>
               <div>
                  <h1 className='text-4xl font-bold tracking-tight'>
                     Live Crypto (Demontration Purposes Only)
                  </h1>
                  <p className='text-muted-foreground mt-2'>
                     Real-time cryptocurrency prices and market data
                  </p>
               </div>
               <div className='text-right'>
                  <div className='flex justify-end gap-3 mb-2'>
                     <Button variant='outline' onClick={toggleDark}>
                        {!darkMode ? (
                           <Moon className='w-4 h-4 mr-2' />
                        ) : (
                           <Sun className='w-4 h-4 mr-2' />
                        )}
                        {!darkMode ? "Dark" : "Light"}
                     </Button>
                     <Button
                        variant='outline'
                        onClick={fetchCryptoData}
                        disabled={loading}
                     >
                        <RefreshCw
                           className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                     </Button>
                  </div>
                  {lastUpdated && (
                     <p className='text-sm text-muted-foreground'>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                     </p>
                  )}
               </div>
            </div>

            {/* Chart Section */}

            <Chart
               chartType={"line"}
               setChartType={setChartType}
               chartError={chartError}
               chartLoading={chartLoading}
               chartData={chartData}
               cryptoData={cryptoData}
               selectedCrypto={selectedCrypto}
            />

            {/* Crypto Cards Grid */}
            {loading ? (
               <Loading />
            ) : (
               <CryptoCard
                  cryptoData={cryptoData}
                  selectedCrypto={selectedCrypto}
                  handleCryptoSelect={handleCryptoSelect}
               />
            )}
         </div>
      </div>
   );
}
