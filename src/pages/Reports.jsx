import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPieChart, FiBarChart2, FiUsers, FiDollarSign } = FiIcons;

const Reports = () => {
  const { 
    expenses, 
    categories, 
    buyers, 
    income, 
    currency, 
    t, 
    getExpensesByBuyer,
    buyerIncomes
  } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Filtrer les dépenses selon la période sélectionnée
  const filterExpensesByPeriod = () => {
    const now = new Date();
    let startDate;
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };

  const filteredExpenses = filterExpensesByPeriod();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Données pour le graphique par catégorie
  const categoryData = categories.map(category => {
    const amount = filteredExpenses
      .filter(expense => expense.category === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: amount,
      color: category.color,
      icon: category.icon
    };
  }).filter(item => item.value > 0);

  // Calculer les dépenses par acheteur
  const expensesByBuyerId = {};
  filteredExpenses.forEach(expense => {
    if (!expensesByBuyerId[expense.buyer_id]) {
      expensesByBuyerId[expense.buyer_id] = 0;
    }
    expensesByBuyerId[expense.buyer_id] += expense.amount;
  });

  // Données pour le graphique de répartition par acheteur
  const buyerData = buyers
    .map(buyer => {
      const buyerExpenses = expensesByBuyerId[buyer.id] || 0;
      const buyerIncome = buyerIncomes[buyer.id] || 0;
      return {
        name: buyer.name,
        expenses: buyerExpenses,
        income: buyerIncome,
        balance: buyerIncome - buyerExpenses
      };
    })
    .filter(item => item.expenses > 0 || item.income > 0);

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
            Rapports
          </h1>
          <p className="text-espresso/70 dark:text-cappuccino/70">
            Analyse de vos dépenses
          </p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-4 mb-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-3">
            Période
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {['week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  selectedPeriod === period
                    ? 'bg-terracotta text-white'
                    : 'bg-cappuccino/20 dark:bg-espresso/50 text-espresso dark:text-cream hover:bg-cappuccino/30'
                }`}
              >
                {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
            Résumé
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-espresso/70 dark:text-cappuccino/70">Total dépensé</span>
              <span className="font-semibold text-terracotta">
                {totalExpenses.toFixed(2)} {currency}
              </span>
            </div>
            {selectedPeriod === 'month' && (
              <div className="flex justify-between items-center">
                <span className="text-espresso/70 dark:text-cappuccino/70">Budget mensuel</span>
                <span className="font-semibold text-sage">
                  {income.toFixed(2)} {currency}
                </span>
              </div>
            )}
            {selectedPeriod === 'month' && (
              <div className="flex justify-between items-center">
                <span className="text-espresso/70 dark:text-cappuccino/70">Reste</span>
                <span className={`font-semibold ${income - totalExpenses >= 0 ? 'text-sage' : 'text-red-500'}`}>
                  {(income - totalExpenses).toFixed(2)} {currency}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiPieChart} className="w-5 h-5 text-terracotta" />
            <h2 className="text-lg font-semibold text-espresso dark:text-cream">
              Dépenses par catégorie
            </h2>
          </div>
          {categoryData.length > 0 ? (
            <>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} ${currency}`, 'Montant']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-espresso dark:text-cream">
                        {entry.icon} {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-espresso dark:text-cream">
                        {entry.value.toFixed(2)} {currency}
                      </span>
                      <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                        ({((entry.value / totalExpenses) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center py-8 text-espresso/70 dark:text-cappuccino/70">
              Aucune donnée disponible pour cette période
            </p>
          )}
        </motion.div>

        {/* Expenses vs Income by Buyer */}
        {buyers.length > 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-sage" />
              <h2 className="text-lg font-semibold text-espresso dark:text-cream">
                Revenus et dépenses par personne
              </h2>
            </div>
            
            {buyerData.length > 0 ? (
              <>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={buyerData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(value) => `${value} ${currency}`} />
                      <Tooltip 
                        formatter={(value) => [`${value.toFixed(2)} ${currency}`, '']}
                        labelFormatter={(value) => `${value}`}
                      />
                      <Legend />
                      <Bar name="Revenus" dataKey="income" fill="#9CAF88" />
                      <Bar name="Dépenses" dataKey="expenses" fill="#E07A5F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4 mt-6">
                  {buyerData.map((buyer, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-espresso dark:text-cream">{buyer.name}</span>
                        {buyer.balance >= 0 ? (
                          <span className="text-sage font-medium">
                            +{buyer.balance.toFixed(2)} {currency}
                          </span>
                        ) : (
                          <span className="text-terracotta font-medium">
                            {buyer.balance.toFixed(2)} {currency}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-sage" />
                          <span className="text-espresso/70 dark:text-cappuccino/70">
                            Revenus: {buyer.income.toFixed(2)} {currency}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiBarChart2} className="w-4 h-4 text-terracotta" />
                          <span className="text-espresso/70 dark:text-cappuccino/70">
                            Dépenses: {buyer.expenses.toFixed(2)} {currency}
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative h-3 bg-cappuccino/20 rounded-full overflow-hidden">
                        {buyer.income > 0 && (
                          <div 
                            className="absolute left-0 top-0 h-3 bg-sage rounded-full"
                            style={{ width: `${(buyer.income / Math.max(buyer.income, buyer.expenses)) * 100}%` }}
                          />
                        )}
                        {buyer.expenses > 0 && (
                          <div 
                            className="absolute right-0 top-0 h-3 bg-terracotta rounded-full"
                            style={{ width: `${(buyer.expenses / Math.max(buyer.income, buyer.expenses)) * 100}%` }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center py-8 text-espresso/70 dark:text-cappuccino/70">
                Aucune donnée disponible pour cette période
              </p>
            )}
          </motion.div>
        )}

        {/* Expenses by Buyer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-terracotta" />
            <h2 className="text-lg font-semibold text-espresso dark:text-cream">
              {t('expensesByBuyer')}
            </h2>
          </div>
          
          <div className="space-y-4">
            {buyers.map(buyer => {
              const buyerTotal = expensesByBuyerId[buyer.id] || 0;
              const percentage = totalExpenses > 0 ? (buyerTotal / totalExpenses) * 100 : 0;
              
              return (
                <div key={buyer.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-espresso dark:text-cream">{buyer.name}</span>
                    <span className="font-semibold text-terracotta">
                      {buyerTotal.toFixed(2)} {currency}
                    </span>
                  </div>
                  <div className="w-full bg-cappuccino/20 rounded-full h-2">
                    <div
                      className="h-2 bg-terracotta rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;