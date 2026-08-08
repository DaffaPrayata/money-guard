'use client';

import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Ambil data dari HP saat pertama kali aplikasi dibuka
  useEffect(() => {
    const savedData = localStorage.getItem('money_guard_data');
    if (savedData) {
      try {
        setTransactions(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Fungsi Tambah Transaksi
  const addTransaction = (newTxn: Omit<Transaction, 'id'>) => {
    const itemWithId: Transaction = {
      ...newTxn,
      id: Date.now().toString(),
    };
    const updated = [itemWithId, ...transactions];
    setTransactions(updated);
    localStorage.setItem('money_guard_data', JSON.stringify(updated));
  };

  // 3. Fungsi Hapus Transaksi
  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('money_guard_data', JSON.stringify(updated));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    isLoaded,
  };
}