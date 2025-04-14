
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export interface Portfolio {
  userId: string;
  stocks: PortfolioStock[];
  totalValue: number;
}

export interface PortfolioStock {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  high: number;
  low: number;
}

export interface Transaction {
  id: string;
  userId: string;
  symbol: string;
  shares: number;
  price: number;
  type: 'BUY' | 'SELL';
  date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface StockHistoryPoint {
  date: string;
  price: number;
}

export interface StockHistory {
  symbol: string;
  interval: '1d' | '1w' | '1m' | '3m' | '1y' | '5y';
  data: StockHistoryPoint[];
}
