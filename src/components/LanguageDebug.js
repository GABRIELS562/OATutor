/**
 * Debug component to test language switching
 * Add this anywhere in the app to verify translations are working
 */
import React, { useEffect, useState } from 'react';
import { useLocalization } from '../util/LocalizationContext';
import { useTranslation } from '../util/useTranslation';

export const LanguageDebugPanel = () => {
    const localization = useLocalization();
    const translation = useTranslation();
    const [renderCount, setRenderCount] = useState(0);

    // Track renders
    useEffect(() => {
        setRenderCount(c => c + 1);
    }, [localization.language]);

    // Store translation results to compare
    const tResult = localization.t('platform.LoggedIn');
    const translateResult = translation.translate('platform.LoggedIn');
    const hintResult = localization.t('hintsystem.hint');
    const lessonResult = localization.t('lessonSelection.resetprogress');

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            left: 10,
            padding: '12px',
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '11px',
            zIndex: 9999,
            maxWidth: '320px',
            fontFamily: 'monospace',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#58CC02', fontSize: '13px' }}>
                Language Debug (Render #{renderCount})
            </div>
            <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#888' }}>Context:</span> <strong style={{ color: '#4ade80' }}>{localization.language}</strong>
                {' | '}
                <span style={{ color: '#888' }}>Hook:</span> <strong style={{ color: '#4ade80' }}>{translation.language}</strong>
            </div>
            <hr style={{ margin: '6px 0', borderColor: '#555' }} />

            <div style={{ marginBottom: '3px' }}>
                <span style={{ color: '#888' }}>platform.LoggedIn:</span>{' '}
                <strong style={{ color: tResult === 'Not logged in' ? '#f59e0b' : '#4ade80' }}>{tResult}</strong>
            </div>
            <div style={{ marginBottom: '3px' }}>
                <span style={{ color: '#888' }}>hintsystem.hint:</span>{' '}
                <strong style={{ color: hintResult === 'Hint ' ? '#f59e0b' : '#4ade80' }}>{hintResult}</strong>
            </div>
            <div style={{ marginBottom: '3px' }}>
                <span style={{ color: '#888' }}>lessonSelection.resetprogress:</span>{' '}
                <strong style={{ color: lessonResult === 'Reset Progress' ? '#f59e0b' : '#4ade80' }}>{lessonResult}</strong>
            </div>

            <hr style={{ margin: '6px 0', borderColor: '#555' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => localization.setLanguage('en')}
                    style={{
                        padding: '6px 12px',
                        background: localization.language === 'en' ? '#58CC02' : '#555',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        flex: 1
                    }}
                >
                    English
                </button>
                <button
                    onClick={() => localization.setLanguage('af')}
                    style={{
                        padding: '6px 12px',
                        background: localization.language === 'af' ? '#58CC02' : '#555',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        flex: 1
                    }}
                >
                    Afrikaans
                </button>
            </div>
        </div>
    );
};

export default LanguageDebugPanel;
