/**
 * PushNotificationService - Handle push notifications on mobile
 * Uses Capacitor Push Notifications plugin with web fallback
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Store for notification handlers
const handlers = {
    onRegistration: [],
    onRegistrationError: [],
    onPushReceived: [],
    onPushActionPerformed: [],
};

// FCM/APNS token
let deviceToken = null;

/**
 * Check if push notifications are supported
 */
function isSupported() {
    if (Capacitor.isNativePlatform()) {
        return true;
    }
    // Web push support
    return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Check notification permissions
 */
async function checkPermissions() {
    if (!Capacitor.isNativePlatform()) {
        // Web notifications
        if (!('Notification' in window)) {
            return { receive: 'denied' };
        }
        const permission = Notification.permission;
        return {
            receive: permission === 'granted' ? 'granted' : permission === 'denied' ? 'denied' : 'prompt'
        };
    }

    try {
        const result = await PushNotifications.checkPermissions();
        return result;
    } catch (error) {
        console.error('[PushNotifications] Check permissions error:', error);
        return { receive: 'denied' };
    }
}

/**
 * Request notification permissions
 */
async function requestPermissions() {
    if (!Capacitor.isNativePlatform()) {
        // Web notifications
        if (!('Notification' in window)) {
            throw new Error('Notifications not supported');
        }
        const permission = await Notification.requestPermission();
        return { receive: permission };
    }

    try {
        const result = await PushNotifications.requestPermissions();
        return result;
    } catch (error) {
        console.error('[PushNotifications] Request permissions error:', error);
        throw error;
    }
}

/**
 * Register for push notifications
 */
async function register() {
    const permissions = await checkPermissions();

    if (permissions.receive !== 'granted') {
        const newPermissions = await requestPermissions();
        if (newPermissions.receive !== 'granted') {
            throw new Error('Push notification permission denied');
        }
    }

    if (!Capacitor.isNativePlatform()) {
        // Web push - register service worker
        return registerWebPush();
    }

    // Native push registration
    try {
        // Add listeners
        await addNativeListeners();

        // Register with FCM/APNS
        await PushNotifications.register();

        console.log('[PushNotifications] Registration initiated');

    } catch (error) {
        console.error('[PushNotifications] Registration error:', error);
        throw error;
    }
}

/**
 * Add native push notification listeners
 */
async function addNativeListeners() {
    // Registration success
    await PushNotifications.addListener('registration', (token) => {
        console.log('[PushNotifications] Registered with token:', token.value);
        deviceToken = token.value;
        handlers.onRegistration.forEach(handler => handler(token.value));
    });

    // Registration error
    await PushNotifications.addListener('registrationError', (error) => {
        console.error('[PushNotifications] Registration error:', error);
        handlers.onRegistrationError.forEach(handler => handler(error));
    });

    // Push notification received
    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[PushNotifications] Received:', notification);
        handlers.onPushReceived.forEach(handler => handler(notification));
    });

    // Push notification tapped
    await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('[PushNotifications] Action performed:', action);
        handlers.onPushActionPerformed.forEach(handler => handler(action));
    });
}

/**
 * Register for web push notifications
 */
async function registerWebPush() {
    try {
        const registration = await navigator.serviceWorker.ready;

        // For demo purposes, we just log the registration
        // In production, you'd subscribe to a push service
        console.log('[PushNotifications] Web push ready:', registration);

        // Get existing subscription or create new one
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // In production, use your VAPID public key
            // subscription = await registration.pushManager.subscribe({
            //     userVisibleOnly: true,
            //     applicationServerKey: VAPID_PUBLIC_KEY,
            // });
            console.log('[PushNotifications] Web push not configured - using local notifications');
        }

        return subscription;

    } catch (error) {
        console.error('[PushNotifications] Web push registration error:', error);
        throw error;
    }
}

/**
 * Get the device token
 */
function getToken() {
    return deviceToken;
}

/**
 * Show a local notification
 */
async function showLocalNotification(options) {
    const {
        title,
        body,
        icon = '/logo192.png',
        badge = '/badge.png',
        tag,
        data,
        actions = [],
        silent = false,
        requireInteraction = false,
    } = options;

    if (!Capacitor.isNativePlatform()) {
        // Web notification
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body,
                icon,
                badge,
                tag,
                data,
                actions,
                silent,
                requireInteraction,
            });

            return notification;
        }
        return null;
    }

    // Native local notification (using Capacitor Local Notifications)
    // Note: Would need @capacitor/local-notifications plugin
    console.log('[PushNotifications] Local notification:', { title, body });
    return null;
}

/**
 * Register event handler
 */
function on(event, handler) {
    if (handlers[event]) {
        handlers[event].push(handler);
    }
    return () => off(event, handler);
}

/**
 * Remove event handler
 */
function off(event, handler) {
    if (handlers[event]) {
        handlers[event] = handlers[event].filter(h => h !== handler);
    }
}

/**
 * Get delivered notifications
 */
async function getDeliveredNotifications() {
    if (!Capacitor.isNativePlatform()) {
        return { notifications: [] };
    }

    try {
        return await PushNotifications.getDeliveredNotifications();
    } catch (error) {
        console.error('[PushNotifications] Get delivered error:', error);
        return { notifications: [] };
    }
}

/**
 * Remove all delivered notifications
 */
async function removeAllDeliveredNotifications() {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    try {
        await PushNotifications.removeAllDeliveredNotifications();
    } catch (error) {
        console.error('[PushNotifications] Remove all error:', error);
    }
}

/**
 * Schedule study reminder notification
 */
async function scheduleStudyReminder(options = {}) {
    const {
        title = 'Time to Study!',
        body = 'Your daily practice goal is waiting. Keep your streak going!',
        time = '18:00', // 6 PM default
    } = options;

    // Parse time
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    console.log('[PushNotifications] Scheduling study reminder for:', scheduledTime);

    // Store in localStorage for persistence
    localStorage.setItem('studyReminderTime', time);
    localStorage.setItem('studyReminderEnabled', 'true');

    return { scheduled: true, time: scheduledTime.toISOString() };
}

/**
 * Cancel study reminder
 */
function cancelStudyReminder() {
    localStorage.setItem('studyReminderEnabled', 'false');
    return { cancelled: true };
}

const PushNotificationService = {
    isSupported,
    checkPermissions,
    requestPermissions,
    register,
    getToken,
    showLocalNotification,
    getDeliveredNotifications,
    removeAllDeliveredNotifications,
    scheduleStudyReminder,
    cancelStudyReminder,
    on,
    off,
};

export default PushNotificationService;
