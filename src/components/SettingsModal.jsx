import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const BuyerManagementSection = ({ buyers, addBuyer, removeBuyer, updateBuyer, t }) => {
  const [newBuyerName, setNewBuyerName] = useState('');
  const [editingBuyer, setEditingBuyer] = useState(null);

  const handleAddBuyer = () => {
    if (newBuyerName.trim()) {
      addBuyer(newBuyerName.trim());
      setNewBuyerName('');
    }
  };

  const handleUpdateBuyer = (id) => {
    if (editingBuyer?.name.trim()) {
      updateBuyer(id, editingBuyer.name.trim());
      setEditingBuyer(null);
    }
  };

  const handleDeleteBuyer = (id) => {
    if (window.confirm(t('confirmDeleteBuyer'))) {
      removeBuyer(id);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-md font-medium text-espresso dark:text-cream">
        {t('manageBuyers')}
      </h3>
      
      {/* Liste des acheteurs existants */}
      <div className="space-y-2">
        {buyers.map(buyer => (
          <div key={buyer.id} className="flex items-center gap-2">
            {editingBuyer?.id === buyer.id ? (
              <input
                type="text"
                value={editingBuyer.name}
                onChange={(e) => setEditingBuyer({ ...editingBuyer, name: e.target.value })}
                className="flex-1 px-3 py-2 border border-cappuccino/30 rounded-lg dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
              />
            ) : (
              <span className="flex-1 text-espresso dark:text-cream">{buyer.name}</span>
            )}
            
            {editingBuyer?.id === buyer.id ? (
              <button
                onClick={() => handleUpdateBuyer(buyer.id)}
                className="p-2 text-sage hover:bg-sage/10 rounded-lg"
              >
                <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setEditingBuyer(buyer)}
                className="p-2 text-terracotta hover:bg-terracotta/10 rounded-lg"
              >
                <SafeIcon icon={FiIcons.FiEdit2} className="w-4 h-4" />
              </button>
            )}
            
            {buyer.id !== '1' && buyer.id !== '2' && (
              <button
                onClick={() => handleDeleteBuyer(buyer.id)}
                className="p-2 text-terracotta hover:bg-terracotta/10 rounded-lg"
              >
                <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Formulaire d'ajout d'un nouvel acheteur */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newBuyerName}
          onChange={(e) => setNewBuyerName(e.target.value)}
          placeholder={t('newBuyer')}
          className="flex-1 px-3 py-2 border border-cappuccino/30 rounded-lg dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
        />
        <button
          onClick={handleAddBuyer}
          className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90"
        >
          {t('addBuyer')}
        </button>
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, toggleTheme, isDarkMode }) => {
  const { 
    currency, 
    setCurrency, 
    language, 
    setLanguage, 
    t,
    buyers, 
    addBuyer, 
    removeBuyer, 
    updateBuyer 
  } = useBudget();

  const currencies = [
    { code: '€', name: 'Euro (€)' },
    { code: '$', name: 'Dollar ($)' },
    { code: '£', name: 'Livre (£)' },
    { code: '¥', name: 'Yen (¥)' },
    { code: 'CHF', name: 'Franc suisse (CHF)' },
    { code: 'CAD', name: 'Dollar canadien (CAD)' }
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

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
            className="bg-white dark:bg-coffee-dark rounded-3xl p-6 w-full max-w-md shadow-soft max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiIcons.FiSettings} className="w-6 h-6 text-terracotta" />
                <h2 className="text-xl font-semibold text-espresso dark:text-cream">
                  {t('settings')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cappuccino/10 rounded-full transition-colors"
              >
                <SafeIcon icon={FiIcons.FiX} className="w-5 h-5 text-espresso dark:text-cream" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Section Thème */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-espresso dark:text-cream">
                  {t('theme')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleTheme(false)}
                    className={`p-3 rounded-xl border transition-all ${
                      !isDarkMode
                        ? 'border-terracotta bg-terracotta/10 text-terracotta'
                        : 'border-cappuccino/30 dark:border-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SafeIcon icon={FiIcons.FiSun} className="w-4 h-4" />
                      <span className="text-sm">{t('lightMode')}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => toggleTheme(true)}
                    className={`p-3 rounded-xl border transition-all ${
                      isDarkMode
                        ? 'border-terracotta bg-terracotta/10 text-terracotta'
                        : 'border-cappuccino/30 text-espresso hover:bg-cappuccino/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SafeIcon icon={FiIcons.FiMoon} className="w-4 h-4" />
                      <span className="text-sm">{t('darkMode')}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section Devise */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-espresso dark:text-cream">
                  {t('currency')}
                </h3>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Langue */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-espresso dark:text-cream">
                  {t('language')}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-3 rounded-xl border transition-all ${
                        language === lang.code
                          ? 'border-terracotta bg-terracotta/10 text-terracotta'
                          : 'border-cappuccino/30 dark:border-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section des acheteurs */}
              <BuyerManagementSection
                buyers={buyers}
                addBuyer={addBuyer}
                removeBuyer={removeBuyer}
                updateBuyer={updateBuyer}
                t={t}
              />
            </div>

            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors"
              >
                {t('apply')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;