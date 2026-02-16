const getApiBaseUrl = () => {
  // Production URL - backend is deployed on Render
  const PRODUCTION_URL = 'https://erudioai-backend.onrender.com';
  
  // Always use production URL (backend is online, no localhost needed)
  return PRODUCTION_URL;
};

export const config = {
  web: {
    googleClientId: '830923042304-606in9jgojfj6qmmd7ktn14gc59agu3v.apps.googleusercontent.com'
  },
  android: {
    googleClientId: '830923042304-606in9jgojfj6qmmd7ktn14gc59agu3v.apps.googleusercontent.com' // Use same as web
  },
  api: {
    baseUrl: getApiBaseUrl()
  }
};