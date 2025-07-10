import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiCoffee, FiTrendingUp, FiTrendingDown, FiDollarSign } = FiIcons;

const Dashboard = ({ openSettings }) => {
  const { 
    income, 
    getTotalExpensesThisMonth, 
    getExpensesByCategory, 
    categories, 
    getCurrentMonthExpenses,
    getRandomQuote,
    formatAmount,
    currency
  } = useBudget();
  
  const [quote, setQuote] = useState('');
  const totalExpenses = getTotalExpensesThisMonth();
  const remainingBudget = income - totalExpenses;
  const expensesByCategory = getExpensesByCategory();
  const currentMonthExpenses = getCurrentMonthExpenses();

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const pieData = categories
    .filter(cat => expensesByCategory[cat.id] > 0)
    .map(cat => ({
      name: cat.name,
      value: expensesByCategory[cat.id],
      color: cat.color
    }));

  const recentExpenses = currentMonthExpenses.slice(0, 5);

  const progressPercentage = Math.min((totalExpenses / income) * 100, 100);

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6 pt-4"
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiCoffee} className="w-8 h-8 text-terracotta" />
            <div>
              <h1 className="text-2xl font-bold text-espresso dark:text-cream">Tazzio</h1>
              <p className="text-sm text-espresso/70 dark:text-cappuccino/70">
                {format(new Date(), 'MMMM yyyy')}
              </p>
            </div>
          </div>
          <button
            onClick={openSettings}
            className="p-2 rounded-full bg-cappuccino/20 dark:bg-espresso/50 hover:bg-cappuccino/30 dark:hover:bg-espresso/70 transition-colors"
          >
            <SafeIcon 
              icon={FiSettings} 
              className="w-5 h-5 text-espresso dark:text-cream" 
            />
          </button>
        </motion.div>

        {/* Quote of the day */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-4 mb-6 shadow-soft"
        >
          <p className="text-espresso dark:text-cream text-center font-medium">
            "{quote}"
          </p>
        </motion.div>

        {/* Budget Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
            Vue d'ensemble
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Revenus</span>
              <span className="font-semibold text-sage">{income.toFixed(2)} {currency}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Dépenses</span>
              <span className="font-semibold text-terracotta">{totalExpenses.toFixed(2)} {currency}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Reste</span>
              <span className={`font-semibold ${remainingBudget >= 0 ? 'text-sage' : 'text-terracotta'}`}>
                {remainingBudget.toFixed(2)} {currency}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-espresso/70 dark:text-cappuccino/70 mb-2">
                <span>Progression</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-cappuccino/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressPercentage > 90 ? 'bg-terracotta' : 'bg-sage'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expense Chart */}
        {pieData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
          >
            <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
              Répartition des dépenses
            </h2>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} ${currency}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Expenses */}
        {recentExpenses.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
          >
            <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
              Dépenses récentes
            </h2>
            
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => {
                const category = categories.find(cat => cat.id === expense.category);
                return (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category?.icon}</span>
                      <div>
                        <p className="font-medium text-espresso dark:text-cream">
                          {expense.description || category?.name}
                        </p>
                        <p className="text-xs text-espresso/70 dark:text-cappuccino/70">
                          {format(new Date(expense.date), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-terracotta">
                      {expense.amount.toFixed(2)} {currency}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-sage" />
              <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                Économies
              </span>
            </div>
            <p className="text-lg font-semibold text-espresso dark:text-cream">
              {Math.max(0, remainingBudget).toFixed(2)} {currency}
            </p>
          </div>
          
          <div className="bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-terracotta" />
              <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                Moyenne/jour
              </span>
            </div>
            <p className="text-lg font-semibold text-espresso dark:text-cream">
              {(totalExpenses / new Date().getDate()).toFixed(2)} {currency}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;