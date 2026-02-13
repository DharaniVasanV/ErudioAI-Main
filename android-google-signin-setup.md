# Android Google Sign-In Setup

## 1. Add Google Sign-In to Android

In `android/app/build.gradle`, add:
```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

## 2. Get SHA-1 Certificate Fingerprint

Run in terminal:
```bash
cd android
./gradlew signingReport
```

Copy the SHA-1 fingerprint.

## 3. Add Android App to Google Cloud Console

1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Click "Add Application" > "Android"
4. Package name: `com.erudioai.app` (from capacitor.config.json)
5. Paste SHA-1 fingerprint
6. Save

## 4. Create Android Google Sign-In Service

The Android app will:
1. Use Google Sign-In SDK to get ID token
2. Send token to `http://your-backend-url:8000/auth/google`
3. Receive JWT token from backend
4. Store JWT for API calls

## Backend is Already Ready!
- Same `/auth/google` endpoint works for both web and Android
- Just send the Google ID token from Android
- Backend verifies and returns JWT