import { Capacitor } from '@capacitor/core';

const getApiBaseUrl = () => {
  if (Capacitor.isNativePlatform()) {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:8000';
  }
  // Web browser uses localhost
  return 'http://localhost:8000';
};

export const config = {
  web: {
    googleClientId: '830923042304-606in9jgojfj6qmmd7ktn14gc59agu3v.apps.googleusercontent.com'
  },
  android: {
    googleClientId: '830923042304-m53dbfk67e6bthb9e6hjsjtgt8cffl6u.apps.googleusercontent.com'
  },
  api: {
    baseUrl: getApiBaseUrl()
  }
};