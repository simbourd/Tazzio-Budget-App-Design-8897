import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// Nouveau composant pour la section profil
const ProfileSection = ({ t }) => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Veuillez entrer un email' });
      return;
    }

    setStatusMessage({ type: 'loading', text: 'Mise à jour...' });
    try {
      const { error } = await updateProfile({ email });
      if (error) throw error;
      setStatusMessage({ type: 'success', text: 'Email mis à jour' });
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setStatusMessage({ type: 'loading', text: 'Mise à jour...' });
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage({ type: 'success', text: 'Mot de passe mis à jour' });
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-md font-medium text-espresso dark:text-cream">
        Profil
      </h3>

      {statusMessage && (
        <div className={`p-2 rounded-lg text-sm ${
          statusMessage.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : statusMessage.type === 'error'
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Formulaire de mise à jour de l'email */}
      <form onSubmit={handleUpdateEmail} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiIcons.FiMail} className="text-espresso/40 dark:text-cappuccino/40" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-cappuccino/30 rounded-lg dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
              placeholder="Votre email"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90"
        >
          Mettre à jour l'email
        </button>
      </form>

      {/* Formulaire de mise à jour du mot de passe */}
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiIcons.FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-cappuccino/30 rounded-lg dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
              placeholder="Mot de passe actuel"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <SafeIcon
                icon={showPassword ? FiIcons.FiEyeOff : FiIcons.FiEye}
                className="text-espresso/40 dark:text-cappuccino/40 hover:text-espresso/70 dark:hover:text-cappuccino/70"
              />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiIcons.FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-cappuccino/30 rounded-lg dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
              placeholder="Nouveau mot de passe"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-espresso dark:text-cream mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiIcons.FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-cappuccino/30 rounded-lg dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90"
        >
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  );
};

// ... reste du code du SettingsModal

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

  // ... code existant ...

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
            {/* En-tête */}
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

            {/* Contenu des réglages */}
            <div className="space-y-6">
              {/* Section Profil */}
              <ProfileSection t={t} />

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

              {/* ... autres sections existantes ... */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;