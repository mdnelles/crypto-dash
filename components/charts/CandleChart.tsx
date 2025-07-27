// components/CandlestickChart.tsx
import React, { useEffect, useRef } from "react";
import {
   createChart,
   ColorType,
   UTCTimestamp,
   CandlestickData,
} from "lightweight-charts";
import { ChartData } from "../Chart"; // Same ChartData interface you're already using

export default function CandlestickChart({ data }: { data: ChartData[] }) {
   const chartRef = useRef<HTMLDivElement>(null);
   const chartInstance = useRef<ReturnType<typeof createChart> | null>(null);

   useEffect(() => {
      if (!chartRef.current) return;

      // Cleanup previous chart
      if (chartInstance.current) {
         chartInstance.current.remove();
      }

      // Create new chart
      const chart = createChart(chartRef.current, {
         width: chartRef.current.clientWidth,
         height: 400,
         layout: {
            background: { type: ColorType.Solid, color: "#ffffff" },
            textColor: "#333",
         },
         grid: {
            vertLines: { color: "#eee" },
            horzLines: { color: "#eee" },
         },
         timeScale: {
            timeVisible: true,
            secondsVisible: false,
         },
         crosshair: {
            mode: 1,
         },
         rightPriceScale: {
            borderVisible: false,
         },
      });

      const candlestickSeries = chart.addCandlestickSeries({
         upColor: "#16a34a",
         borderUpColor: "#16a34a",
         wickUpColor: "#16a34a",
         downColor: "#dc2626",
         borderDownColor: "#dc2626",
         wickDownColor: "#dc2626",
      });

      // Transform data
      const formattedData: CandlestickData[] = data
         .filter(
            (d) =>
               d &&
               typeof d.timestamp === "number" &&
               d.open !== null &&
               d.open !== undefined &&
               d.high !== null &&
               d.high !== undefined &&
               d.low !== null &&
               d.low !== undefined &&
               d.close !== null &&
               d.close !== undefined
         )
         .map((d) => ({
            time: Math.floor(d.timestamp / 1000) as UTCTimestamp, // ⬅️ cast time correctly
            open: Number(d.open),
            high: Number(d.high),
            low: Number(d.low),
            close: Number(d.close),
         }));

      candlestickSeries.setData(formattedData);

      chartInstance.current = chart;

      // Resize chart on window resize
      const handleResize = () => {
         if (chartRef.current) {
            chart.applyOptions({
               width: chartRef.current.clientWidth,
            });
         }
      };
      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
         chart.remove();
      };
   }, [data]);

   return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}
