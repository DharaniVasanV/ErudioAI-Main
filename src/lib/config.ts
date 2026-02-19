const getApiBaseUrl = () => {
  // Use local backend when running in dev mode (npm run dev)
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  // Production URL - backend is deployed on Render
  return 'https://erudioai-backend.onrender.com';
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