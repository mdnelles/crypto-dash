/* eslint-disable @next/next/no-img-element */

import { ChartTooltip } from "../ui/chart";
import {
   CartesianGrid,
   Line,
   LineChart,
   ResponsiveContainer,
   XAxis,
   YAxis,
} from "recharts";
import { formatPrice } from "@/lib/format";
import { ChartData } from "../Chart";
interface LinearChartProps {
   data: any[];
}

export default function LinerChart(props: LinearChartProps) {
   const { data } = props;
   return (
      <div>
         <ResponsiveContainer width='100%' height={400}>
            <LineChart
               data={data}
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
                              <p className='text-sm'>
                                 Price:{" "}
                                 {formatPrice(payload[0].value as number)}
                              </p>
                           </div>
                        );
                     }
                     return null;
                  }}
               />
               <Line
                  type='monotone'
                  dataKey='price'
                  stroke='var(--color-price)'
                  strokeWidth={2}
                  dot={false}
               />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
}
