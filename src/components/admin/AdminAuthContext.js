/**
 * Admin Authentication Context
 * Simple localStorage-based auth for MVP
 *
 * SECURITY NOTE: For production, integrate with Supabase Auth or similar.
 * Demo credentials are loaded from environment variables.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context
const AdminAuthContext = createContext(null);

// Storage keys
const STORAGE_KEYS = {
    ADMIN_TOKEN: 'angelo_admin_token',
    ADMIN_USER: 'angelo_admin_user',
};

/**
 * Get demo credentials from environment variables
 * In production, replace with Supabase Auth or similar
 */
const getDemoCredentials = () => {
    // Check if demo mode is enabled
    const demoEnabled = process.env.REACT_APP_DEMO_MODE === 'true';

    if (!demoEnabled) {
        return { teachers: [] };
    }

    // Load credentials from environment variables (set in .env.local, never commit)
    const teachers = [];

    // Teacher 1
    if (process.env.REACT_APP_DEMO_TEACHER_EMAIL && process.env.REACT_APP_DEMO_TEACHER_PASS) {
        teachers.push({
            id: 'teacher-001',
            email: process.env.REACT_APP_DEMO_TEACHER_EMAIL,
            password: process.env.REACT_APP_DEMO_TEACHER_PASS,
            name: process.env.REACT_APP_DEMO_TEACHER_NAME || 'Demo Teacher',
            role: 'teacher',
        });
    }

    // Admin
    if (process.env.REACT_APP_DEMO_ADMIN_EMAIL && process.env.REACT_APP_DEMO_ADMIN_PASS) {
        teachers.push({
            id: 'admin-001',
            email: process.env.REACT_APP_DEMO_ADMIN_EMAIL,
            password: process.env.REACT_APP_DEMO_ADMIN_PASS,
            name: process.env.REACT_APP_DEMO_ADMIN_NAME || 'Demo Admin',
            role: 'admin',
        });
    }

    // Fallback for development only (not in production builds)
    if (teachers.length === 0 && process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No demo credentials configured. Add REACT_APP_DEMO_* variables to .env.local');
        // Provide minimal dev credentials that won't work in production
        teachers.push({
            id: 'dev-teacher',
            email: 'dev@localhost',
            password: 'devonly',
            name: 'Dev Mode',
            role: 'admin',
        });
    }

    return { teachers };
};

/**
 * Admin Auth Provider Component
 */
export const AdminAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        checkExistingSession();
    }, []);

    /**
     * Check for existing session in localStorage
     */
    const checkExistingSession = () => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
            const storedUser = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);

            if (token && storedUser) {
                const parsedUser = JSON.parse(storedUser);

                // Validate token hasn't expired (24 hour sessions)
                try {
                    const tokenData = JSON.parse(atob(token));
                    const tokenAge = Date.now() - tokenData.timestamp;
                    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

                    if (tokenAge > maxAge) {
                        logout();
                        return;
                    }
                } catch {
                    logout();
                    return;
                }

                setUser(parsedUser);
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error('Error checking admin session:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Login with email and password
     */
    const login = useCallback(async (email, password) => {
        const credentials = getDemoCredentials();

        // Find matching teacher
        const teacher = credentials.teachers.find(
            t => t.email.toLowerCase() === email.toLowerCase() && t.password === password
        );

        if (!teacher) {
            throw new Error('Invalid email or password');
        }

        // Create session
        const sessionUser = {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            role: teacher.role,
            loginTime: new Date().toISOString(),
        };

        // Generate simple token (in production, use JWT from backend)
        const token = btoa(JSON.stringify({ userId: teacher.id, timestamp: Date.now() }));

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(sessionUser));

        setUser(sessionUser);
        setIsAuthenticated(true);

        return sessionUser;
    }, []);

    /**
     * Logout
     */
    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    /**
     * Check if user has specific role
     */
    const hasRole = useCallback((role) => {
        if (!user) return false;
        if (user.role === 'admin') return true; // Admin has all roles
        return user.role === role;
    }, [user]);

    // Context value
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

/**
 * Custom hook to use admin auth context
 */
export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

export default AdminAuthContext;
