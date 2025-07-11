import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BudgetProvider } from './context/BudgetContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </AuthProvider>
  </StrictMode>
);