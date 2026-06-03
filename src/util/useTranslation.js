import { useLocalization } from "./LocalizationContext";

import translationsEn from "../locales/en.json";
import translationsAf from "../locales/af.json";

/**
 * Legacy useTranslation hook - wraps the newer useLocalization
 *
 * For new code, prefer using useLocalization() directly which provides:
 * - t(key, vars) - translation function with variable interpolation
 * - language - current active language
 * - setLanguage(lang) - change language
 * - toggleLanguage() - toggle between en/af
 *
 * This hook is kept for backward compatibility with existing components.
 */
export const useTranslation = () => {
    const { language, setLanguage, t } = useLocalization();

    console.log('🔄 useTranslation hook called, language from context:', language);

    const translationsMap = {
        en: translationsEn,
        af: translationsAf,
    };

    const translations = translationsMap[language] || translationsMap['en'];

    const translate = (key) => {
        // First try the modern t() function for consistent behavior
        const modernResult = t(key);
        if (modernResult !== key) {
            return modernResult;
        }
        // Fall back to direct lookup for legacy compatibility
        return key.split(".").reduce((obj, k) => (obj || {})[k], translations);
    };

    return { translate, setLanguage, language };
};
