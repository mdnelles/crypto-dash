import React, { useEffect } from "react";
import {
   Bar,
   BarChart,
   CartesianGrid,
   ResponsiveContainer,
   XAxis,
   YAxis,
} from "recharts";

import { formatPrice } from "@/lib/format";
import { ChartData } from "../Chart";
import { ChartTooltip } from "../ui/chart";

export default function CandlestickChart({ data }: { data: ChartData[] }) {
   const processedData = data.map((item) => ({
      ...item,
      range: [item.low || 0, item.high || 0],
      openClose: [item.open || 0, item.close || 0],
   }));

   useEffect(() => {
      console.log("Processed Data for Candlestick Chart:", processedData);

      return () => {};
   }, []);

   return (
      <ResponsiveContainer width='100%' height={400}>
         <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
         >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
               dataKey='time'
               tick={{ fontSize: 12 }}
               interval={Math.floor(data.length / 8)}
            />
            <YAxis
               tick={{ fontSize: 12 }}
               domain={["dataMin - 100", "dataMax + 100"]}
               tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <ChartTooltip
               content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                     const data = payload[0].payload as ChartData;
                     return (
                        <div className='bg-background border rounded-lg p-3 shadow-lg'>
                           <p className='font-medium'>
                              {data.date} {label}
                           </p>
                           <div className='space-y-1 text-sm'>
                              <p>Open: {formatPrice(data.open || 0)}</p>
                              <p>High: {formatPrice(data.high || 0)}</p>
                              <p>Low: {formatPrice(data.low || 0)}</p>
                              <p>Close: {formatPrice(data.close || 0)}</p>
                           </div>
                        </div>
                     );
                  }
                  return null;
               }}
            />
            <Bar dataKey='high' fill='hsl(var(--chart-1))' opacity={0.6} />
         </BarChart>
      </ResponsiveContainer>
   );
}
