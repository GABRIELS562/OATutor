/**
 * useNativePlatform - React hook for native platform features
 * Provides easy access to Capacitor features with web fallbacks
 */

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Network } from '@capacitor/network';

/**
 * Main hook for native platform detection and features
 */
export function useNativePlatform() {
    const [platform, setPlatform] = useState({
        isNative: false,
        os: 'web',
        isAndroid: false,
        isIOS: false,
        isWeb: true,
    });

    const [device, setDevice] = useState(null);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Detect platform
        const isNative = Capacitor.isNativePlatform();
        const platformName = Capacitor.getPlatform();

        setPlatform({
            isNative,
            os: platformName,
            isAndroid: platformName === 'android',
            isIOS: platformName === 'ios',
            isWeb: platformName === 'web',
        });

        // Get device info
        if (isNative) {
            Device.getInfo().then(info => {
                setDevice(info);
            }).catch(console.error);

            // Watch network status
            Network.getStatus().then(status => {
                setIsOnline(status.connected);
            });

            Network.addListener('networkStatusChange', (status) => {
                setIsOnline(status.connected);
            });
        } else {
            // Web fallback
            setIsOnline(navigator.onLine);

            const handleOnline = () => setIsOnline(true);
            const handleOffline = () => setIsOnline(false);

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
        }
    }, []);

    return {
        platform,
        device,
        isOnline,
    };
}

/**
 * Hook for haptic feedback
 */
export function useHaptics() {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(Capacitor.isNativePlatform());
    }, []);

    const impact = useCallback(async (style = 'medium') => {
        if (!Capacitor.isNativePlatform()) {
            // Web fallback - use vibration API if available
            if ('vibrate' in navigator) {
                const duration = style === 'heavy' ? 50 : style === 'light' ? 10 : 25;
                navigator.vibrate(duration);
            }
            return;
        }

        const styleMap = {
            light: ImpactStyle.Light,
            medium: ImpactStyle.Medium,
            heavy: ImpactStyle.Heavy,
        };

        await Haptics.impact({ style: styleMap[style] || ImpactStyle.Medium });
    }, []);

    const notification = useCallback(async (type = 'success') => {
        if (!Capacitor.isNativePlatform()) {
            if ('vibrate' in navigator) {
                navigator.vibrate(type === 'error' ? [50, 50, 50] : 25);
            }
            return;
        }

        const typeMap = {
            success: NotificationType.Success,
            warning: NotificationType.Warning,
            error: NotificationType.Error,
        };

        await Haptics.notification({ type: typeMap[type] || NotificationType.Success });
    }, []);

    const vibrate = useCallback(async (duration = 300) => {
        if (!Capacitor.isNativePlatform()) {
            if ('vibrate' in navigator) {
                navigator.vibrate(duration);
            }
            return;
        }

        await Haptics.vibrate({ duration });
    }, []);

    const selectionStart = useCallback(async () => {
        if (!Capacitor.isNativePlatform()) return;
        await Haptics.selectionStart();
    }, []);

    const selectionChanged = useCallback(async () => {
        if (!Capacitor.isNativePlatform()) return;
        await Haptics.selectionChanged();
    }, []);

    const selectionEnd = useCallback(async () => {
        if (!Capacitor.isNativePlatform()) return;
        await Haptics.selectionEnd();
    }, []);

    return {
        isSupported,
        impact,
        notification,
        vibrate,
        selectionStart,
        selectionChanged,
        selectionEnd,
    };
}

/**
 * Hook for app lifecycle events
 */
export function useAppLifecycle() {
    const [appState, setAppState] = useState('active');

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) {
            // Web fallback using visibility API
            const handleVisibilityChange = () => {
                setAppState(document.hidden ? 'background' : 'active');
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        }

        // Native app state
        App.addListener('appStateChange', ({ isActive }) => {
            setAppState(isActive ? 'active' : 'background');
        });

        App.addListener('pause', () => {
            setAppState('inactive');
        });

        App.addListener('resume', () => {
            setAppState('active');
        });
    }, []);

    return { appState };
}

/**
 * Hook for back button handling (Android)
 */
export function useBackButton(handler) {
    useEffect(() => {
        if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
            return;
        }

        const listener = App.addListener('backButton', ({ canGoBack }) => {
            if (handler) {
                handler({ canGoBack });
            } else if (canGoBack) {
                window.history.back();
            } else {
                App.exitApp();
            }
        });

        return () => {
            listener.then(l => l.remove());
        };
    }, [handler]);
}

/**
 * Hook for safe area insets (notch handling)
 */
export function useSafeArea() {
    const [insets, setInsets] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    useEffect(() => {
        // Get CSS env values for safe area
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        const getEnvValue = (property) => {
            const value = computedStyle.getPropertyValue(`--safe-area-inset-${property}`);
            return parseInt(value) || 0;
        };

        // Try to get safe area from CSS env()
        if (CSS.supports('padding-top', 'env(safe-area-inset-top)')) {
            // Create a temporary element to measure
            const temp = document.createElement('div');
            temp.style.paddingTop = 'env(safe-area-inset-top)';
            temp.style.paddingRight = 'env(safe-area-inset-right)';
            temp.style.paddingBottom = 'env(safe-area-inset-bottom)';
            temp.style.paddingLeft = 'env(safe-area-inset-left)';
            temp.style.position = 'absolute';
            temp.style.visibility = 'hidden';
            document.body.appendChild(temp);

            const style = getComputedStyle(temp);
            setInsets({
                top: parseInt(style.paddingTop) || 0,
                right: parseInt(style.paddingRight) || 0,
                bottom: parseInt(style.paddingBottom) || 0,
                left: parseInt(style.paddingLeft) || 0,
            });

            document.body.removeChild(temp);
        }
    }, []);

    return insets;
}

/**
 * Hook for keyboard visibility (mobile)
 */
export function useKeyboard() {
    const [isVisible, setIsVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) {
            // Web fallback - use visual viewport
            if (window.visualViewport) {
                const handleResize = () => {
                    const heightDiff = window.innerHeight - window.visualViewport.height;
                    setIsVisible(heightDiff > 100);
                    setKeyboardHeight(heightDiff > 100 ? heightDiff : 0);
                };

                window.visualViewport.addEventListener('resize', handleResize);
                return () => window.visualViewport.removeEventListener('resize', handleResize);
            }
            return;
        }

        // Would use @capacitor/keyboard plugin if installed
        // For now, use the web fallback
        if (window.visualViewport) {
            const handleResize = () => {
                const heightDiff = window.innerHeight - window.visualViewport.height;
                setIsVisible(heightDiff > 100);
                setKeyboardHeight(heightDiff > 100 ? heightDiff : 0);
            };

            window.visualViewport.addEventListener('resize', handleResize);
            return () => window.visualViewport.removeEventListener('resize', handleResize);
        }
    }, []);

    return { isVisible, keyboardHeight };
}

export default useNativePlatform;
