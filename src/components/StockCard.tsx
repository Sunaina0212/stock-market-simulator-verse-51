
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { StockData } from '@/types';
import PriceChange from './PriceChange';

interface StockCardProps {
  stock: StockData;
}

export default function StockCard({ stock }: StockCardProps) {
  const { symbol, name, price, changePercent } = stock;

  return (
    <Link to={`/stocks/${symbol}`}>
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{symbol}</h3>
              <p className="text-sm text-muted-foreground truncate" title={name}>{name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${price.toFixed(2)}</p>
              <PriceChange value={changePercent} percentage={true} iconSize={14} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
