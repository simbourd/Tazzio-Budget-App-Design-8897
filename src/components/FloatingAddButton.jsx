import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

const FloatingAddButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-28 right-6 bg-terracotta hover:bg-terracotta/90 text-white p-5 rounded-full shadow-coffee z-50 transition-all duration-200"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <SafeIcon icon={FiPlus} className="w-7 h-7" />
    </motion.button>
  );
};

export default FloatingAddButton;