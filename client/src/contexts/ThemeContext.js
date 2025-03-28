import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Theme Context
const ThemeContext = createContext();

// Custom hook to use the Theme Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a saved preference in localStorage
  const savedMode = localStorage.getItem("themeMode");
  const [mode, setMode] = useState(savedMode || "light");

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  // Provide theme context values
  const value = {
    mode,
    toggleTheme,
    isDarkMode: mode === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
