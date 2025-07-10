import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiTrash2, FiX } = FiIcons;

const Expenses = () => {
  const { expenses, deleteExpense, categories, buyers, currency, t } = useBudget();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState('');

  const handleDeleteExpense = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      deleteExpense(id);
    }
  };

  const filteredExpenses = expenses
    .filter(expense => !selectedCategory || expense.category === selectedCategory)
    .filter(expense => !selectedBuyer || expense.buyerId === selectedBuyer)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBuyer('');
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
            Historique de toutes vos dépenses
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-4 mb-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-terracotta" />
              <h2 className="font-medium text-espresso dark:text-cream">Filtres</h2>
            </div>
            {(selectedCategory || selectedBuyer) && (
              <button
                onClick={resetFilters}
                className="text-sm text-terracotta hover:underline flex items-center gap-1"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <select
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
              className="px-3 py-2 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
            >
              <option value="">Tous les acheteurs</option>
              {buyers.map(buyer => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.name}
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
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-espresso dark:text-cream">
              {filteredExpenses.length} dépense(s)
            </h2>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="bg-white dark:bg-espresso/30 rounded-2xl p-6 text-center shadow-soft">
              <p className="text-espresso/70 dark:text-cappuccino/70">
                Aucune dépense trouvée
              </p>
            </div>
          ) : (
            filteredExpenses.map((expense, index) => {
              const category = categories.find(cat => cat.id === expense.category);
              const buyer = buyers.find(b => b.id === expense.buyerId);
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
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
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
                          <span className="text-xs text-espresso/50 dark:text-cappuccino/50">•</span>
                          <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                            {buyer?.name}
                          </span>
                          <span className="text-xs text-espresso/50 dark:text-cappuccino/50">•</span>
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
      </div>
    </div>
  );
};

export default Expenses;