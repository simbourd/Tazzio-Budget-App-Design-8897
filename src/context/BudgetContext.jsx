import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

// Créer le contexte
const BudgetContext = createContext();

// Hook personnalisé pour utiliser le contexte
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
    addBuyer: "Ajouter",
    logout: "Déconnexion",
    // Nouvelles traductions pour les revenus individuels
    buyerIncomes: "Revenus par personne",
    totalIncome: "Revenu total",
    buyerIncome: "Revenu",
    updateIncome: "Mettre à jour",
    // Login page translations
    login: "Se connecter",
    signup: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    forgotPassword: "Mot de passe oublié ?",
    emailPlaceholder: "email@exemple.com",
    johnDoe: "Jean Dupont",
    emailRequired: "Email requis",
    invalidEmail: "Email invalide",
    passwordRequired: "Mot de passe requis",
    passwordTooShort: "Mot de passe trop court (min. 6 caractères)",
    fullNameRequired: "Nom complet requis",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    accountCreated: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
    enterEmail: "Veuillez entrer votre email",
    resetEmailSent: "Email de réinitialisation envoyé !",
    budgetManagerSubtitle: "Votre gestionnaire de budget personnel",
    copyright: "© 2025 Tazzio Budget. Gérez votre budget avec style."
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
    addBuyer: "Add",
    logout: "Logout",
    // New translations for individual incomes
    buyerIncomes: "Income by person",
    totalIncome: "Total income",
    buyerIncome: "Income",
    updateIncome: "Update",
    // Login page translations
    login: "Log in",
    signup: "Sign up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    forgotPassword: "Forgot password?",
    emailPlaceholder: "email@example.com",
    johnDoe: "John Doe",
    emailRequired: "Email required",
    invalidEmail: "Invalid email",
    passwordRequired: "Password required",
    passwordTooShort: "Password too short (min. 6 characters)",
    fullNameRequired: "Full name required",
    passwordsDoNotMatch: "Passwords do not match",
    accountCreated: "Account successfully created! You can now log in.",
    enterEmail: "Please enter your email",
    resetEmailSent: "Password reset email sent!",
    budgetManagerSubtitle: "Your personal budget manager",
    copyright: "© 2025 Tazzio Budget. Manage your budget with style."
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
    addBuyer: "Añadir",
    logout: "Cerrar sesión",
    // Nuevas traducciones para los ingresos individuales
    buyerIncomes: "Ingresos por persona",
    totalIncome: "Ingreso total",
    buyerIncome: "Ingreso",
    updateIncome: "Actualizar",
    // Login page translations
    login: "Iniciar sesión",
    signup: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    fullName: "Nombre completo",
    forgotPassword: "¿Olvidó su contraseña?",
    emailPlaceholder: "correo@ejemplo.com",
    johnDoe: "Juan Pérez",
    emailRequired: "Correo electrónico requerido",
    invalidEmail: "Correo electrónico inválido",
    passwordRequired: "Contraseña requerida",
    passwordTooShort: "Contraseña demasiado corta (mín. 6 caracteres)",
    fullNameRequired: "Nombre completo requerido",
    passwordsDoNotMatch: "Las contraseñas no coinciden",
    accountCreated: "¡Cuenta creada con éxito! Ahora puede iniciar sesión.",
    enterEmail: "Por favor, introduzca su correo electrónico",
    resetEmailSent: "¡Correo de restablecimiento enviado!",
    budgetManagerSubtitle: "Su gestor de presupuesto personal",
    copyright: "© 2025 Tazzio Budget. Gestione su presupuesto con estilo."
  }
};

const dateLocales = {
  fr,
  en: enUS,
  es
};

// Default data
const defaultCategories = [
  { id: '1', name: 'Alimentation', icon: '🍔', color: '#FF9800' },
  { id: '2', name: 'Transport', icon: '🚗', color: '#2196F3' },
  { id: '3', name: 'Logement', icon: '🏠', color: '#4CAF50' },
  { id: '4', name: 'Loisirs', icon: '🎬', color: '#9C27B0' },
  { id: '5', name: 'Santé', icon: '💊', color: '#F44336' },
  { id: '6', name: 'Shopping', icon: '🛍️', color: '#E91E63' },
  { id: '7', name: 'Factures', icon: '📝', color: '#607D8B' },
  { id: '8', name: 'Autres', icon: '📦', color: '#795548' }
];

const defaultBuyers = [
  { id: '1', name: 'Moi' },
  { id: '2', name: 'Partenaire' }
];

// Revenus par défaut pour les acheteurs
const defaultBuyerIncomes = {
  '1': 1200, // Revenu par défaut pour "Moi"
  '2': 800   // Revenu par défaut pour "Partenaire"
};

// Provider component
export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();

  // State pour les données utilisateur
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('€');
  const [income, setIncome] = useState(2000);
  const [buyerIncomes, setBuyerIncomes] = useState(defaultBuyerIncomes);
  const [categories, setCategories] = useState(defaultCategories);
  const [buyers, setBuyers] = useState(defaultBuyers);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les données utilisateur depuis Supabase
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Fonction pour charger les données utilisateur
  const loadUserData = async () => {
    try {
      setLoading(true);

      // Vérifier si les paramètres utilisateur existent déjà
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings_7k8m3n')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error loading settings:', settingsError);
        // Si la table n'existe pas, initialiser avec les valeurs par défaut
        await initializeUserData();
      }

      // Si les paramètres existent, les appliquer
      if (settings) {
        setLanguage(settings.language || 'fr');
        setCurrency(settings.currency || '€');
        setIncome(settings.income || 2000);
        setBuyerIncomes(settings.buyer_incomes || defaultBuyerIncomes);
        setCategories(settings.categories || defaultCategories);
        setBuyers(settings.buyers || defaultBuyers);
        setBudgets(settings.budgets || {});
        setSavings(settings.savings || []);
      } else {
        // Sinon, initialiser avec les valeurs par défaut
        await initializeUserData();
      }

      // Charger les dépenses
      await refreshExpenses();
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialiser les données utilisateur
  const initializeUserData = async () => {
    if (!user) return;

    try {
      // Créer les paramètres par défaut
      const defaultSettings = {
        user_id: user.id,
        language: 'fr',
        currency: '€',
        income: 2000,
        buyer_incomes: defaultBuyerIncomes,
        categories: defaultCategories,
        buyers: defaultBuyers,
        budgets: {},
        savings: []
      };

      const { error: insertError } = await supabase
        .from('user_settings_7k8m3n')
        .insert([defaultSettings]);

      if (insertError) {
        console.error('Error creating default settings:', insertError);
      } else {
        // Appliquer les paramètres par défaut
        setLanguage('fr');
        setCurrency('€');
        setIncome(2000);
        setBuyerIncomes(defaultBuyerIncomes);
        setCategories(defaultCategories);
        setBuyers(defaultBuyers);
        setBudgets({});
        setSavings([]);
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  // Sauvegarder les paramètres utilisateur
  const saveUserSettings = async (updates) => {
    if (!user) return false;

    try {
      console.log("Saving user settings:", updates);
      const { data, error } = await supabase
        .from('user_settings_7k8m3n')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving settings:', error);
        return false;
      }
      console.log("Settings saved successfully");
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  // Rafraîchir les dépenses
  const refreshExpenses = async () => {
    if (!user) return;

    try {
      console.log('Fetching expenses for user:', user.id);
      const { data, error } = await supabase
        .from('user_expenses_7k8m3n')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      console.log('Fetched expenses:', data);
      if (data) {
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error in refreshExpenses:', error);
    }
  };

  // Ajouter une dépense
  const addExpense = async (expense) => {
    if (!user) return false;

    try {
      const newExpense = {
        user_id: user.id,
        amount: parseFloat(expense.amount),
        category: expense.category,
        description: expense.description || '',
        buyer_id: expense.buyerId,
        date: expense.date || new Date().toISOString().split('T')[0]
      };

      console.log('Adding expense:', newExpense);
      const { data, error } = await supabase
        .from('user_expenses_7k8m3n')
        .insert([newExpense])
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting expense:', error);
        return false;
      }

      console.log('Expense added successfully:', data);
      await refreshExpenses();
      return true;
    } catch (error) {
      console.error('Error in addExpense:', error);
      return false;
    }
  };

  // Supprimer une dépense
  const deleteExpense = async (id) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_expenses_7k8m3n')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense:', error);
        return false;
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      return true;
    } catch (error) {
      console.error('Error in deleteExpense:', error);
      return false;
    }
  };

  // Mettre à jour la langue
  const updateLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    if (user) {
      return await saveUserSettings({ language: newLanguage });
    }
    return true;
  };

  // Mettre à jour la devise
  const updateCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    return await saveUserSettings({ currency: newCurrency });
  };

  // Mettre à jour les revenus
  const updateIncome = async (newIncome) => {
    setIncome(newIncome);
    return await saveUserSettings({ income: newIncome });
  };

  // Mettre à jour le revenu d'un acheteur spécifique
  const updateBuyerIncome = async (buyerId, newIncome) => {
    const newBuyerIncomes = { ...buyerIncomes, [buyerId]: parseFloat(newIncome) };
    setBuyerIncomes(newBuyerIncomes);
    
    // Calculer le nouveau revenu total
    const totalIncome = Object.values(newBuyerIncomes).reduce((sum, income) => sum + income, 0);
    setIncome(totalIncome);
    
    return await saveUserSettings({ 
      buyer_incomes: newBuyerIncomes,
      income: totalIncome 
    });
  };

  // Mettre à jour le budget d'une catégorie
  const updateBudget = async (categoryId, amount) => {
    const newBudgets = { ...budgets, [categoryId]: amount };
    setBudgets(newBudgets);
    return await saveUserSettings({ budgets: newBudgets });
  };

  // Ajouter un acheteur
  const addBuyer = async (name) => {
    const newBuyerId = Math.random().toString(36).substr(2, 9);
    const newBuyer = { id: newBuyerId, name };
    const newBuyers = [...buyers, newBuyer];
    
    // Ajouter un revenu par défaut pour le nouvel acheteur
    const newBuyerIncomes = { ...buyerIncomes, [newBuyerId]: 0 };
    
    setBuyers(newBuyers);
    setBuyerIncomes(newBuyerIncomes);
    
    return await saveUserSettings({ 
      buyers: newBuyers,
      buyer_incomes: newBuyerIncomes
    });
  };

  // Supprimer un acheteur
  const removeBuyer = async (id) => {
    const newBuyers = buyers.filter(buyer => buyer.id !== id);
    
    // Supprimer le revenu de l'acheteur
    const newBuyerIncomes = { ...buyerIncomes };
    delete newBuyerIncomes[id];
    
    // Recalculer le revenu total
    const totalIncome = Object.values(newBuyerIncomes).reduce((sum, income) => sum + income, 0);
    
    setBuyers(newBuyers);
    setBuyerIncomes(newBuyerIncomes);
    setIncome(totalIncome);
    
    return await saveUserSettings({ 
      buyers: newBuyers,
      buyer_incomes: newBuyerIncomes,
      income: totalIncome
    });
  };

  // Mettre à jour un acheteur
  const updateBuyer = async (id, name) => {
    const newBuyers = buyers.map(buyer =>
      buyer.id === id ? { ...buyer, name } : buyer
    );
    setBuyers(newBuyers);
    return await saveUserSettings({ buyers: newBuyers });
  };

  // Ajouter un objectif d'épargne
  const addSavingsGoal = async (goal) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    const newSavings = [...savings, newGoal];
    setSavings(newSavings);
    return await saveUserSettings({ savings: newSavings });
  };

  // Mettre à jour un objectif d'épargne
  const updateSavingsGoal = async (goalId, amount) => {
    const newSavings = savings.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, currentAmount: goal.currentAmount + amount };
      }
      return goal;
    });
    setSavings(newSavings);
    return await saveUserSettings({ savings: newSavings });
  };

  // Supprimer un objectif d'épargne
  const removeSavingsGoal = async (goalId) => {
    const newSavings = savings.filter(goal => goal.id !== goalId);
    setSavings(newSavings);
    return await saveUserSettings({ savings: newSavings });
  };

  // Obtenir les dépenses du mois en cours
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

  // Obtenir le total des dépenses du mois en cours
  const getTotalExpensesThisMonth = () => {
    return getCurrentMonthExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  // Obtenir les dépenses par catégorie
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

  // Obtenir les dépenses par acheteur
  const getExpensesByBuyer = () => {
    const expensesByBuyer = {};
    getCurrentMonthExpenses().forEach(expense => {
      if (!expensesByBuyer[expense.buyer_id]) {
        expensesByBuyer[expense.buyer_id] = 0;
      }
      expensesByBuyer[expense.buyer_id] += expense.amount;
    });
    return expensesByBuyer;
  };

  // Formater un montant
  const formatAmount = (amount) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  // Formater une date
  const formatDate = (date) => {
    return format(new Date(date), 'EEEE d MMMM yyyy', { locale: dateLocales[language] });
  };

  // Formater une date courte
  const formatShortDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Obtenir le nom d'une catégorie
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // Traduire une clé
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <BudgetContext.Provider value={{
      language,
      setLanguage: updateLanguage,
      currency,
      setCurrency: updateCurrency,
      income,
      setIncome: updateIncome,
      buyerIncomes,
      updateBuyerIncome,
      categories,
      setCategories,
      buyers,
      setBuyers,
      expenses,
      addExpense,
      deleteExpense,
      refreshExpenses,
      budgets,
      updateBudget,
      savings,
      addSavingsGoal,
      updateSavingsGoal,
      removeSavingsGoal,
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
      updateBuyer,
      loading
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;