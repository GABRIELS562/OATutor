import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.angelo.tutoring',
  appName: 'Angelo Tutoring',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Camera: {
      // Camera permissions handled natively
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a237e',
      showSpinner: true,
      androidSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
    },
    Haptics: {
      // Enable haptic feedback
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1a237e',
    useLegacyBridge: false,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1a237e',
  },
};

export default config;
