import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTarget, FiTrendingUp, FiDollarSign } = FiIcons;

const Savings = () => {
  const { savings, addSavingsGoal, updateSavingsGoal, currency } = useBudget();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddAmount, setShowAddAmount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    description: ''
  });
  const [addAmount, setAddAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;
    
    addSavingsGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount)
    });
    
    setFormData({ name: '', targetAmount: '', description: '' });
    setShowAddForm(false);
  };

  const handleAddAmount = (goalId) => {
    if (!addAmount) return;
    
    updateSavingsGoal(goalId, parseFloat(addAmount));
    setAddAmount('');
    setShowAddAmount(null);
  };

  const totalSavings = savings.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savings.reduce((sum, goal) => sum + goal.targetAmount, 0);

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
            Épargne
          </h1>
          <p className="text-espresso/70 dark:text-cappuccino/70">
            Vos objectifs d'épargne
          </p>
        </motion.div>

        {/* Savings Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
            Vue d'ensemble
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-sage" />
              </div>
              <p className="text-2xl font-bold text-sage">
                {totalSavings.toFixed(2)} {currency}
              </p>
              <p className="text-sm text-espresso/70 dark:text-cappuccino/70">
                Total épargné
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <SafeIcon icon={FiTarget} className="w-6 h-6 text-terracotta" />
              </div>
              <p className="text-2xl font-bold text-terracotta">
                {totalTargets.toFixed(2)} {currency}
              </p>
              <p className="text-sm text-espresso/70 dark:text-cappuccino/70">
                Objectifs totaux
              </p>
            </div>
          </div>
          
          {totalTargets > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-espresso/70 dark:text-cappuccino/70 mb-2">
                <span>Progression globale</span>
                <span>{((totalSavings / totalTargets) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-cappuccino/20 rounded-full h-2">
                <div 
                  className="h-2 bg-sage rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalSavings / totalTargets) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Add Goal Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowAddForm(true)}
          className="w-full bg-terracotta hover:bg-terracotta/90 text-white rounded-2xl p-4 mb-6 shadow-soft transition-colors flex items-center justify-center gap-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          Nouvel objectif d'épargne
        </motion.button>

        {/* Add Goal Form */}
        {showAddForm && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-espresso/30 rounded-2xl p-6 mb-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold text-espresso dark:text-cream mb-4">
              Nouvel objectif
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom de l'objectif"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                required
              />
              
              <input
                type="number"
                placeholder={`Montant cible (${currency})`}
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                step="0.01"
                min="0"
                required
              />
              
              <textarea
                placeholder="Description (optionnel)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream resize-none"
                rows="3"
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 border border-cappuccino/30 text-espresso dark:text-cream rounded-xl hover:bg-cappuccino/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Savings Goals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {savings.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiTarget} className="w-16 h-16 text-cappuccino/30 mx-auto mb-4" />
              <p className="text-espresso/70 dark:text-cappuccino/70 mb-2">
                Aucun objectif d'épargne
              </p>
              <p className="text-sm text-espresso/50 dark:text-cappuccino/50">
                Créez votre premier objectif d'épargne !
              </p>
            </div>
          ) : (
            savings.map((goal, index) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              const isCompleted = goal.currentAmount >= goal.targetAmount;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-espresso/30 rounded-2xl p-6 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-espresso dark:text-cream mb-1">
                        {goal.name}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-espresso/70 dark:text-cappuccino/70 mb-2">
                          {goal.description}
                        </p>
                      )}
                      <p className="text-sm text-espresso/70 dark:text-cappuccino/70">
                        {goal.currentAmount.toFixed(2)} {currency} / {goal.targetAmount.toFixed(2)} {currency}
                      </p>
                    </div>
                    
                    {isCompleted && (
                      <div className="bg-sage/20 text-sage px-3 py-1 rounded-full">
                        <span className="text-sm font-medium">Terminé ! 🎉</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-espresso/70 dark:text-cappuccino/70 mb-2">
                      <span>Progression</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-cappuccino/20 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-sage' : 'bg-terracotta'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="flex gap-2">
                      {showAddAmount === goal.id ? (
                        <>
                          <input
                            type="number"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            placeholder={`Montant à ajouter (${currency})`}
                            className="flex-1 px-3 py-2 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                            step="0.01"
                            min="0"
                          />
                          <button
                            onClick={() => handleAddAmount(goal.id)}
                            className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                          >
                            Ajouter
                          </button>
                          <button
                            onClick={() => setShowAddAmount(null)}
                            className="px-4 py-2 border border-cappuccino/30 text-espresso dark:text-cream rounded-lg hover:bg-cappuccino/10 transition-colors"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowAddAmount(goal.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-terracotta/10 text-terracotta rounded-lg hover:bg-terracotta/20 transition-colors"
                        >
                          <SafeIcon icon={FiPlus} className="w-4 h-4" />
                          Ajouter de l'argent
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Savings;