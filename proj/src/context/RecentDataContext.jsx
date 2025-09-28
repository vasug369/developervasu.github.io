import React, { createContext, useState } from 'react';

// Create the context
export const RecentDataContext = createContext();

// Create a provider component
export const RecentDataProvider = ({ children }) => {
  const [recent, setRecent] = useState([]);

  // Function to update recent
  const updateRecent = (newTest) => {
    setRecent((prev) => [...prev, newTest]);
  };

  return (
    <RecentDataContext.Provider value={{ recent, updateRecent }}>
      {children}
    </RecentDataContext.Provider>
  );
};
