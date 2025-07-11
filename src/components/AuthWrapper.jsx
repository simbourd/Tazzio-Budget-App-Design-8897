import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import { motion } from 'framer-motion';

const AuthWrapper = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-coffee-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-espresso dark:text-cream">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return children;
};

export default AuthWrapper;