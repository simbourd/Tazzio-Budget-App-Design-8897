import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';

// Créer le contexte
const BudgetContext = createContext();

// Export du hook personnalisé
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

// Traductions
const translations = {
  fr: {
    home: "Accueil",
    expenses: "Dépenses",
    budget: "Budget",
    savings: "Épargne",
    reports: "Rapports",
    settings: "Paramètres",
    overview: "Vue d'ensemble",
    income: "Revenus",
    spent: "Dépensé",
    remaining: "Restant",
    progress: "Progression",
    expenseDistribution: "Répartition des dépenses",
    recentExpenses: "Dépenses récentes",
    economiesTitle: "Économies",
    averagePerDay: "Moy. journalière",
    apply: "Appliquer",
    cancel: "Annuler",
    add: "Ajouter",
    newExpense: "Nouvelle dépense",
    amount: "Montant",
    category: "Catégorie",
    description: "Description",
    date: "Date",
    expenseDescription: "Description de la dépense",
    selectCategory: "Sélectionner une catégorie",
    theme: "Thème",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    currency: "Devise",
    language: "Langue",
    expensesByBuyer: "Dépenses par acheteur",
    buyer: "Acheteur",
    manageBuyers: "Gérer les acheteurs",
    confirmDeleteBuyer: "Êtes-vous sûr de vouloir supprimer cet acheteur ?",
    newBuyer: "Nouvel acheteur",
    addBuyer: "Ajouter"
  },
  en: {
    home: "Home",
    expenses: "Expenses",
    budget: "Budget",
    savings: "Savings",
    reports: "Reports",
    settings: "Settings",
    overview: "Overview",
    income: "Income",
    spent: "Spent",
    remaining: "Remaining",
    progress: "Progress",
    expenseDistribution: "Expense Distribution",
    recentExpenses: "Recent Expenses",
    economiesTitle: "Savings",
    averagePerDay: "Daily average",
    apply: "Apply",
    cancel: "Cancel",
    add: "Add",
    newExpense: "New Expense",
    amount: "Amount",
    category: "Category",
    description: "Description",
    date: "Date",
    expenseDescription: "Expense description",
    selectCategory: "Select a category",
    theme: "Theme",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    currency: "Currency",
    language: "Language",
    expensesByBuyer: "Expenses by buyer",
    buyer: "Buyer",
    manageBuyers: "Manage buyers",
    confirmDeleteBuyer: "Are you sure you want to delete this buyer?",
    newBuyer: "New buyer",
    addBuyer: "Add"
  },
  es: {
    home: "Inicio",
    expenses: "Gastos",
    budget: "Presupuesto",
    savings: "Ahorros",
    reports: "Informes",
    settings: "Ajustes",
    overview: "Resumen",
    income: "Ingresos",
    spent: "Gastado",
    remaining: "Restante",
    progress: "Progreso",
    expenseDistribution: "Distribución de gastos",
    recentExpenses: "Gastos recientes",
    economiesTitle: "Ahorros",
    averagePerDay: "Promedio diario",
    apply: "Aplicar",
    cancel: "Cancelar",
    add: "Añadir",
    newExpense: "Nuevo gasto",
    amount: "Importe",
    category: "Categoría",
    description: "Descripción",
    date: "Fecha",
    expenseDescription: "Descripción del gasto",
    selectCategory: "Seleccionar una categoría",
    theme: "Tema",
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
    currency: "Moneda",
    language: "Idioma",
    expensesByBuyer: "Gastos por comprador",
    buyer: "Comprador",
    manageBuyers: "Gestionar compradores",
    confirmDeleteBuyer: "¿Está seguro que desea eliminar este comprador?",
    newBuyer: "Nuevo comprador",
    addBuyer: "Añadir"
  }
};

const dateLocales = {
  fr,
  en: enUS,
  es
};

// Provider component
export const BudgetProvider = ({ children }) => {
  // State pour la langue
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('tazzio-language') || 'fr';
  });

  // State pour la devise
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('tazzio-currency') || '€';
  });

  // State pour le revenu mensuel
  const [income, setIncome] = useState(() => {
    const savedIncome = localStorage.getItem('tazzio-income');
    return savedIncome ? parseFloat(savedIncome) : 2000;
  });

  // State pour les catégories
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('tazzio-categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      { id: '1', name: 'Alimentation', icon: '🍔', color: '#FF9800' },
      { id: '2', name: 'Transport', icon: '🚗', color: '#2196F3' },
      { id: '3', name: 'Logement', icon: '🏠', color: '#4CAF50' },
      { id: '4', name: 'Loisirs', icon: '🎬', color: '#9C27B0' },
      { id: '5', name: 'Santé', icon: '💊', color: '#F44336' },
      { id: '6', name: 'Shopping', icon: '🛍️', color: '#E91E63' },
      { id: '7', name: 'Factures', icon: '📝', color: '#607D8B' },
      { id: '8', name: 'Autres', icon: '📦', color: '#795548' }
    ];
  });

  // State pour les acheteurs
  const [buyers, setBuyers] = useState(() => {
    const savedBuyers = localStorage.getItem('tazzio-buyers');
    return savedBuyers ? JSON.parse(savedBuyers) : [
      { id: '1', name: 'Moi' },
      { id: '2', name: 'Partenaire' }
    ];
  });

  // State pour les dépenses
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('tazzio-expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // State pour les budgets par catégorie
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('tazzio-budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : {};
  });

  // State pour les objectifs d'épargne
  const [savings, setSavings] = useState(() => {
    const savedSavings = localStorage.getItem('tazzio-savings');
    return savedSavings ? JSON.parse(savedSavings) : [];
  });

  // Sauvegarde dans le localStorage lorsque les states changent
  useEffect(() => {
    localStorage.setItem('tazzio-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('tazzio-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('tazzio-income', income.toString());
  }, [income]);

  useEffect(() => {
    localStorage.setItem('tazzio-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tazzio-buyers', JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem('tazzio-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('tazzio-budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('tazzio-savings', JSON.stringify(savings));
  }, [savings]);

  // Fonction pour ajouter une dépense
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  // Fonction pour supprimer une dépense
  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Fonction pour mettre à jour un budget
  const updateBudget = (categoryId, amount) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: amount
    }));
  };

  // Fonction pour ajouter un objectif d'épargne
  const addSavingsGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    setSavings(prev => [...prev, newGoal]);
  };

  // Fonction pour mettre à jour un objectif d'épargne
  const updateSavingsGoal = (goalId, amount) => {
    setSavings(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + amount
        };
      }
      return goal;
    }));
  };

  // Fonction pour ajouter un acheteur
  const addBuyer = (name) => {
    const newBuyer = {
      id: Math.random().toString(36).substr(2, 9),
      name
    };
    setBuyers(prev => [...prev, newBuyer]);
  };

  // Fonction pour supprimer un acheteur
  const removeBuyer = (id) => {
    setBuyers(prev => prev.filter(buyer => buyer.id !== id));
  };

  // Fonction pour mettre à jour un acheteur
  const updateBuyer = (id, name) => {
    setBuyers(prev => prev.map(buyer => {
      if (buyer.id === id) {
        return { ...buyer, name };
      }
      return buyer;
    }));
  };

  // Fonction pour obtenir les dépenses du mois en cours
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    return expenses
      .filter(expense => {
        return expense.date >= firstDayOfMonth && expense.date <= lastDayOfMonth;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Fonction pour obtenir le total des dépenses du mois en cours
  const getTotalExpensesThisMonth = () => {
    return getCurrentMonthExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  // Fonction pour obtenir les dépenses par catégorie
  const getExpensesByCategory = () => {
    const expensesByCategory = {};
    getCurrentMonthExpenses().forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });
    return expensesByCategory;
  };

  // Fonction pour obtenir les dépenses par acheteur
  const getExpensesByBuyer = () => {
    const expensesByBuyer = {};
    getCurrentMonthExpenses().forEach(expense => {
      if (!expensesByBuyer[expense.buyerId]) {
        expensesByBuyer[expense.buyerId] = 0;
      }
      expensesByBuyer[expense.buyerId] += expense.amount;
    });
    return expensesByBuyer;
  };

  // Fonction pour formater un montant
  const formatAmount = (amount) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  // Fonction pour formater une date
  const formatDate = (date) => {
    return format(new Date(date), 'EEEE d MMMM yyyy', { locale: dateLocales[language] });
  };

  // Fonction pour formater une date court
  const formatShortDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Fonction pour obtenir le nom d'une catégorie
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // Fonction de traduction
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <BudgetContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        income,
        setIncome,
        categories,
        setCategories,
        buyers,
        setBuyers,
        expenses,
        addExpense,
        deleteExpense,
        budgets,
        updateBudget,
        savings,
        addSavingsGoal,
        updateSavingsGoal,
        getCurrentMonthExpenses,
        getTotalExpensesThisMonth,
        getExpensesByCategory,
        getExpensesByBuyer,
        formatAmount,
        formatDate,
        formatShortDate,
        getCategoryName,
        t,
        addBuyer,
        removeBuyer,
        updateBuyer
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;