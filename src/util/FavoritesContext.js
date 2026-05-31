/**
 * FavoritesContext - Save and manage favorite problems/questions
 *
 * Features:
 * - Add/remove favorites
 * - Persist to localStorage
 * - Quick access to saved problems
 * - Sync with Supabase (optional)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'angelo_favorites';

export const FavoritesProvider = ({ children, userId, supabase }) => {
    const [favorites, setFavorites] = useState({
        problems: [],      // Saved practice problems
        papers: [],        // Saved past papers
        summaries: [],     // Saved theory summaries
        quizzes: [],       // Saved quiz results
    });
    const [loading, setLoading] = useState(true);

    // Load favorites from storage
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                // Try localStorage first
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }

                // Sync with Supabase if available
                if (supabase && userId) {
                    const { data, error } = await supabase
                        .from('user_favorites')
                        .select('favorites')
                        .eq('user_id', userId)
                        .single();

                    if (data && !error) {
                        setFavorites(data.favorites);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.favorites));
                    }
                }
            } catch (error) {
                console.warn('[Favorites] Load error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [userId, supabase]);

    // Save to storage
    const saveToStorage = useCallback(async (newFavorites) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));

            // Sync to Supabase if available
            if (supabase && userId) {
                await supabase
                    .from('user_favorites')
                    .upsert({
                        user_id: userId,
                        favorites: newFavorites,
                        updated_at: new Date().toISOString(),
                    });
            }
        } catch (error) {
            console.warn('[Favorites] Save error:', error);
        }
    }, [userId, supabase]);

    // Add favorite
    const addFavorite = useCallback((type, item) => {
        setFavorites(prev => {
            const updated = {
                ...prev,
                [type]: [
                    ...prev[type].filter(f => f.id !== item.id),
                    {
                        ...item,
                        savedAt: new Date().toISOString(),
                    },
                ],
            };
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    // Remove favorite
    const removeFavorite = useCallback((type, itemId) => {
        setFavorites(prev => {
            const updated = {
                ...prev,
                [type]: prev[type].filter(f => f.id !== itemId),
            };
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    // Check if item is favorited
    const isFavorite = useCallback((type, itemId) => {
        return favorites[type]?.some(f => f.id === itemId) || false;
    }, [favorites]);

    // Toggle favorite
    const toggleFavorite = useCallback((type, item) => {
        if (isFavorite(type, item.id)) {
            removeFavorite(type, item.id);
            return false;
        } else {
            addFavorite(type, item);
            return true;
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    // Get favorites by type
    const getFavorites = useCallback((type) => {
        return favorites[type] || [];
    }, [favorites]);

    // Get all favorites count
    const getTotalCount = useCallback(() => {
        return Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0);
    }, [favorites]);

    // Clear all favorites
    const clearFavorites = useCallback((type = null) => {
        setFavorites(prev => {
            let updated;
            if (type) {
                updated = { ...prev, [type]: [] };
            } else {
                updated = { problems: [], papers: [], summaries: [], quizzes: [] };
            }
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const value = {
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        getFavorites,
        getTotalCount,
        clearFavorites,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        // Return a mock object if used outside provider
        return {
            favorites: { problems: [], papers: [], summaries: [], quizzes: [] },
            loading: false,
            addFavorite: () => {},
            removeFavorite: () => {},
            isFavorite: () => false,
            toggleFavorite: () => false,
            getFavorites: () => [],
            getTotalCount: () => 0,
            clearFavorites: () => {},
        };
    }
    return context;
};

export default FavoritesContext;
