import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const SettingsModal = ({ isOpen, onClose, toggleTheme, isDarkMode }) => {
  const { currency, setCurrency, language, setLanguage } = useBudget();
  
  const currencyOptions = [
    { value: '€', label: 'Euro (€)' },
    { value: '$', label: 'Dollar ($)' },
    { value: '£', label: 'Livre (£)' }
  ];
  
  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
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
            className="bg-white dark:bg-coffee-dark rounded-3xl p-6 w-full max-w-md shadow-soft"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiIcons.FiSettings} className="w-6 h-6 text-terracotta" />
                <h2 className="text-xl font-semibold text-espresso dark:text-cream">
                  Paramètres
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
              {/* Theme Setting */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-espresso dark:text-cream">
                  Thème
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleTheme(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      !isDarkMode 
                        ? 'bg-terracotta text-white' 
                        : 'bg-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/30'
                    }`}
                  >
                    <SafeIcon icon={FiIcons.FiSun} className="w-5 h-5" />
                    <span>Clair</span>
                  </button>
                  <button
                    onClick={() => toggleTheme(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      isDarkMode 
                        ? 'bg-terracotta text-white' 
                        : 'bg-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/30'
                    }`}
                  >
                    <SafeIcon icon={FiIcons.FiMoon} className="w-5 h-5" />
                    <span>Sombre</span>
                  </button>
                </div>
              </div>

              {/* Currency Setting */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-espresso dark:text-cream">
                  Devise
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {currencyOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setCurrency(option.value)}
                      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-colors ${
                        currency === option.value 
                          ? 'bg-terracotta text-white' 
                          : 'bg-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/30'
                      }`}
                    >
                      <SafeIcon icon={FiIcons.FiDollarSign} className="w-4 h-4" />
                      <span>{option.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Setting */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-espresso dark:text-cream">
                  Langue
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {languageOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setLanguage(option.value)}
                      className={`flex items-center justify-center gap-1 px-2 py-3 rounded-xl transition-colors ${
                        language === option.value 
                          ? 'bg-terracotta text-white' 
                          : 'bg-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/30'
                      }`}
                    >
                      <SafeIcon icon={FiIcons.FiGlobe} className="w-4 h-4 mr-1" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;