
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/Chart';
import { StockHistoryPoint } from '@/types';

export default function MarketOverview() {
  // Sample data for market overview chart
  const marketData: StockHistoryPoint[] = [
    { date: '2023-04-01', price: 35000 },
    { date: '2023-04-02', price: 35200 },
    { date: '2023-04-03', price: 35150 },
    { date: '2023-04-04', price: 35400 },
    { date: '2023-04-05', price: 35600 },
    { date: '2023-04-06', price: 35500 },
    { date: '2023-04-07', price: 35800 },
    { date: '2023-04-08', price: 36000 },
    { date: '2023-04-09', price: 36200 },
    { date: '2023-04-10', price: 36400 },
    { date: '2023-04-11', price: 36300 },
    { date: '2023-04-12', price: 36500 },
    { date: '2023-04-13', price: 36700 },
    { date: '2023-04-14', price: 36900 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart 
          data={marketData} 
          height={200} 
          strokeColor="#25C685" 
          showXAxis={true} 
          showYAxis={true} 
          showTooltip={true} 
        />
      </CardContent>
    </Card>
  );
}
