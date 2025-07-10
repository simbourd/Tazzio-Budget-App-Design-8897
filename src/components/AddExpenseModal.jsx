import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX } = FiIcons;

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { categories, addExpense, currency, t, getCategoryName, buyers } = useBudget();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    buyerId: '1', // Valeur par défaut pour "Moi"
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.buyerId) return;

    addExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    setFormData({
      amount: '',
      category: '',
      description: '',
      buyerId: '1',
      date: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-coffee-dark rounded-3xl p-6 w-full max-w-md shadow-soft"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-espresso dark:text-cream">
                {t('newExpense')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cappuccino/10 rounded-full transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5 text-espresso dark:text-cream" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('amount')} ({currency})
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('category')}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                >
                  <option value="">{t('selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {getCategoryName(category.id)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nouveau champ pour sélectionner l'acheteur */}
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('buyer')}
                </label>
                <select
                  name="buyerId"
                  value={formData.buyerId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                >
                  {buyers.map(buyer => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('description')}
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                  placeholder={t('expenseDescription')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('date')}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-cappuccino/30 text-espresso dark:text-cream rounded-xl hover:bg-cappuccino/10 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors"
                >
                  {t('add')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;