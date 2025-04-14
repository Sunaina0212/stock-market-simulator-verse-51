
import React, { useEffect, useState } from 'react';
import { stockService } from '@/services/stockService';
import { StockData } from '@/types';
import StockCard from './StockCard';
import { Skeleton } from './ui/skeleton';

export default function TopStocksGrid() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await stockService.getTopStocks();
        setStocks(data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();

    // Update stock prices periodically
    const intervalId = setInterval(async () => {
      try {
        const data = await stockService.getTopStocks();
        setStocks(data);
      } catch (error) {
        console.error('Failed to update stocks:', error);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stocks.map(stock => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
}
