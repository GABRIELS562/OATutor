import React from 'react';
import { useTranslation } from './useTranslation';

/**
 * HOC to provide translation capabilities to class components
 *
 * Provides:
 * - translate(key) - function to get translated strings
 * - setLanguage(lang) - function to change language ('en' or 'af')
 * - language - current language code
 */
const withTranslation = (WrappedComponent) => {
  return (props) => {
    const { translate, setLanguage, language } = useTranslation();
    return (
      <WrappedComponent
        translate={translate}
        setLanguage={setLanguage}
        language={language}
        {...props}
      />
    );
  };
};

export default withTranslation;
