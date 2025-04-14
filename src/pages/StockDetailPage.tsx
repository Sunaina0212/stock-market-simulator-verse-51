
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, 
  Info, 
  LineChart as LineChartIcon, 
  TrendingDown, 
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart } from '@/components/Chart';
import Navigation from '@/components/Navigation';
import PriceChange from '@/components/PriceChange';
import { stockService } from '@/services/stockService';
import { portfolioService } from '@/services/portfolioService';
import { useAuth } from '@/context/AuthContext';
import { StockData, StockHistory } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [stock, setStock] = useState<StockData | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeInterval, setTimeInterval] = useState<StockHistory['interval']>('1m');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [buyShares, setBuyShares] = useState('');
  const [sellShares, setSellShares] = useState('');
  const [isTrading, setIsTrading] = useState(false);
  const [tradeResult, setTradeResult] = useState<{ success: boolean; message: string } | null>(null);
  
  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      try {
        // Fetch both stock data and history in parallel
        const [stockData, historyData] = await Promise.all([
          stockService.getStockData(symbol),
          stockService.getStockHistory(symbol, timeInterval)
        ]);
        
        setStock(stockData);
        setStockHistory(historyData);
        
        // Get user balance if authenticated
        if (isAuthenticated && user) {
          const balance = await portfolioService.getUserBalance(user.id);
          setUserBalance(balance);
        }
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        // Navigate to not found page if stock doesn't exist
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
    
    // Real-time updates for stock price
    const priceUpdateInterval = setInterval(async () => {
      if (!symbol) return;
      try {
        const updatedStock = await stockService.getStockData(symbol);
        setStock(updatedStock);
      } catch (error) {
        console.error('Failed to update stock price:', error);
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(priceUpdateInterval);
  }, [symbol, timeInterval, isAuthenticated, user, navigate]);
  
  // Handle time interval change
  const handleIntervalChange = async (interval: StockHistory['interval']) => {
    setTimeInterval(interval);
    if (!symbol) return;
    
    try {
      const historyData = await stockService.getStockHistory(symbol, interval);
      setStockHistory(historyData);
    } catch (error) {
      console.error('Failed to fetch stock history:', error);
    }
  };
  
  // Handle buy action
  const handleBuy = async () => {
    if (!symbol || !user || !stock) return;
    
    const shares = parseInt(buyShares);
    if (isNaN(shares) || shares <= 0) {
      setTradeResult({
        success: false,
        message: 'Please enter a valid number of shares'
      });
      return;
    }
    
    const totalCost = shares * stock.price;
    if (userBalance !== null && totalCost > userBalance) {
      setTradeResult({
        success: false,
        message: 'Insufficient funds for this purchase'
      });
      return;
    }
    
    setIsTrading(true);
    try {
      await portfolioService.buyStock(user.id, symbol, shares);
      // Update balance after purchase
      const newBalance = await portfolioService.getUserBalance(user.id);
      setUserBalance(newBalance);
      
      setTradeResult({
        success: true,
        message: `Successfully purchased ${shares} shares of ${symbol}`
      });
      setBuyShares('');
    } catch (error) {
      console.error('Failed to buy stock:', error);
      setTradeResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to buy stock'
      });
    } finally {
      setIsTrading(false);
    }
  };
  
  // Handle sell action
  const handleSell = async () => {
    if (!symbol || !user || !stock) return;
    
    const shares = parseInt(sellShares);
    if (isNaN(shares) || shares <= 0) {
      setTradeResult({
        success: false,
        message: 'Please enter a valid number of shares'
      });
      return;
    }
    
    setIsTrading(true);
    try {
      await portfolioService.sellStock(user.id, symbol, shares);
      // Update balance after sale
      const newBalance = await portfolioService.getUserBalance(user.id);
      setUserBalance(newBalance);
      
      setTradeResult({
        success: true,
        message: `Successfully sold ${shares} shares of ${symbol}`
      });
      setSellShares('');
    } catch (error) {
      console.error('Failed to sell stock:', error);
      setTradeResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sell stock'
      });
    } finally {
      setIsTrading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{symbol ? `${symbol} Stock - StockVerse` : 'Stock Details - StockVerse'}</title>
      </Helmet>
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 pl-0 flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {isLoading || !stock ? (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Stock header */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold">{stock.symbol}</h1>
                <span className="text-xl text-finance-primary">${stock.price.toFixed(2)}</span>
                <PriceChange value={stock.changePercent} percentage={true} className="text-lg" />
              </div>
              <p className="text-lg text-muted-foreground">{stock.name}</p>
            </div>
            
            {/* Stock chart */}
            <Card className="mb-6">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Price History</CardTitle>
                  <div className="flex space-x-1">
                    {(['1d', '1w', '1m', '3m', '1y', '5y'] as const).map((interval) => (
                      <Button 
                        key={interval}
                        variant={timeInterval === interval ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleIntervalChange(interval)}
                        className={timeInterval === interval ? "bg-finance-primary" : ""}
                      >
                        {interval}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {stockHistory && (
                  <Chart 
                    data={stockHistory.data}
                    strokeColor={stock.change >= 0 ? "#25C685" : "#F45B69"}
                    height={400}
                  />
                )}
              </CardContent>
            </Card>
            
            {/* Stock info and trading */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stock info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                        <p className="text-lg font-semibold">
                          ${(stock.marketCap / 1000000000).toFixed(2)}B
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Volume</p>
                        <p className="text-lg font-semibold">
                          {(stock.volume / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Today's High</p>
                        <p className="text-lg font-semibold">${stock.high.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Today's Low</p>
                        <p className="text-lg font-semibold">${stock.low.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Trading panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Trade Stock</CardTitle>
                    {isAuthenticated ? (
                      <CardDescription>
                        Available Cash: ${userBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </CardDescription>
                    ) : (
                      <CardDescription>
                        <Button onClick={() => navigate('/login')} variant="link" className="p-0">
                          Login to trade stocks
                        </Button>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isAuthenticated ? (
                      <Tabs defaultValue="buy">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="buy">Buy</TabsTrigger>
                          <TabsTrigger value="sell">Sell</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="buy">
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="buyShares">Shares</Label>
                              <Input
                                id="buyShares"
                                type="number"
                                min="1"
                                placeholder="Enter number of shares"
                                value={buyShares}
                                onChange={(e) => setBuyShares(e.target.value)}
                              />
                            </div>
                            
                            {buyShares && !isNaN(parseInt(buyShares)) && parseInt(buyShares) > 0 && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Price per share:</span>
                                  <span>${stock.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Total cost:</span>
                                  <span>${(stock.price * parseInt(buyShares)).toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              className="w-full bg-finance-success" 
                              disabled={!buyShares || isNaN(parseInt(buyShares)) || parseInt(buyShares) <= 0 || isTrading}
                              onClick={handleBuy}
                            >
                              {isTrading ? 'Processing...' : 'Buy Now'}
                            </Button>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="sell">
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="sellShares">Shares</Label>
                              <Input
                                id="sellShares"
                                type="number"
                                min="1"
                                placeholder="Enter number of shares"
                                value={sellShares}
                                onChange={(e) => setSellShares(e.target.value)}
                              />
                            </div>
                            
                            {sellShares && !isNaN(parseInt(sellShares)) && parseInt(sellShares) > 0 && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Price per share:</span>
                                  <span>${stock.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Total value:</span>
                                  <span>${(stock.price * parseInt(sellShares)).toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              className="w-full bg-finance-danger" 
                              disabled={!sellShares || isNaN(parseInt(sellShares)) || parseInt(sellShares) <= 0 || isTrading}
                              onClick={handleSell}
                            >
                              {isTrading ? 'Processing...' : 'Sell Now'}
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Info className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Login to Trade</h3>
                        <p className="text-muted-foreground text-center mb-4">
                          Create an account or login to start trading with virtual cash.
                        </p>
                        <Button onClick={() => navigate('/login')} className="bg-finance-primary">
                          Login to Trade
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Trade result dialog */}
            {tradeResult && (
              <Dialog open={!!tradeResult} onOpenChange={() => setTradeResult(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className={tradeResult.success ? "text-finance-success" : "text-finance-danger"}>
                      {tradeResult.success ? "Trade Successful" : "Trade Failed"}
                    </DialogTitle>
                    <DialogDescription>
                      {tradeResult.message}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      onClick={() => setTradeResult(null)} 
                      className={tradeResult.success ? "bg-finance-success" : "bg-finance-primary"}
                    >
                      Close
                    </Button>
                    {tradeResult.success && (
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/portfolio')}
                      >
                        View Portfolio
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>StockVerse - Virtual Stock Trading Platform</p>
          <p className="mt-1">All market data is simulated for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
