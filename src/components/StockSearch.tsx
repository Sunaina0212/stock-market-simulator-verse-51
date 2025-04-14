
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StockData } from '@/types';
import { stockService } from '@/services/stockService';

export default function StockSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Search stocks when query changes
  useEffect(() => {
    const searchStocks = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await stockService.searchStocks(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching stocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelect = (symbol: string) => {
    setOpen(false);
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setOpen(true)}
              />
            </div>
            <Button type="submit" className="bg-finance-primary">Search</Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={5}>
          <Command>
            <CommandInput placeholder="Search stocks..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>
                {isLoading ? 'Searching...' : 'No stocks found.'}
              </CommandEmpty>
              <CommandGroup>
                {searchResults.map((stock) => (
                  <CommandItem key={stock.symbol} onSelect={() => handleSelect(stock.symbol)}>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-muted-foreground ml-2">{stock.name}</span>
                      </div>
                      <span>${stock.price.toFixed(2)}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
