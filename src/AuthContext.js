import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    userId: null,
  });

  const login = (token, userId) => {
    setAuthState({
      isAuthenticated: true,
      token,
      userId,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      token: null,
      userId: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};