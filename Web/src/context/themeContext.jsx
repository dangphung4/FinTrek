import React, { createContext, useContext, useState } from "react";

// Create the ThemeContext
const ThemeContext = createContext();

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState("dark"); // Track light or dark mode

    // Function to set the color mode explicitly
    const setColorMode = (mode) => setThemeMode(mode);

    return (
        <ThemeContext.Provider value={{ themeMode, setColorMode }}>
        {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for consuming the ThemeContext
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};
