// authContext.js
import React, { createContext, useState } from 'react';

// Create the auth context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [isAuth, setAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};