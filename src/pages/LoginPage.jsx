import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCoffee, FiArrowRight } = FiIcons;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const { signIn, signUp, resetPassword } = useAuth();
  const { language, setLanguage, t } = useBudget();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t('emailRequired') || 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail') || 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired') || 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordTooShort') || 'Mot de passe trop court (min. 6 caractères)';
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = t('fullNameRequired') || 'Nom complet requis';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('passwordsDoNotMatch') || 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      } else {
        console.log("Attempting signup with:", formData.email, formData.password);
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) throw error;
        
        // On successful signup
        alert(t('accountCreated') || 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true);
        setFormData({...formData, password: '', confirmPassword: ''});
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: t('enterEmail') || 'Veuillez entrer votre email' });
      return;
    }
    
    try {
      const { error } = await resetPassword(formData.email);
      if (error) throw error;
      alert(t('resetEmailSent') || 'Email de réinitialisation envoyé !');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <SafeIcon icon={FiCoffee} className="w-12 h-12 text-terracotta" />
            <h1 className="text-3xl font-bold text-espresso dark:text-cream">Tazzio</h1>
          </div>
          <p className="text-espresso/70 dark:text-cappuccino/70">
            {t('budgetManagerSubtitle') || 'Votre gestionnaire de budget personnel'}
          </p>

          {/* Language Selector */}
          <div className="mt-4 flex justify-center gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-2 rounded-xl transition-all ${
                  language === lang.code
                    ? 'bg-terracotta/20 text-terracotta'
                    : 'hover:bg-cappuccino/10 text-espresso/70 dark:text-cappuccino/70'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-espresso/30 rounded-3xl p-8 shadow-soft"
        >
          <div className="flex justify-center mb-6">
            <div className="flex bg-cappuccino/20 dark:bg-espresso p-1 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  isLogin
                    ? 'bg-white dark:bg-terracotta text-espresso dark:text-cream shadow-sm'
                    : 'text-espresso/70 dark:text-cappuccino/70'
                }`}
              >
                {t('login') || 'Connexion'}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  !isLogin
                    ? 'bg-white dark:bg-terracotta text-espresso dark:text-cream shadow-sm'
                    : 'text-espresso/70 dark:text-cappuccino/70'
                }`}
              >
                {t('signup') || 'Inscription'}
              </button>
            </div>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('fullName') || 'Nom complet'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiUser} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.fullName ? 'border-red-500' : 'border-cappuccino/30 dark:border-cappuccino/20'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:text-cream`}
                    placeholder={t('johnDoe') || "John Doe"}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                {t('email') || 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="text-espresso/40 dark:text-cappuccino/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-cappuccino/30 dark:border-cappuccino/20'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:text-cream`}
                  placeholder={t('emailPlaceholder') || "email@exemple.com"}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('password') || 'Mot de passe'}
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-terracotta hover:underline"
                  >
                    {t('forgotPassword') || 'Mot de passe oublié ?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-cappuccino/30 dark:border-cappuccino/20'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:text-cream`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <SafeIcon
                    icon={showPassword ? FiEyeOff : FiEye}
                    className="text-espresso/40 dark:text-cappuccino/40 hover:text-espresso/70 dark:hover:text-cappuccino/70"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
                  {t('confirmPassword') || 'Confirmer le mot de passe'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-cappuccino/30 dark:border-cappuccino/20'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:text-cream`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? (t('login') || 'Se connecter') : (t('signup') || "S'inscrire")}
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-sm text-espresso/60 dark:text-cappuccino/60"
        >
          <p>{t('copyright') || '© 2025 Tazzio Budget. Gérez votre budget avec style.'}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;