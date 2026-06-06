/**
 * LocalizationContext - Bilingual support for English ⇄ Afrikaans
 *
 * Features:
 * - App-wide i18n with persistent language switch
 * - Saves preference to SQLite database
 * - Falls back to localStorage for offline/initial load
 * - Loads translations from JSON files
 * - Supports per-course language override
 */

import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES, LANGUAGE_NAMES } from '../config/config.js';
import db from '../database/DatabaseService';

// Import translation files
import enTranslations from '../locales/en.json';
import afTranslations from '../locales/af.json';

const LocalizationContext = createContext();

// All available translations
const TRANSLATIONS = {
    en: enTranslations,
    af: afTranslations
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to search
 * @param {string} path - Dot-notated path (e.g., 'problem.Submit')
 * @param {*} fallback - Fallback value if not found
 */
const getNestedValue = (obj, path, fallback = null) => {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return fallback;
        }
    }

    return current ?? fallback;
};

export const LocalizationProvider = ({ children, userId }) => {
    // Language state
    const [platformLanguage, setPlatformLanguage] = useState(() => {
        // First try localStorage for immediate load
        const stored = localStorage.getItem('platformLanguage');
        return AVAILABLE_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
    });

    const [activeLanguage, setActiveLanguage] = useState(platformLanguage);
    const [currentCourseName, setCurrentCourseName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Debug: Log when activeLanguage changes
    useEffect(() => {
        console.log('🚀 ACTIVE LANGUAGE CHANGED TO:', activeLanguage);
    }, [activeLanguage]);

    // Load language preference from database on mount
    useEffect(() => {
        const loadLanguagePreference = async () => {
            if (userId) {
                try {
                    const savedLang = await db.getUserLanguage(userId);
                    if (savedLang && AVAILABLE_LANGUAGES.includes(savedLang)) {
                        setPlatformLanguage(savedLang);
                        if (!currentCourseName) {
                            setActiveLanguage(savedLang);
                        }
                    }
                } catch (e) {
                    console.warn('Failed to load language from database:', e);
                }
            }
            setIsLoading(false);
        };

        loadLanguagePreference();
    }, [userId]);

    // Persist to localStorage whenever platform language changes
    useEffect(() => {
        localStorage.setItem('platformLanguage', platformLanguage);
    }, [platformLanguage]);

    // Update active language when not in a course
    useEffect(() => {
        if (!currentCourseName) {
            setActiveLanguage(platformLanguage);
        }
    }, [platformLanguage, currentCourseName]);

    /**
     * Set the platform-wide language
     * Persists to both localStorage and SQLite
     */
    const setLanguage = useCallback(async (lang) => {
        console.log('🌐 setLanguage called with:', lang);
        console.log('🌐 Current activeLanguage:', activeLanguage);
        console.log('🌐 Current platformLanguage:', platformLanguage);

        if (!AVAILABLE_LANGUAGES.includes(lang)) {
            console.warn(`Language "${lang}" is not supported`);
            return;
        }

        console.log('🌐 Setting language to:', lang);
        setPlatformLanguage(lang);
        setActiveLanguage(lang);  // Also update active language immediately
        localStorage.setItem('platformLanguage', lang);
        console.log('🌐 Language set complete, localStorage:', localStorage.getItem('platformLanguage'));

        // If in a course, also save the course-specific language preference
        if (currentCourseName) {
            sessionStorage.setItem(`course_lang_${currentCourseName}`, lang);
        }

        // Also save to database if user is available
        if (userId) {
            try {
                await db.setUserLanguage(userId, lang);
            } catch (e) {
                console.warn('Failed to save language to database:', e);
            }
        }
    }, [userId, currentCourseName]);

    /**
     * Toggle between English and Afrikaans
     */
    const toggleLanguage = useCallback(() => {
        const newLang = platformLanguage === 'en' ? 'af' : 'en';
        setLanguage(newLang);
    }, [platformLanguage, setLanguage]);

    /**
     * Called when entering a course - keeps user's language preference
     * User's selected language (platformLanguage) takes priority over course default
     */
    const enterCourse = useCallback((courseName, courseLanguage) => {
        setCurrentCourseName(courseName);

        // Check for saved course-specific language first
        const savedLang = sessionStorage.getItem(`course_lang_${courseName}`);

        if (savedLang && AVAILABLE_LANGUAGES.includes(savedLang)) {
            // User has explicitly set a language for this course
            setActiveLanguage(savedLang);
        } else {
            // Use the platform language (user's selected language) - NOT the course default
            // This ensures the language toggle works across the entire app
            setActiveLanguage(platformLanguage);
        }
    }, [platformLanguage]);

    /**
     * Called when leaving a course
     */
    const exitCourse = useCallback(() => {
        setCurrentCourseName(null);
        setActiveLanguage(platformLanguage);
    }, [platformLanguage]);

    /**
     * Get a translated string by key
     * Falls back to English if translation not found
     *
     * @param {string} key - Translation key (e.g., 'problem.Submit')
     * @param {Object} vars - Variables to interpolate (e.g., {count: 5})
     * @returns {string} Translated string
     */
    const t = useCallback((key, vars = {}) => {
        // Try active language first
        let translation = getNestedValue(TRANSLATIONS[activeLanguage], key);

        // Debug logging - only log for platform/hintsystem keys during debugging
        if (key.startsWith('platform.') || key.startsWith('hintsystem.')) {
            console.log(`🔤 t("${key}") activeLanguage=${activeLanguage} => "${translation}"`);
        }

        // Fall back to English
        if (translation === null && activeLanguage !== 'en') {
            translation = getNestedValue(TRANSLATIONS.en, key);
        }

        // Return key if no translation found
        if (translation === null) {
            console.debug(`Missing translation: ${key}`);
            return key;
        }

        // Interpolate variables
        if (typeof translation === 'string' && Object.keys(vars).length > 0) {
            return translation.replace(/\{(\w+)\}/g, (_, varName) => {
                return vars[varName] !== undefined ? vars[varName] : `{${varName}}`;
            });
        }

        return translation;
    }, [activeLanguage]);

    /**
     * Get all translations for a section
     */
    const getSection = useCallback((section) => {
        const translations = TRANSLATIONS[activeLanguage]?.[section] || {};
        const fallback = TRANSLATIONS.en?.[section] || {};
        return { ...fallback, ...translations };
    }, [activeLanguage]);

    /**
     * Check if a translation exists
     */
    const hasTranslation = useCallback((key) => {
        return getNestedValue(TRANSLATIONS[activeLanguage], key) !== null ||
               getNestedValue(TRANSLATIONS.en, key) !== null;
    }, [activeLanguage]);

    // Memoized context value
    const value = useMemo(() => {
        console.log('📦 Context value recreated with activeLanguage:', activeLanguage);
        return ({
        // Current languages
        language: activeLanguage,
        platformLanguage,

        // Language info
        languageName: LANGUAGE_NAMES[activeLanguage] || activeLanguage,
        isAfrikaans: activeLanguage === 'af',
        isEnglish: activeLanguage === 'en',

        // Actions
        setLanguage,
        toggleLanguage,
        enterCourse,
        exitCourse,

        // Translation helpers
        t,
        getSection,
        hasTranslation,

        // Constants
        SUPPORTED_LANGUAGES: AVAILABLE_LANGUAGES,
        LANGUAGE_NAMES,

        // State
        isLoading,
        currentCourseName
    })}, [
        activeLanguage,
        platformLanguage,
        setLanguage,
        toggleLanguage,
        enterCourse,
        exitCourse,
        t,
        getSection,
        hasTranslation,
        isLoading,
        currentCourseName
    ]);

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    );
};

/**
 * Hook to use localization
 */
export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};

/**
 * HOC for class components
 */
export const withLocalization = (Component) => {
    return function LocalizedComponent(props) {
        const localization = useLocalization();
        return <Component {...props} localization={localization} />;
    };
};

/**
 * Consumer for class components
 */
export const LocalizationConsumer = LocalizationContext.Consumer;

export default LocalizationContext;
