
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import StockSearch from '@/components/StockSearch';
import TopStocksGrid from '@/components/TopStocksGrid';
import MarketOverview from '@/components/MarketOverview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>StockVerse - Virtual Stock Trading</title>
      </Helmet>
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Wallet Section */}
        <section className="mb-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-finance-primary to-finance-secondary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-white text-2xl font-semibold">Trading Wallet</h2>
                    {isAuthenticated ? (
                      <p className="text-white text-3xl font-bold">
                        ${user?.balance.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-white/80">Start with $100,000 virtual cash</p>
                    )}
                  </div>
                  {!isAuthenticated && (
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="bg-white text-finance-primary hover:bg-white/90"
                      size="lg"
                    >
                      Start Trading
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-finance-primary">Virtual Stock Trading</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice trading with real-time market data. Build your portfolio and test your investment strategies without risking real money.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto mb-10">
            <StockSearch />
          </div>
        </section>
        
        {/* Market Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Market Overview</h2>
          <MarketOverview />
        </section>
        
        {/* Top Stocks */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Stocks</h2>
          <TopStocksGrid />
        </section>
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
