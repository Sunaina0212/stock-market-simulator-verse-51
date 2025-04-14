
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { portfolioService } from '@/services/portfolioService';
import { Transaction } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ArrowDownUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        const transactionData = await portfolioService.getUserTransactions(user.id);
        // Sort by date descending (most recent first)
        transactionData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(transactionData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <div className="border rounded-md">
          <div className="h-10 border-b px-4 flex items-center">
            <Skeleton className="h-4 w-full" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex justify-between items-center border-b last:border-0">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No transactions found.</p>
      ) : (
        <Table>
          <TableCaption>Your recent stock transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.symbol}</TableCell>
                <TableCell>
                  <span 
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      transaction.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell>{transaction.shares}</TableCell>
                <TableCell className="text-right">${transaction.price.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">
                  ${(transaction.shares * transaction.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
