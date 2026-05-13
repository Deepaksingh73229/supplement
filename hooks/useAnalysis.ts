'use client';

import { useState, useCallback } from 'react';
import { AnalysisResult, ProductInput } from '@/types';
import { generateId } from '@/lib/utils';

export function useAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (input: ProductInput, apiKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      const result: AnalysisResult = {
        id: generateId(),
        productName: input.productName,
        category: input.category,
        createdAt: new Date().toISOString(),
        ...data.data,
      };

      setResult(result);
      saveToHistory(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, reset, isLoading, error, result };
}

function saveToHistory(result: AnalysisResult) {
  if (typeof window === 'undefined') return;
  const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
  history.unshift(result);
  if (history.length > 50) history.pop();
  localStorage.setItem('analysis-history', JSON.stringify(history));
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('analysis-history') || '[]');
}
