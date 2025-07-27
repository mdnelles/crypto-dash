/* eslint-disable @next/next/no-img-element */
import { BarChart3, TrendingUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ChartError from "./chart-error";
import ChartLoading from "./chart-loading";
import { ChartContainer, ChartTooltip } from "./ui/chart";

import { formatPercentage, formatPrice } from "@/lib/format";
import LinerChart from "./charts/LineChart";
import CandlestickChart from "./charts/CandleChart";

export interface ChartData {
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

interface Crypto {
   id: string;
   name: string;
   symbol: string;
   image: string;
   current_price: number;
   price_change_percentage_24h: number;
   market_cap_rank: number;
   market_cap: number;
   total_volume: number;
}

interface Chart {
   chartType: ChartType;
   setChartType: (type: ChartType) => void;
   cryptoData: Crypto[];
   selectedCrypto: string;
   chartError: string | null;
   chartLoading: boolean;
   chartData: ChartData[];
}

export default function Chart({
   cryptoData,
   selectedCrypto,
   chartType,
   setChartType,
   chartError,
   chartLoading,
   chartData,
}: Chart) {
   const getSelectedCryptoData = () => {
      return cryptoData.find((crypto) => crypto.id === selectedCrypto);
   };

   const selectedCryptoInfo = getSelectedCryptoData();

   return (
      <Card className='mb-8'>
         <CardHeader>
            <div className='flex items-center justify-between'>
               <div className='flex items-center space-x-3'>
                  {selectedCryptoInfo && (
                     <div>
                        <img
                           src={selectedCryptoInfo.image || "/placeholder.svg"}
                           alt={selectedCryptoInfo.name}
                           className='w-8 h-8 rounded-full'
                        />
                        <div>
                           <CardTitle className='text-xl'>
                              {selectedCryptoInfo.name} Price Chart
                           </CardTitle>
                           <p className='text-muted-foreground'>
                              {formatPrice(selectedCryptoInfo.current_price)}
                              <span
                                 className={`ml-2 ${selectedCryptoInfo.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                              >
                                 {formatPercentage(
                                    selectedCryptoInfo.price_change_percentage_24h
                                 )}
                              </span>
                           </p>
                        </div>
                     </div>
                  )}
               </div>
               <div className='flex space-x-2'>
                  <Button
                     variant={chartType === "line" ? "secondary" : "outline"}
                     size='sm'
                     onClick={() => setChartType("line")}
                     className='cursor-pointer border'
                  >
                     <TrendingUpIcon className='w-4 h-4 mr-2' />
                     Line
                  </Button>
                  <div style={{ width: 10 }} />
                  <Button
                     variant={
                        chartType === "candlestick" ? "secondary" : "outline"
                     }
                     size='sm'
                     onClick={() => setChartType("candlestick")}
                     className='cursor-pointer border'
                  >
                     <BarChart3 className='w-4 h-4 mr-2' />
                     Candlestick
                  </Button>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            {chartError && <ChartError />}
            {chartLoading ? (
               <ChartLoading />
            ) : (
               <ChartContainer
                  config={{
                     price: {
                        label: "Price",
                        color: "#3b82f6",
                     },
                  }}
                  className='h-[400px] w-full'
               >
                  {chartType === "line" ? (
                     <div>
                        Line Chart
                        <LinerChart data={chartData} />
                     </div>
                  ) : (
                     <div>
                        Candlestick Chart
                        <CandlestickChart data={chartData} />
                     </div>
                  )}
               </ChartContainer>
            )}
         </CardContent>
      </Card>
   );
}
