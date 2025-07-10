import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiCalendar, FiTrendingUp, FiTrendingDown } = FiIcons;

const Reports = () => {
  const { expenses, categories, income, currency } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  const getPeriodData = () => {
    const now = new Date();
    let startDate;
    
    switch (selectedPeriod) {
      case '1month':
        startDate = subMonths(now, 1);
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
      case '6months':
        startDate = subMonths(now, 6);
        break;
      case '1year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 3);
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };

  const getMonthlyData = () => {
    const periodExpenses = getPeriodData();
    const monthlyData = {};
    
    periodExpenses.forEach(expense => {
      const month = format(new Date(expense.date), 'yyyy-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month: format(new Date(expense.date), 'MMM yyyy'),
          total: 0,
          categories: {}
        };
      }
      monthlyData[month].total += expense.amount;
      
      if (!monthlyData[month].categories[expense.category]) {
        monthlyData[month].categories[expense.category] = 0;
      }
      monthlyData[month].categories[expense.category] += expense.amount;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getCategoryData = () => {
    const periodExpenses = getPeriodData();
    const categoryTotals = {};
    
    categories.forEach(category => {
      categoryTotals[category.id] = {
        name: category.name,
        icon: category.icon,
        total: 0,
        color: category.color
      };
    });
    
    periodExpenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category].total += expense.amount;
      }
    });
    
    return Object.values(categoryTotals)
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const totalExpenses = getPeriodData().reduce((sum, expense) => sum + expense.amount, 0);
  const averageMonthly = monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0;

  const exportData = () => {
    const csvData = [
      ['Date', 'Catégorie', 'Description', 'Montant'],
      ...getPeriodData().map(expense => [
        format(new Date(expense.date), 'dd/MM/yyyy'),
        categories.find(cat => cat.id === expense.category)?.name || 'Autre',
        expense.description || '',
        expense.amount.toFixed(2)
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tazzio-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-espresso dark:text-cream mb-2">
                Rapports
              </h1>
              <p className="text-espresso/70 dark:text-cappuccino/70">
                Analyse de vos finances
              </p>
            </div>
            <button
              onClick={exportData}
              className="p-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Period Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-4 mb-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-3">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-terracotta" />
            <span className="font-medium text-espresso dark:text-cream">Période</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: '1month', label: '1 mois' },
              { value: '3months', label: '3 mois' },
              { value: '6months', label: '6 mois' },
              { value: '1year', label: '1 an' }
            ].map(period => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-terracotta text-white'
                    : 'bg-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/30'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-terracotta" />
              <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                Total dépenses
              </span>
            </div>
            <p className="text-xl font-bold text-espresso dark:text-cream">
              {totalExpenses.toFixed(2)} {currency}
            </p>
          </div>
          
          <div className="bg-white dark:bg-espresso/30 rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <SafeIcon icon={FiTrendingDown} className="w-5 h-5 text-sage" />
              <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                Moyenne/mois
              </span>
            </div>
            <p className="text-xl font-bold text-espresso dark:text-cream">
              {averageMonthly.toFixed(2)} {currency}
            </p>
          </div>
        </motion.div>

        {/* Monthly Trend Chart */}
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
          >
            <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
              Évolution mensuelle
            </h2>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D2B48C" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#8B4513" 
                    fontSize={12}
                    tick={{ fill: '#8B4513' }}
                  />
                  <YAxis 
                    stroke="#8B4513" 
                    fontSize={12}
                    tick={{ fill: '#8B4513' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(2)} ${currency}`, 'Dépenses']}
                    labelStyle={{ color: '#8B4513' }}
                    contentStyle={{ 
                      backgroundColor: '#F7F3E9', 
                      border: '1px solid #D2B48C',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#E07A5F" 
                    strokeWidth={3}
                    dot={{ fill: '#E07A5F', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#E07A5F', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
          >
            <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
              Répartition par catégorie
            </h2>
            
            <div className="space-y-3">
              {categoryData.map((category, index) => {
                const percentage = (category.total / totalExpenses) * 100;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-espresso dark:text-cream">
                            {category.name}
                          </span>
                          <span className="text-sm text-espresso/70 dark:text-cappuccino/70">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-cappuccino/20 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="ml-4 font-semibold text-espresso dark:text-cream">
                      {category.total.toFixed(2)} {currency}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* No Data Message */}
        {getPeriodData().length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiTrendingUp} className="w-16 h-16 text-cappuccino/30 mx-auto mb-4" />
            <p className="text-espresso/70 dark:text-cappuccino/70 mb-2">
              Aucune donnée pour cette période
            </p>
            <p className="text-sm text-espresso/50 dark:text-cappuccino/50">
              Ajoutez des dépenses pour voir vos rapports
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;