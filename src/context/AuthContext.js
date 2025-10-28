import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('expenseTracker_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('expenseTracker_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData.rememberMe) {
      localStorage.setItem('expenseTracker_user', JSON.stringify(userData));
    }
  };

  const updateProfile = (profileData) => {
    const updatedUser = {
      ...user,
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    setUser(updatedUser);
    localStorage.setItem('expenseTracker_user', JSON.stringify(updatedUser));
  };

  const setCurrency = (currencyCode) => {
    const updatedUser = {
      ...user,
      currency: currencyCode
    };
    setUser(updatedUser);
    localStorage.setItem('expenseTracker_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expenseTracker_user');
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    setCurrency,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
