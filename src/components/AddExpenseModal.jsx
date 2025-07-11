import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDollarSign, FiCalendar, FiUser, FiTag, FiFileText } = FiIcons;

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense, categories, buyers, currency, t, refreshExpenses } = useBudget();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    buyerId: '1', // Valeur par défaut: premier acheteur
    date: new Date().toISOString().split('T')[0] // Date du jour par défaut
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.buyerId) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Submitting expense:', formData);
      const success = await addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      if (success) {
        console.log('Expense added successfully');
        // Réinitialiser le formulaire
        setFormData({
          amount: '',
          category: '',
          description: '',
          buyerId: '1',
          date: new Date().toISOString().split('T')[0]
        });
        // Rafraîchir les dépenses pour s'assurer que la nouvelle dépense est affichée
        await refreshExpenses();
        // Fermer la modal
        onClose();
      } else {
        setError('Erreur lors de l\'ajout de la dépense');
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Une erreur est survenue lors de l\'ajout de la dépense');
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Montant */}
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('amount')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiDollarSign} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder={`0.00 ${currency}`}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                    required
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('category')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiTag} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream appearance-none"
                    required
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('description')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiFileText} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('expenseDescription')}
                    className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                  />
                </div>
              </div>

              {/* Acheteur */}
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('buyer')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiUser} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <select
                    name="buyerId"
                    value={formData.buyerId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream appearance-none"
                    required
                  >
                    {buyers.map(buyer => (
                      <option key={buyer.id} value={buyer.id}>
                        {buyer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('date')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiCalendar} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                  />
                </div>
              </div>

              {/* Bouton d'ajout */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  t('add')
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;