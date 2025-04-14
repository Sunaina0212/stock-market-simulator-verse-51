
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { portfolioService } from '@/services/portfolioService';
import { Portfolio } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortfolioSummary() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user) return;
      
      try {
        const portfolioData = await portfolioService.getUserPortfolio(user.id);
        const userBalance = await portfolioService.getUserBalance(user.id);
        
        setPortfolio(portfolioData);
        setBalance(userBalance);
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
    
    // Update data periodically
    const intervalId = setInterval(fetchPortfolioData, 15000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPortfolioValue = portfolio?.totalValue || 0;
  const totalBalance = balance || 0;
  const totalValue = totalPortfolioValue + totalBalance;
  
  const portfolioPercent = totalValue > 0 ? (totalPortfolioValue / totalValue) * 100 : 0;
  const cashPercent = totalValue > 0 ? (totalBalance / totalValue) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription>Your current holdings and available cash</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Cash</p>
            <p className="text-2xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <p>Stock Holdings: ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>{portfolioPercent.toFixed(1)}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
            <div 
              className="h-full bg-finance-chart-green" 
              style={{ width: `${portfolioPercent}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm mb-1 mt-2">
            <p>Cash: ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>{cashPercent.toFixed(1)}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
            <div 
              className="h-full bg-finance-info" 
              style={{ width: `${cashPercent}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
