import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSettings, FiSun, FiMoon, FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiTrash2, FiPlus, FiSave, FiLogOut, FiDollarSign } = FiIcons;

// Composant pour la section profil
const ProfileSection = ({ t }) => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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
      setStatusMessage({ type: 'success', text: 'Email mis à jour avec succès' });
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Error updating email:", error);
      setStatusMessage({ type: 'error', text: error.message || "Erreur lors de la mise à jour de l'email" });
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
      // Utiliser le mot de passe actuel pour la vérification
      const { error } = await updatePassword(currentPassword, newPassword);
      if (error) throw error;
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      setIsEditingPassword(false);
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.message.includes("session")) {
        setStatusMessage({ type: 'error', text: 'Session expirée, veuillez vous reconnecter' });
      } else {
        setStatusMessage({ type: 'error', text: error.message || "Erreur lors de la mise à jour du mot de passe" });
      }
    }
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SafeIcon icon={FiUser} className="w-6 h-6 text-terracotta" />
        <h3 className="text-lg font-medium text-espresso dark:text-cream">
          Profil
        </h3>
      </div>

      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3 rounded-xl text-sm ${
            statusMessage.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : statusMessage.type === 'error'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
          }`}
        >
          {statusMessage.text}
        </motion.div>
      )}

      {/* Section Email */}
      <div className="bg-cappuccino/10 dark:bg-espresso/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-espresso dark:text-cream">Adresse email</h4>
          <button
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            className="text-terracotta hover:bg-terracotta/10 p-3 rounded-lg transition-colors"
          >
            <SafeIcon icon={isEditingEmail ? FiX : FiMail} className="w-5 h-5" />
          </button>
        </div>

        {isEditingEmail ? (
          <form onSubmit={handleUpdateEmail} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiMail} className="text-espresso/40 dark:text-cappuccino/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                placeholder="Votre nouvel email"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                Mettre à jour
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingEmail(false);
                  setEmail(user?.email || '');
                }}
                className="flex-1 px-4 py-3 border border-cappuccino/30 text-espresso dark:text-cream rounded-lg hover:bg-cappuccino/10 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiMail} className="w-5 h-5 text-espresso/40 dark:text-cappuccino/40" />
            <span className="text-espresso dark:text-cream">{user?.email}</span>
          </div>
        )}
      </div>

      {/* Section Mot de passe */}
      <div className="bg-cappuccino/10 dark:bg-espresso/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-espresso dark:text-cream">Mot de passe</h4>
          <button
            onClick={() => setIsEditingPassword(!isEditingPassword)}
            className="text-terracotta hover:bg-terracotta/10 p-3 rounded-lg transition-colors"
          >
            <SafeIcon icon={isEditingPassword ? FiX : FiLock} className="w-5 h-5" />
          </button>
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                placeholder="Mot de passe actuel"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <SafeIcon
                  icon={showPassword ? FiEyeOff : FiEye}
                  className="w-5 h-5 text-espresso/40 dark:text-cappuccino/40 hover:text-espresso/70 dark:hover:text-cappuccino/70"
                />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                placeholder="Nouveau mot de passe"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-espresso/40 dark:text-cappuccino/40" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                placeholder="Confirmer le nouveau mot de passe"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                Changer le mot de passe
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="flex-1 px-4 py-3 border border-cappuccino/30 text-espresso dark:text-cream rounded-lg hover:bg-cappuccino/10 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiLock} className="w-5 h-5 text-espresso/40 dark:text-cappuccino/40" />
            <span className="text-espresso/70 dark:text-cappuccino/70">••••••••</span>
          </div>
        )}
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
    updateBuyer,
    buyerIncomes,
    updateBuyerIncome
  } = useBudget();
  const { signOut } = useAuth();

  const [newBuyerName, setNewBuyerName] = useState('');
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [editingBuyerName, setEditingBuyerName] = useState('');
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingIncomeValue, setEditingIncomeValue] = useState('');

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
    { code: 'CAD', symbol: 'C$', name: 'Dollar Canadien' },
    { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse' }
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const handleAddBuyer = async (e) => {
    e.preventDefault();
    if (!newBuyerName.trim()) return;
    await addBuyer(newBuyerName.trim());
    setNewBuyerName('');
  };

  const handleUpdateBuyer = async (id) => {
    if (!editingBuyerName.trim()) return;
    await updateBuyer(id, editingBuyerName.trim());
    setEditingBuyer(null);
    setEditingBuyerName('');
  };

  const handleUpdateBuyerIncome = async (id) => {
    if (!editingIncomeValue.trim()) return;
    await updateBuyerIncome(id, editingIncomeValue.trim());
    setEditingIncome(null);
    setEditingIncomeValue('');
  };

  const handleDeleteBuyer = async (id) => {
    if (buyers.length <= 1) {
      alert('Vous devez avoir au moins un acheteur');
      return;
    }
    if (window.confirm(t('confirmDeleteBuyer'))) {
      await removeBuyer(id);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await signOut();
      onClose();
    }
  };

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
                <SafeIcon icon={FiSettings} className="w-7 h-7 text-terracotta" />
                <h2 className="text-xl font-semibold text-espresso dark:text-cream">
                  {t('settings')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-cappuccino/10 rounded-full transition-colors"
              >
                <SafeIcon icon={FiX} className="w-6 h-6 text-espresso dark:text-cream" />
              </button>
            </div>

            {/* Contenu des réglages */}
            <div className="space-y-6">
              {/* Section Profil */}
              <ProfileSection t={t} />

              {/* Section Thème */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <SafeIcon
                    icon={isDarkMode ? FiMoon : FiSun}
                    className="w-6 h-6 text-terracotta"
                  />
                  <h3 className="text-lg font-medium text-espresso dark:text-cream">
                    {t('theme')}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleTheme(false)}
                    className={`p-4 rounded-xl border transition-all ${
                      !isDarkMode
                        ? 'border-terracotta bg-terracotta/10 text-terracotta'
                        : 'border-cappuccino/30 dark:border-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <SafeIcon icon={FiSun} className="w-5 h-5" />
                      <span className="text-sm">{t('lightMode')}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => toggleTheme(true)}
                    className={`p-4 rounded-xl border transition-all ${
                      isDarkMode
                        ? 'border-terracotta bg-terracotta/10 text-terracotta'
                        : 'border-cappuccino/30 text-espresso hover:bg-cappuccino/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <SafeIcon icon={FiMoon} className="w-5 h-5" />
                      <span className="text-sm">{t('darkMode')}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section Devise */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-espresso dark:text-cream">
                  {t('currency')}
                </h3>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-4 border border-cappuccino/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream text-base"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.symbol}>
                      {curr.symbol} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Langue */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-espresso dark:text-cream">
                  {t('language')}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-4 rounded-xl border transition-all ${
                        language === lang.code
                          ? 'border-terracotta bg-terracotta/10 text-terracotta'
                          : 'border-cappuccino/30 dark:border-cappuccino/20 text-espresso dark:text-cream hover:bg-cappuccino/10'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{lang.flag}</div>
                        <div className="text-xs">{lang.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Acheteurs et leurs revenus */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-espresso dark:text-cream">
                  {t('manageBuyers')}
                </h3>

                {/* Ajouter un acheteur */}
                <form onSubmit={handleAddBuyer} className="flex gap-2">
                  <input
                    type="text"
                    value={newBuyerName}
                    onChange={(e) => setNewBuyerName(e.target.value)}
                    placeholder={t('newBuyer')}
                    className="flex-1 px-4 py-3 border border-cappuccino/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                  </button>
                </form>

                {/* Titre pour les revenus */}
                <div className="mt-4 mb-2">
                  <h4 className="font-medium text-espresso dark:text-cream">
                    {t('buyerIncomes')}
                  </h4>
                </div>

                {/* Liste des acheteurs avec leurs revenus */}
                <div className="space-y-2">
                  {buyers.map(buyer => (
                    <div key={buyer.id} className="bg-cappuccino/10 dark:bg-espresso/20 rounded-lg">
                      {/* Nom de l'acheteur */}
                      <div className="flex items-center gap-2 p-4 border-b border-cappuccino/20 dark:border-espresso/50">
                        {editingBuyer === buyer.id ? (
                          <>
                            <input
                              type="text"
                              value={editingBuyerName}
                              onChange={(e) => setEditingBuyerName(e.target.value)}
                              className="flex-1 px-3 py-2 border border-cappuccino/30 rounded focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                            />
                            <button
                              onClick={() => handleUpdateBuyer(buyer.id)}
                              className="p-2 text-sage hover:bg-sage/10 rounded"
                            >
                              <SafeIcon icon={FiSave} className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingBuyer(null);
                                setEditingBuyerName('');
                              }}
                              className="p-2 text-terracotta hover:bg-terracotta/10 rounded"
                            >
                              <SafeIcon icon={FiX} className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-espresso dark:text-cream font-medium">
                              {buyer.name}
                            </span>
                            <button
                              onClick={() => {
                                setEditingBuyer(buyer.id);
                                setEditingBuyerName(buyer.name);
                              }}
                              className="p-2 text-terracotta hover:bg-terracotta/10 rounded"
                            >
                              <SafeIcon icon={FiSettings} className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBuyer(buyer.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                            >
                              <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Revenu de l'acheteur */}
                      <div className="flex items-center gap-2 p-4">
                        <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-sage" />
                        
                        {editingIncome === buyer.id ? (
                          <>
                            <input
                              type="number"
                              value={editingIncomeValue}
                              onChange={(e) => setEditingIncomeValue(e.target.value)}
                              className="flex-1 px-3 py-2 border border-cappuccino/30 rounded focus:outline-none focus:ring-2 focus:ring-terracotta/50 dark:bg-espresso dark:border-cappuccino/20 dark:text-cream"
                              placeholder={`${t('buyerIncome')} (${currency})`}
                              step="0.01"
                              min="0"
                            />
                            <button
                              onClick={() => handleUpdateBuyerIncome(buyer.id)}
                              className="p-2 text-sage hover:bg-sage/10 rounded"
                            >
                              <SafeIcon icon={FiSave} className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingIncome(null);
                                setEditingIncomeValue('');
                              }}
                              className="p-2 text-terracotta hover:bg-terracotta/10 rounded"
                            >
                              <SafeIcon icon={FiX} className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-espresso dark:text-cream">
                              {t('buyerIncome')}: {(buyerIncomes[buyer.id] || 0).toFixed(2)} {currency}
                            </span>
                            <button
                              onClick={() => {
                                setEditingIncome(buyer.id);
                                setEditingIncomeValue((buyerIncomes[buyer.id] || 0).toString());
                              }}
                              className="p-2 text-terracotta hover:bg-terracotta/10 rounded"
                            >
                              <SafeIcon icon={FiSettings} className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Déconnexion */}
              <div className="pt-4 border-t border-cappuccino/30 dark:border-cappuccino/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="w-6 h-6" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;