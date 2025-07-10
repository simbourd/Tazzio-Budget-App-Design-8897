import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [savings, setSavings] = useState([]);
  const [income, setIncome] = useState(3000);
  const [currency, setCurrency] = useState('€');
  const [language, setLanguage] = useState('fr');

  const categories = [
    { id: 'food', name: 'Alimentation', icon: '🍽️', color: '#E07A5F' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#9CAF88' },
    { id: 'housing', name: 'Logement', icon: '🏠', color: '#D2B48C' },
    { id: 'entertainment', name: 'Loisirs', icon: '🎭', color: '#C8860D' },
    { id: 'health', name: 'Santé', icon: '🏥', color: '#8B4513' },
    { id: 'shopping', name: 'Achats', icon: '🛍️', color: '#F2E7D5' },
    { id: 'bills', name: 'Factures', icon: '📋', color: '#5D4037' },
    { id: 'other', name: 'Autres', icon: '📦', color: '#E6D5C3' }
  ];

  const motivationalQuotes = [
    "Votre budget est votre meilleur ami ☕",
    "Chaque euro économisé est un pas vers vos rêves 🌟",
    "La planification financière, c'est comme un bon café : ça se savoure lentement ☕",
    "Vos objectifs financiers sont à portée de main 💫",
    "Un budget bien géré, c'est la liberté assurée 🕊️"
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('tazzio-expenses');
    const savedBudgets = localStorage.getItem('tazzio-budgets');
    const savedSavings = localStorage.getItem('tazzio-savings');
    const savedIncome = localStorage.getItem('tazzio-income');
    const savedCurrency = localStorage.getItem('tazzio-currency');
    const savedLanguage = localStorage.getItem('tazzio-language');

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedSavings) setSavings(JSON.parse(savedSavings));
    if (savedIncome) setIncome(JSON.parse(savedIncome));
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tazzio-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('tazzio-budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('tazzio-savings', JSON.stringify(savings));
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('tazzio-income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('tazzio-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('tazzio-language', language);
  }, [language]);

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: new Date().toISOString(),
      month: format(new Date(), 'yyyy-MM')
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateBudget = (categoryId, amount) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: amount
    }));
  };

  const addSavingsGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    setSavings(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id, amount) => {
    setSavings(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.min(goal.targetAmount, goal.currentAmount + amount) }
        : goal
    ));
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    return expenses.filter(expense => expense.month === currentMonth);
  };

  const getTotalExpensesThisMonth = () => {
    return getCurrentMonthExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    const categoryTotals = {};
    
    categories.forEach(category => {
      categoryTotals[category.id] = currentMonthExpenses
        .filter(expense => expense.category === category.id)
        .reduce((total, expense) => total + expense.amount, 0);
    });
    
    return categoryTotals;
  };

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const formatAmount = (amount) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const value = {
    expenses,
    budgets,
    savings,
    income,
    categories,
    currency,
    setCurrency,
    language,
    setLanguage,
    addExpense,
    deleteExpense,
    updateBudget,
    addSavingsGoal,
    updateSavingsGoal,
    setIncome,
    getCurrentMonthExpenses,
    getTotalExpensesThisMonth,
    getExpensesByCategory,
    getRandomQuote,
    formatAmount
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};