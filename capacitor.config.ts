import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.erudioai.app',
  appName: 'ErudioAI',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4F46E5',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK'
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '830923042304-606in9jgojfj6qmmd7ktn14gc59agu3v.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;