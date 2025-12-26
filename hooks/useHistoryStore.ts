'use client';

/**
 * History Store - localStorage based history management
 */

import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, OptimizationResult } from '@/types';

const STORAGE_KEY = 'better-prompt-history';
const MAX_HISTORY_ITEMS = 50;

interface HistoryStore {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  updateHistoryItem: (id: string, result: OptimizationResult) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const loadHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load history from localStorage:', e);
  }
  return [];
};

const saveHistory = (history: HistoryItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to localStorage:', e);
  }
};

export const useHistoryStore = (): HistoryStore => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount (client-side only)
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prev) => {
      const newItem: HistoryItem = {
        ...item,
        id: generateId(),
        timestamp: Date.now(),
      };

      // Add to beginning, limit to MAX_HISTORY_ITEMS
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const updateHistoryItem = useCallback((id: string, result: OptimizationResult) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, result } : item
      );
      saveHistory(updated);
      return updated;
    });
  }, []);

  return {
    history,
    addHistory,
    updateHistoryItem,
    clearHistory,
    removeHistoryItem,
  };
};
