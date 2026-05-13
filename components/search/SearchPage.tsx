'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, Beaker, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGeminiKey } from '@/hooks/useGeminiKey';
import { toast } from '@/hooks/use-toast';
import { SearchResult } from '@/types';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey, isConfigured, isSystemConfigured } = useGeminiKey();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), apiKey, topK: 8 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.data);
    } catch (err: any) {
      toast({
        title: 'Search Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'ingredients related to sleep support',
    'natural supplements for cognitive enhancement',
    'ingredients that boost immune system',
    'adaptogens for stress management',
    'joint health supplements',
    'pre-workout ingredients',
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-12 pt-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center space-y-6"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-inner mb-2">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              Semantic Ingredient Search
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Search for ingredients using natural language. Our AI-powered engine
              understands context, intent, and meaning—not just keywords.
            </p>
          </div>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative group">
            {/* Focus Glow Effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            
            <div className="relative flex items-center bg-background border shadow-sm hover:shadow-md transition-shadow rounded-[2rem] p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
              <Search className="absolute left-6 h-6 w-6 text-muted-foreground/70" />
              <Input
                placeholder="e.g., adaptogens for stress management..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 pl-16 pr-36 h-14 text-lg bg-transparent rounded-full w-full"
              />
              <div className="absolute right-2 flex items-center gap-2">
                {(!isConfigured && !isSystemConfigured) && (
                  <Badge variant="destructive" className="hidden sm:flex gap-1 h-10 px-3 rounded-full">
                    <AlertCircle className="h-4 w-4" />
                    API Key
                  </Badge>
                )}
                <Button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="h-12 px-6 rounded-full gap-2 transition-all duration-300"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="hidden sm:inline">Searching</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">Discover</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Suggestion Chips */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-4">Try these intelligent queries</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {suggestions.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setQuery(s)}
                  className="text-sm px-4 py-2 rounded-full border border-primary/10 bg-primary/5 text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors font-medium shadow-sm"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 pt-8"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Discovery Results
                  </h2>
                  <Badge variant="secondary" className="rounded-full px-2.5">
                    {results.length} found
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  AI Sorted
                </span>
              </div>

              <div className="grid gap-4">
                {results.map((result, idx) => (
                  <motion.div
                    key={result.ingredient}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="overflow-hidden border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm group">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Left Accent Bar & Number */}
                          <div className="bg-primary/5 flex sm:flex-col items-center justify-center p-4 sm:p-6 sm:w-20 border-b sm:border-b-0 sm:border-r border-primary/10">
                            <span className="text-2xl font-bold text-primary/40 group-hover:text-primary/70 transition-colors">
                              #{idx + 1}
                            </span>
                          </div>
                          
                          {/* Main Content */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="font-bold text-xl tracking-tight text-foreground mb-1">
                                  {result.ingredient}
                                </h3>
                                <Badge variant="outline" className="text-xs bg-background">
                                  {result.category}
                                </Badge>
                              </div>
                              
                              {/* Match Score Badge */}
                              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full ring-1 ring-primary/20">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-semibold text-primary">
                                  {(result.similarity * 100).toFixed(0)}% Match
                                </span>
                              </div>
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                              {result.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t pt-4">
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                                  Primary Benefits
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {result.commonUses.map((use) => (
                                    <span
                                      key={use}
                                      className="text-xs px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground font-medium"
                                    >
                                      {use}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="sm:text-right bg-muted/30 px-4 py-2 rounded-lg border">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                                  Typical Dosage
                                </span>
                                <div className="flex items-center gap-1.5 sm:justify-end text-sm font-medium">
                                  <Beaker className="h-4 w-4 text-primary" />
                                  {result.typicalDosage}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}