import React from 'react';
import { ThemeContext } from "../config/config";
import ErrorBoundary from "./ErrorBoundary";
import { IS_PRODUCTION } from "../util/getBuildType";

/**
 * Global Error Boundary for Angelo Tutoring
 * Catches unhandled errors at the app level and provides user-friendly recovery options
 */
export default class GlobalErrorBoundary extends ErrorBoundary {
    static contextType = ThemeContext;

    constructor(props, context) {
        super(props, context);
        this.componentName = "_global_";
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Call parent's error logging
        super.componentDidCatch(error, errorInfo);

        // Store error info for display
        this.setState({ errorInfo });

        // Log to console in development
        if (!IS_PRODUCTION) {
            console.error('[GlobalErrorBoundary] Caught error:', error);
            console.error('[GlobalErrorBoundary] Error info:', errorInfo);
        }
    }

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleClearDataAndRefresh = () => {
        // Clear cached data that might be causing issues
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            // Storage might be unavailable
        }

        // Clear service worker cache
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }

        // Reload the page
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    fontFamily: '"Titillium Web", "Roboto", sans-serif',
                }}>
                    <div style={{
                        maxWidth: '500px',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}>
                        {/* Error Icon */}
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '20px',
                        }}>
                            &#9888;
                        </div>

                        <h1 style={{
                            color: '#3C3C3C',
                            marginBottom: '16px',
                            fontSize: '24px',
                        }}>
                            Oops! Something went wrong
                        </h1>

                        <p style={{
                            color: '#666',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            marginBottom: '24px',
                        }}>
                            We're sorry, but Angelo Tutoring encountered an unexpected error.
                            This has been automatically reported to our team.
                        </p>

                        {/* Error details in development */}
                        {!IS_PRODUCTION && this.state.error && (
                            <div style={{
                                backgroundColor: '#fff0f0',
                                border: '1px solid #ffcccc',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '24px',
                                textAlign: 'left',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                overflow: 'auto',
                                maxHeight: '150px',
                            }}>
                                <strong>Error:</strong> {this.state.error.toString()}
                                {this.state.errorInfo && (
                                    <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        {/* Recovery buttons */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            <button
                                onClick={this.handleRefresh}
                                style={{
                                    backgroundColor: '#3C3C3C',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 28px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    transition: 'background-color 0.2s',
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#4A4A4A'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#3C3C3C'}
                            >
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#3C3C3C',
                                    border: '2px solid #3C3C3C',
                                    padding: '12px 28px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#3C3C3C';
                                    e.target.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#3C3C3C';
                                }}
                            >
                                Go to Homepage
                            </button>

                            <button
                                onClick={this.handleClearDataAndRefresh}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#666',
                                    border: 'none',
                                    padding: '10px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    textDecoration: 'underline',
                                }}
                            >
                                Clear cache and restart
                            </button>
                        </div>

                        {/* Help text */}
                        <p style={{
                            color: '#999',
                            fontSize: '13px',
                            marginTop: '24px',
                        }}>
                            If this problem persists, please try:
                            <br />
                            1. Refreshing the page
                            <br />
                            2. Clearing your browser cache
                            <br />
                            3. Using a different browser
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
