
import React from 'react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import PortfolioSummary from '@/components/PortfolioSummary';
import TransactionHistory from '@/components/TransactionHistory';
import { useAuth } from '@/context/AuthContext';
import { portfolioService } from '@/services/portfolioService';
import { useState, useEffect } from 'react';
import { PortfolioStock } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PriceChange from '@/components/PriceChange';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;
      
      try {
        const portfolio = await portfolioService.getUserPortfolio(user.id);
        setPortfolioStocks(portfolio.stocks);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    
    // Update portfolio periodically to get latest prices
    const intervalId = setInterval(fetchPortfolio, 10000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>My Portfolio - StockVerse</title>
      </Helmet>
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="py-4 border-b last:border-0">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                ) : portfolioStocks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">No stocks in your portfolio yet.</p>
                    <p className="mt-2">Search for stocks and start trading!</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Shares</TableHead>
                        <TableHead>Avg Price</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Gain/Loss</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioStocks.map((stock) => {
                        const gainLoss = stock.currentPrice - stock.avgPrice;
                        const gainLossPercent = (gainLoss / stock.avgPrice) * 100;
                        const marketValue = stock.shares * stock.currentPrice;
                        
                        return (
                          <TableRow key={stock.symbol}>
                            <TableCell className="font-medium">{stock.symbol}</TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>{stock.shares}</TableCell>
                            <TableCell>${stock.avgPrice.toFixed(2)}</TableCell>
                            <TableCell>${stock.currentPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <PriceChange value={gainLossPercent} percentage={true} />
                            </TableCell>
                            <TableCell className="text-right">${marketValue.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <PortfolioSummary />
          </div>
        </div>
        
        <TransactionHistory />
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>StockVerse - Virtual Stock Trading Platform</p>
          <p className="mt-1">All market data is simulated for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
