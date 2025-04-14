
import React from 'react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import StockSearch from '@/components/StockSearch';
import TopStocksGrid from '@/components/TopStocksGrid';
import MarketOverview from '@/components/MarketOverview';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>StockVerse - Virtual Stock Trading</title>
      </Helmet>
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
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
