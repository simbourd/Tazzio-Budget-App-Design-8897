import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiTrash2, FiX, FiMoreVertical, FiEdit2 } = FiIcons;

const ExpenseItem = ({ expense, category, buyer, currency, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-espresso/30 rounded-2xl p-5 shadow-soft relative">
      <div className="flex items-center">
        <div
          className="w-12 h-12 min-w-[3rem] rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${category?.color}20` }}
        >
          <span className="text-xl">{category?.icon}</span>
        </div>
        <div className="flex-1 px-3 overflow-hidden">
          <h3 className="font-medium text-espresso dark:text-cream truncate pr-2">
            {expense.description || category?.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 mt-1">
            <span className="text-sm text-espresso/70 dark:text-cappuccino/70 truncate">
              {category?.name}
            </span>
            <span className="text-xs text-espresso/50 dark:text-cappuccino/50">•</span>
            <span className="text-sm text-espresso/70 dark:text-cappuccino/70 truncate">
              {buyer?.name}
            </span>
            <span className="text-xs text-espresso/50 dark:text-cappuccino/50">•</span>
            <span className="text-sm text-espresso/70 dark:text-cappuccino/70 whitespace-nowrap">
              {format(new Date(expense.date), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-2">
          <span className="font-semibold text-terracotta whitespace-nowrap text-right">
            {expense.amount.toFixed(2)} {currency}
          </span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-espresso/70 dark:text-cappuccino/70 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiMoreVertical} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu contextuel */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-16 bg-white dark:bg-espresso shadow-soft rounded-xl z-10 overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  onEdit(expense);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-cappuccino/10 dark:hover:bg-espresso/50"
              >
                <SafeIcon icon={FiEdit2} className="w-4 h-4 text-terracotta" />
                <span className="text-espresso dark:text-cream text-sm">Modifier</span>
              </button>
              <button
                onClick={() => {
                  onDelete(expense.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm">Supprimer</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Expenses = ({ onEditExpense }) => {
  const { expenses, deleteExpense, categories, buyers, currency, t, refreshExpenses } = useBudget();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState('');
  
  // Rafraîchir les dépenses au chargement de la page
  useEffect(() => {
    refreshExpenses();
  }, []);

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      const success = await deleteExpense(id);
      if (success) {
        // Rafraîchir la liste après la suppression
        refreshExpenses();
      }
    }
  };

  const handleEditExpense = (expense) => {
    if (onEditExpense) {
      onEditExpense(expense);
    }
  };

  const filteredExpenses = expenses
    .filter(expense => !selectedCategory || expense.category === selectedCategory)
    .filter(expense => !selectedBuyer || expense.buyer_id === selectedBuyer)
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
              <SafeIcon icon={FiFilter} className="w-6 h-6 text-terracotta" />
              <h2 className="font-medium text-espresso dark:text-cream">Filtres</h2>
            </div>
            {(selectedCategory || selectedBuyer) && (
              <button
                onClick={resetFilters}
                className="text-sm text-terracotta hover:underline flex items-center gap-1 p-2"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
                Réinitialiser
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-3 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream text-base"
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
              className="px-3 py-3 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream text-base"
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
              const buyer = buyers.find(b => b.id === expense.buyer_id);
              
              return (
                <motion.div
                  key={expense.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ExpenseItem
                    expense={expense}
                    category={category}
                    buyer={buyer}
                    currency={currency}
                    onDelete={handleDeleteExpense}
                    onEdit={handleEditExpense}
                  />
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