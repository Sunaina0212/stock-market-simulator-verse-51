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
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    price: 2891.45,
    change: 15.70,
    changePercent: 0.55,
    marketCap: 1960000000000,
    volume: 3521640,
    high: 2905.25,
    low: 2875.80
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd.",
    price: 3755.60,
    change: -22.40,
    changePercent: -0.59,
    marketCap: 1375000000000,
    volume: 982560,
    high: 3785.90,
    low: 3745.15
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    price: 1678.35,
    change: 12.85,
    changePercent: 0.77,
    marketCap: 1260000000000,
    volume: 4526780,
    high: 1685.60,
    low: 1670.25
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys Ltd.",
    price: 1432.75,
    change: -18.25,
    changePercent: -1.26,
    marketCap: 592000000000,
    volume: 3245670,
    high: 1445.90,
    low: 1425.30
  },
  BHARTIARTL: {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    price: 1167.50,
    change: 8.45,
    changePercent: 0.73,
    marketCap: 652000000000,
    volume: 2134560,
    high: 1172.40,
    low: 1158.75
  },
  ITC: {
    symbol: "ITC",
    name: "ITC Ltd.",
    price: 428.95,
    change: 3.25,
    changePercent: 0.76,
    marketCap: 532000000000,
    volume: 6234570,
    high: 430.50,
    low: 426.80
  },
  ICICIBANK: {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    price: 1023.45,
    change: 7.80,
    changePercent: 0.77,
    marketCap: 714000000000,
    volume: 5123450,
    high: 1028.90,
    low: 1018.65
  },
  HINDUNILVR: {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd.",
    price: 2456.75,
    change: -12.35,
    changePercent: -0.50,
    marketCap: 577000000000,
    volume: 1234560,
    high: 2470.80,
    low: 2450.25
  },
  ADANIPOWER: {
    symbol: "ADANIPOWER",
    name: "Adani Power Ltd.",
    price: 545.75,
    change: 8.25,
    changePercent: 1.53,
    marketCap: 210000000000,
    volume: 3245670,
    high: 548.90,
    low: 538.30
  },
  ADANISTEEL: {
    symbol: "ADANISTEEL",
    name: "Adani Steel Ltd.",
    price: 287.45,
    change: 3.75,
    changePercent: 1.32,
    marketCap: 156000000000,
    volume: 2134560,
    high: 289.40,
    low: 283.75
  },
  TATAPOWER: {
    symbol: "TATAPOWER",
    name: "Tata Power Company Ltd.",
    price: 432.60,
    change: 5.85,
    changePercent: 1.37,
    marketCap: 138000000000,
    volume: 4526780,
    high: 435.60,
    low: 428.25
  },
  TEJASNET: {
    symbol: "TEJASNET",
    name: "Tejas Networks Ltd.",
    price: 892.35,
    change: 12.85,
    changePercent: 1.46,
    marketCap: 82000000000,
    volume: 1234560,
    high: 895.60,
    low: 880.25
  },
  CDS: {
    symbol: "CDS",
    name: "Clearing Corporation of India Ltd.",
    price: 345.75,
    change: -2.25,
    changePercent: -0.65,
    marketCap: 45000000000,
    volume: 982560,
    high: 348.90,
    low: 343.15
  },
  EXCITEINDIA: {
    symbol: "EXCITEINDIA",
    name: "Excite India Trading Ltd.",
    price: 178.45,
    change: 3.25,
    changePercent: 1.85,
    marketCap: 28000000000,
    volume: 756430,
    high: 180.50,
    low: 175.80
  }
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
