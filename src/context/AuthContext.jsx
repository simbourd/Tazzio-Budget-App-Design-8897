// ... code existant ...

// Ajoutez ces nouvelles fonctions dans le AuthProvider
const updateProfile = async (updates) => {
  try {
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

const updatePassword = async (newPassword) => {
  try {
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

// Ajoutez ces nouvelles fonctions dans la valeur du contexte
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

// ... reste du code existant ...