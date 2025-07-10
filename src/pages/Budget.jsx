import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiSave, FiAlertCircle } = FiIcons;

const Budget = () => {
  const { 
    categories, 
    budgets, 
    updateBudget, 
    getExpensesByCategory, 
    income, 
    setIncome,
    currency
  } = useBudget();
  
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingIncome, setEditingIncome] = useState(false);
  const [tempValues, setTempValues] = useState({});
  
  const expensesByCategory = getExpensesByCategory();
  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + (budget || 0), 0);
  const totalSpent = Object.values(expensesByCategory).reduce((sum, spent) => sum + spent, 0);

  const handleEditBudget = (categoryId) => {
    setEditingBudget(categoryId);
    setTempValues(prev => ({
      ...prev,
      [categoryId]: budgets[categoryId] || 0
    }));
  };

  const handleSaveBudget = (categoryId) => {
    const value = parseFloat(tempValues[categoryId]) || 0;
    updateBudget(categoryId, value);
    setEditingBudget(null);
  };

  const handleEditIncome = () => {
    setEditingIncome(true);
    setTempValues(prev => ({ ...prev, income }));
  };

  const handleSaveIncome = () => {
    const value = parseFloat(tempValues.income) || 0;
    setIncome(value);
    setEditingIncome(false);
  };

  const getBudgetStatus = (categoryId) => {
    const budget = budgets[categoryId] || 0;
    const spent = expensesByCategory[categoryId] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'danger': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-sage';
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 pt-4"
        >
          <h1 className="text-2xl font-bold text-espresso dark:text-cream mb-2">
            Mon budget
          </h1>
          <p className="text-espresso/70 dark:text-cappuccino/70">
            Planifiez et suivez vos dépenses
          </p>
        </motion.div>

        {/* Income Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-espresso dark:text-cream">
              Revenus mensuels
            </h2>
            <button
              onClick={editingIncome ? handleSaveIncome : handleEditIncome}
              className="p-2 text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
            >
              <SafeIcon icon={editingIncome ? FiSave : FiEdit3} className="w-5 h-5" />
            </button>
          </div>
          
          {editingIncome ? (
            <input
              type="number"
              value={tempValues.income || ''}
              onChange={(e) => setTempValues(prev => ({ ...prev, income: e.target.value }))}
              className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
              placeholder="Revenus mensuels"
              step="0.01"
            />
          ) : (
            <div className="text-2xl font-bold text-sage">
              {income.toFixed(2)} {currency}
            </div>
          )}
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
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Budget total</span>
              <span className="font-semibold text-espresso dark:text-cream">
                {totalBudget.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Dépensé</span>
              <span className="font-semibold text-terracotta">
                {totalSpent.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Reste</span>
              <span className={`font-semibold ${
                totalBudget - totalSpent >= 0 ? 'text-sage' : 'text-red-500'
              }`}>
                {(totalBudget - totalSpent).toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Categories Budget */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-espresso dark:text-cream">
            Budget par catégorie
          </h2>
          
          {categories.map((category, index) => {
            const budget = budgets[category.id] || 0;
            const spent = expensesByCategory[category.id] || 0;
            const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            const status = getBudgetStatus(category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ backgroundColor: `${category.color}20` }}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-espresso dark:text-cream">
                        {category.name}
                      </h3>
                      <p className="text-sm text-espresso/70 dark:text-cappuccino/70">
                        {spent.toFixed(2)} {currency} / {budget.toFixed(2)} {currency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status === 'danger' && (
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500" />
                    )}
                    {status === 'warning' && (
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-500" />
                    )}
                    <button
                      onClick={() => editingBudget === category.id ? handleSaveBudget(category.id) : handleEditBudget(category.id)}
                      className="p-2 text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={editingBudget === category.id ? FiSave : FiEdit3} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {editingBudget === category.id ? (
                  <input
                    type="number"
                    value={tempValues[category.id] || ''}
                    onChange={(e) => setTempValues(prev => ({ ...prev, [category.id]: e.target.value }))}
                    className="w-full px-3 py-2 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                    placeholder="Budget pour cette catégorie"
                    step="0.01"
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-espresso/70 dark:text-cappuccino/70">Progression</span>
                      <span className="text-espresso/70 dark:text-cappuccino/70">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-cappuccino/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Budget;