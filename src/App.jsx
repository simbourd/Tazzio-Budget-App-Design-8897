import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-coffee-dark' : 'bg-cream'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pb-20"
        >
          <Routes>
            <Route path="/" element={<Dashboard openSettings={() => setIsSettingsModalOpen(true)} />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </motion.div>
        <Navigation />
        <FloatingAddButton onClick={() => setIsExpenseModalOpen(true)} />
        <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
      </div>
    </Router>
  );
}

export default App;