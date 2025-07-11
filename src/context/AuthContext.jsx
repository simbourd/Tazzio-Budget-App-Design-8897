import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    try {
      // First, create user in auth system
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) throw error;

      // After successful signup, we need to initialize user settings
      // This should happen automatically when they first sign in
      // through the loadUserData function in BudgetContext
      
      return { data, error: null };
    } catch (err) {
      console.error("Signup error:", err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Signin error:", err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error("Signout error:", err);
      return { error: err };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Reset password error:", err);
      return { data: null, error: err };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!session) {
        throw new Error("Vous devez être connecté pour effectuer cette action");
      }

      const { data, error } = await supabase.auth.updateUser({
        email: updates.email
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Update profile error:", err);
      return { data: null, error: err };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      // Cette méthode utilise le nouveau mot de passe directement
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Update password error:", err);
      return { data: null, error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;