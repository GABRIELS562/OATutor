/**
 * ThemeToggleContext - Dark/Light mode toggle with persistence
 * Provides theme switching functionality across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import saTheme from '../theme/saTheme';
import darkTheme from '../theme/darkTheme';

const THEME_STORAGE_KEY = 'angelo_theme_mode';

// Create context
const ThemeToggleContext = createContext({
    isDark: false,
    toggleTheme: () => {},
    setTheme: () => {},
});

/**
 * Hook to access theme toggle
 */
export function useThemeToggle() {
    const context = useContext(ThemeToggleContext);
    if (!context) {
        throw new Error('useThemeToggle must be used within ThemeToggleProvider');
    }
    return context;
}

/**
 * Theme toggle provider component
 */
export function ThemeToggleProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored !== null) {
            return stored === 'dark';
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }

        return false;
    });

    // Get the appropriate theme
    const theme = isDark ? darkTheme : saTheme;

    // Toggle theme
    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const newValue = !prev;
            localStorage.setItem(THEME_STORAGE_KEY, newValue ? 'dark' : 'light');
            return newValue;
        });
    }, []);

    // Set specific theme
    const setTheme = useCallback((mode) => {
        const isDarkMode = mode === 'dark';
        setIsDark(isDarkMode);
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only auto-switch if user hasn't set a preference
            if (localStorage.getItem(THEME_STORAGE_KEY) === null) {
                setIsDark(e.matches);
            }
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Legacy Safari
        else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    // Update CSS variables and classes for theme mode
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (isDark) {
            // Apply dark mode
            root.classList.add('dark-mode');
            root.classList.remove('light-mode');
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            root.setAttribute('data-theme', 'dark');

            // Set dark mode CSS variables
            root.style.setProperty('--bg-primary', '#0f0f23');
            root.style.setProperty('--bg-secondary', '#1a1a2e');
            root.style.setProperty('--bg-card', '#16213e');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b0b0b0');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');

            // Apply background color directly to body for immediate effect
            body.style.backgroundColor = '#0f0f23';
            body.style.color = '#ffffff';
        } else {
            // Apply light mode
            root.classList.remove('dark-mode');
            root.classList.add('light-mode');
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            root.setAttribute('data-theme', 'light');

            // Set light mode CSS variables
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');

            // Apply background color directly to body for immediate effect
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#1e293b';
        }

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDark ? '#0f0f23' : '#1a237e');
        }
    }, [isDark]);

    const contextValue = {
        isDark,
        toggleTheme,
        setTheme,
        theme,
    };

    return (
        <ThemeToggleContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeToggleContext.Provider>
    );
}

export default ThemeToggleContext;
