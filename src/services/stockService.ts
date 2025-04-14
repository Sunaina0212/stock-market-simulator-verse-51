
import { StockData, StockHistory, StockHistoryPoint } from "../types";

// Mock stock data
const mockStocks: Record<string, StockData> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 3.35,
    changePercent: 1.91,
    marketCap: 2790000000000,
    volume: 57966720,
    high: 179.38,
    low: 175.57
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 377.44,
    change: 0.94,
    changePercent: 0.25,
    marketCap: 2800000000000,
    volume: 22522416,
    high: 377.60,
    low: 372.67
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.44,
    change: -0.73,
    changePercent: -0.51,
    marketCap: 1790000000000,
    volume: 18587840,
    high: 143.00,
    low: 141.35
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 175.35,
    change: 1.40,
    changePercent: 0.80,
    marketCap: 1810000000000,
    volume: 29336320,
    high: 176.59,
    low: 173.57
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 176.75,
    change: -8.21,
    changePercent: -4.44,
    marketCap: 562000000000,
    volume: 94352320,
    high: 179.99,
    low: 175.10
  },
  META: {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 472.40,
    change: 4.58,
    changePercent: 0.98,
    marketCap: 1210000000000,
    volume: 11583040,
    high: 473.25,
    low: 465.78
  },
  NFLX: {
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 605.88,
    change: 2.76,
    changePercent: 0.46,
    marketCap: 264000000000,
    volume: 2753760,
    high: 608.65,
    low: 600.19
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 881.86,
    change: 15.70,
    changePercent: 1.81,
    marketCap: 2170000000000,
    volume: 40964160,
    high: 886.41,
    low: 865.42
  },
};

// Simulate real-time price updates
setInterval(() => {
  Object.values(mockStocks).forEach(stock => {
    const randomChange = (Math.random() - 0.5) * 2 * (stock.price * 0.005); // Random change within ±0.5%
    const oldPrice = stock.price;
    stock.price = parseFloat((stock.price + randomChange).toFixed(2));
    stock.change = parseFloat((stock.price - oldPrice + stock.change).toFixed(2));
    stock.changePercent = parseFloat(((stock.change / (stock.price - stock.change)) * 100).toFixed(2));
  });
}, 5000);

// Generate mock history data
const generateHistoryData = (basePrice: number, days: number): StockHistoryPoint[] => {
  const data: StockHistoryPoint[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate some volatility
    const volatility = 0.02; // 2% daily volatility
    const change = basePrice * volatility * (Math.random() - 0.5) * 2;
    
    // Add some trend
    const trend = 0.0002 * basePrice * (days - i);
    
    if (i === days) {
      data.push({
        date: date.toISOString().split('T')[0],
        price: basePrice
      });
    } else {
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat((data[data.length - 1].price + change + trend).toFixed(2))
      });
    }
  }
  
  return data;
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const stockService = {
  getTopStocks: async (): Promise<StockData[]> => {
    await delay(500);
    return Object.values(mockStocks);
  },
  
  getStockData: async (symbol: string): Promise<StockData> => {
    await delay(300);
    const stock = mockStocks[symbol.toUpperCase()];
    
    if (!stock) {
      throw new Error(`Stock with symbol ${symbol} not found`);
    }
    
    return stock;
  },
  
  searchStocks: async (query: string): Promise<StockData[]> => {
    await delay(300);
    
    if (!query) return [];
    
    query = query.toLowerCase();
    return Object.values(mockStocks).filter(stock => 
      stock.symbol.toLowerCase().includes(query) || 
      stock.name.toLowerCase().includes(query)
    );
  },
  
  getStockHistory: async (symbol: string, interval: StockHistory['interval'] = '1m'): Promise<StockHistory> => {
    await delay(700);
    const stock = mockStocks[symbol.toUpperCase()];
    
    if (!stock) {
      throw new Error(`Stock with symbol ${symbol} not found`);
    }
    
    // Days of history based on interval
    const intervalDays = {
      '1d': 1,
      '1w': 7,
      '1m': 30,
      '3m': 90,
      '1y': 365,
      '5y': 1825
    };
    
    return {
      symbol,
      interval,
      data: generateHistoryData(stock.price, intervalDays[interval])
    };
  }
};
