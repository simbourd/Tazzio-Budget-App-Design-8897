import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiTrash2, FiFilter } = FiIcons;

const Expenses = () => {
  const { getCurrentMonthExpenses, categories, deleteExpense, currency } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const expenses = getCurrentMonthExpenses();
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categories.find(cat => cat.id === expense.category)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteExpense = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      deleteExpense(id);
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
            Mes dépenses
          </h1>
          <p className="text-espresso/70 dark:text-cappuccino/70">
            {format(new Date(), 'MMMM yyyy')}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-6"
        >
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-espresso/50 dark:text-cappuccino/50 w-5 h-5" 
            />
            <input
              type="text"
              placeholder="Rechercher une dépense..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-espresso/30 border border-cappuccino/30 dark:border-cappuccino/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 text-espresso dark:text-cream"
            />
          </div>

          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-espresso/70 dark:text-cappuccino/70" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-4 py-3 bg-white dark:bg-espresso/30 border border-cappuccino/30 dark:border-cappuccino/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 text-espresso dark:text-cream"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-espresso/70 dark:text-cappuccino/70 mb-2">
                Aucune dépense trouvée
              </p>
              <p className="text-sm text-espresso/50 dark:text-cappuccino/50">
                {searchTerm || selectedCategory ? 'Essayez de modifier vos filtres' : 'Ajoutez votre première dépense !'}
              </p>
            </div>
          ) : (
            filteredExpenses.map((expense, index) => {
              const category = categories.find(cat => cat.id === expense.category);
              return (
                <motion.div
                  key={expense.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                           style={{ backgroundColor: `${category?.color}20` }}>
                        <span className="text-xl">{category?.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-espresso dark:text-cream">
                          {expense.description || category?.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                            {category?.name}
                          </span>
                          <span className="text-xs text-espresso/50 dark:text-cappuccino/50">
                            •
                          </span>
                          <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                            {format(new Date(expense.date), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-terracotta">
                        {expense.amount.toFixed(2)} {currency}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-terracotta/70 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Total */}
        {filteredExpenses.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-espresso dark:text-cream">
                Total {selectedCategory ? `(${categories.find(cat => cat.id === selectedCategory)?.name})` : ''}
              </span>
              <span className="text-xl font-bold text-terracotta">
                {filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)} {currency}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Expenses;