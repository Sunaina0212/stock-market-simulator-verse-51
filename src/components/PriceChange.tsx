
import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface PriceChangeProps {
  value: number;
  percentage?: boolean;
  withIcon?: boolean;
  className?: string;
  iconSize?: number;
}

export default function PriceChange({
  value,
  percentage = false,
  withIcon = true,
  iconSize = 16,
  className = ''
}: PriceChangeProps) {
  const isPositive = value >= 0;
  
  const textColor = isPositive ? 'text-finance-chart-green' : 'text-finance-chart-red';
  
  return (
    <div className={`flex items-center ${textColor} ${className}`}>
      {withIcon && (
        <span className="mr-1">
          {isPositive ? 
            <TrendingUp size={iconSize} /> : 
            <TrendingDown size={iconSize} />
          }
        </span>
      )}
      <span>
        {isPositive ? '+' : ''}
        {value.toFixed(2)}
        {percentage && '%'}
      </span>
    </div>
  );
}
