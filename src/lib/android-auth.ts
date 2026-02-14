// src/lib/android-auth.ts
import { Capacitor } from '@capacitor/core';
import { authService } from './api';
import { config } from './config';

export const androidGoogleSignIn = async () => {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('This function only works on Android');
  }

  try {
    const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
    
    await GoogleAuth.initialize({
      clientId: config.web.googleClientId, // Use WEB client ID, not Android
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });

    const result = await GoogleAuth.signIn();
    
    // Send Google token to backend
    const authResponse = await authService.googleLogin(result.authentication.idToken);
    
    return authResponse;
  } catch (error) {
    console.error('Android Google Sign-In failed:', error);
    throw error;
  }
};