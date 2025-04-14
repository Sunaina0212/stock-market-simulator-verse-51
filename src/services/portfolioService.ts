
import { Portfolio, PortfolioStock, Transaction } from "../types";
import { stockService } from "./stockService";

// Mock portfolios
const mockPortfolios: Record<string, Portfolio> = {
  "user1": {
    userId: "user1",
    stocks: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 10,
        avgPrice: 170.50,
        currentPrice: 178.72
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        shares: 5,
        avgPrice: 350.20,
        currentPrice: 377.44
      },
      {
        symbol: "TSLA",
        name: "Tesla, Inc.",
        shares: 8,
        avgPrice: 180.75,
        currentPrice: 176.75
      }
    ],
    totalValue: 0 // Will be calculated
  }
};

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "t1",
    userId: "user1",
    symbol: "AAPL",
    shares: 10,
    price: 170.50,
    type: "BUY",
    date: "2023-04-01T10:30:00Z"
  },
  {
    id: "t2",
    userId: "user1",
    symbol: "MSFT",
    shares: 5,
    price: 350.20,
    type: "BUY",
    date: "2023-04-02T14:15:00Z"
  },
  {
    id: "t3",
    userId: "user1",
    symbol: "TSLA",
    shares: 8,
    price: 180.75,
    type: "BUY",
    date: "2023-04-05T09:45:00Z"
  }
];

// User balances
const userBalances: Record<string, number> = {
  "user1": 100000 - (10 * 170.50 + 5 * 350.20 + 8 * 180.75)
};

// Calculate portfolio values
const calculatePortfolioValues = async () => {
  for (const portfolio of Object.values(mockPortfolios)) {
    let totalValue = 0;
    
    for (const stock of portfolio.stocks) {
      try {
        const stockData = await stockService.getStockData(stock.symbol);
        stock.currentPrice = stockData.price;
        totalValue += stock.shares * stockData.price;
      } catch (error) {
        console.error(`Failed to update ${stock.symbol} price:`, error);
      }
    }
    
    portfolio.totalValue = parseFloat(totalValue.toFixed(2));
  }
};

// Update portfolio values periodically
setInterval(calculatePortfolioValues, 10000);

// Initialize portfolio values
calculatePortfolioValues();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const portfolioService = {
  getUserPortfolio: async (userId: string): Promise<Portfolio> => {
    await delay(500);
    
    // If user doesn't have a portfolio yet, create an empty one
    if (!mockPortfolios[userId]) {
      mockPortfolios[userId] = {
        userId,
        stocks: [],
        totalValue: 0
      };
    }
    
    return mockPortfolios[userId];
  },
  
  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    await delay(400);
    return mockTransactions.filter(transaction => transaction.userId === userId);
  },
  
  getUserBalance: async (userId: string): Promise<number> => {
    await delay(300);
    return userBalances[userId] || 0;
  },
  
  buyStock: async (userId: string, symbol: string, shares: number): Promise<Transaction> => {
    await delay(600);
    
    if (shares <= 0) {
      throw new Error("Number of shares must be positive");
    }
    
    // Get current stock price
    const stock = await stockService.getStockData(symbol);
    const totalCost = shares * stock.price;
    
    // Check if user has enough balance
    if (!userBalances[userId] || userBalances[userId] < totalCost) {
      throw new Error("Insufficient funds");
    }
    
    // Create transaction
    const transaction: Transaction = {
      id: `t${mockTransactions.length + 1}`,
      userId,
      symbol,
      shares,
      price: stock.price,
      type: "BUY",
      date: new Date().toISOString()
    };
    
    mockTransactions.push(transaction);
    
    // Update user balance
    userBalances[userId] -= totalCost;
    
    // Update portfolio
    const portfolio = await portfolioService.getUserPortfolio(userId);
    const existingStock = portfolio.stocks.find(s => s.symbol === symbol);
    
    if (existingStock) {
      // Update existing position
      const totalShares = existingStock.shares + shares;
      existingStock.avgPrice = parseFloat((
        (existingStock.shares * existingStock.avgPrice + shares * stock.price) / totalShares
      ).toFixed(2));
      existingStock.shares = totalShares;
      existingStock.currentPrice = stock.price;
    } else {
      // Add new position
      portfolio.stocks.push({
        symbol,
        name: stock.name,
        shares,
        avgPrice: stock.price,
        currentPrice: stock.price
      });
    }
    
    // Recalculate portfolio value
    portfolio.totalValue = parseFloat((
      portfolio.totalValue + totalCost
    ).toFixed(2));
    
    return transaction;
  },
  
  sellStock: async (userId: string, symbol: string, shares: number): Promise<Transaction> => {
    await delay(600);
    
    if (shares <= 0) {
      throw new Error("Number of shares must be positive");
    }
    
    // Get portfolio and check if user has enough shares
    const portfolio = await portfolioService.getUserPortfolio(userId);
    const stockPosition = portfolio.stocks.find(s => s.symbol === symbol);
    
    if (!stockPosition || stockPosition.shares < shares) {
      throw new Error("Not enough shares to sell");
    }
    
    // Get current stock price
    const stock = await stockService.getStockData(symbol);
    const totalValue = shares * stock.price;
    
    // Create transaction
    const transaction: Transaction = {
      id: `t${mockTransactions.length + 1}`,
      userId,
      symbol,
      shares,
      price: stock.price,
      type: "SELL",
      date: new Date().toISOString()
    };
    
    mockTransactions.push(transaction);
    
    // Update user balance
    if (!userBalances[userId]) {
      userBalances[userId] = 0;
    }
    userBalances[userId] += totalValue;
    
    // Update portfolio
    if (stockPosition.shares === shares) {
      // Remove position if all shares are sold
      portfolio.stocks = portfolio.stocks.filter(s => s.symbol !== symbol);
    } else {
      // Update position
      stockPosition.shares -= shares;
    }
    
    // Recalculate portfolio value
    portfolio.totalValue = parseFloat((
      portfolio.totalValue - totalValue
    ).toFixed(2));
    
    return transaction;
  }
};
