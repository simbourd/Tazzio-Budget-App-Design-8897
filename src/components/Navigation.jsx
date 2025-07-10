import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiCreditCard, FiTarget, FiPieChart, FiTrendingUp } = FiIcons;

const Navigation = () => {
  const { t } = useBudget();

  const navItems = [
    { path: '/', icon: FiHome, label: t('home') },
    { path: '/expenses', icon: FiCreditCard, label: t('expenses') },
    { path: '/budget', icon: FiTarget, label: t('budget') },
    { path: '/savings', icon: FiPieChart, label: t('savings') },
    { path: '/reports', icon: FiTrendingUp, label: t('reports') }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-coffee-dark border-t border-cappuccino/20 dark:border-espresso/30 z-40"
    >
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-terracotta/10 dark:bg-terracotta/20 text-terracotta'
                  : 'text-espresso/70 dark:text-cappuccino/70 hover:text-terracotta dark:hover:text-terracotta'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-terracotta/20' : 'hover:bg-terracotta/10'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                </motion.div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;