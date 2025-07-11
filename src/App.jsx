import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthWrapper from './components/AuthWrapper';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Savings from './pages/Savings';
import Reports from './pages/Reports';
import Navigation from './components/Navigation';
import FloatingAddButton from './components/FloatingAddButton';
import AddExpenseModal from './components/AddExpenseModal';
import SettingsModal from './components/SettingsModal';
import './App.css';

function App() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('tazzio-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = (darkMode) => {
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('tazzio-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('tazzio-theme', 'light');
    }
  };

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setExpenseToEdit(null);
  };

  return (
    <Router>
      <AuthWrapper>
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-coffee-dark' : 'bg-cream'} pb-24`}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard openSettings={() => setIsSettingsModalOpen(true)} />} />
              <Route path="/expenses" element={<Expenses onEditExpense={handleEditExpense} />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </motion.div>
          <Navigation />
          <FloatingAddButton onClick={() => {
            setExpenseToEdit(null);
            setIsExpenseModalOpen(true);
          }} />
          <AddExpenseModal 
            isOpen={isExpenseModalOpen} 
            onClose={handleCloseExpenseModal} 
            expenseToEdit={expenseToEdit}
          />
          <SettingsModal 
            isOpen={isSettingsModalOpen} 
            onClose={() => setIsSettingsModalOpen(false)} 
            toggleTheme={toggleTheme} 
            isDarkMode={isDarkMode} 
          />
        </div>
      </AuthWrapper>
    </Router>
  );
}

export default App;