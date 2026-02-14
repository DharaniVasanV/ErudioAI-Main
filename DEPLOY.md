# Deploy Backend to Render

## Steps:

1. **Go to https://render.com and sign up/login**

2. **Create PostgreSQL Database:**
   - Click "New +" > "PostgreSQL"
   - Name: `erudioai-db`
   - Copy the "Internal Database URL" after creation

3. **Create Web Service:**
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `erudioai-backend`
     - Root Directory: `backend`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables:**
   - `DATABASE_URL`: Paste the Internal Database URL from step 2
   - `JWT_SECRET_KEY`: Generate a random string (e.g., use https://randomkeygen.com/)
   - `JWT_ALGORITHM`: `HS256`
   - `GOOGLE_CLIENT_ID`: `830923042304-606in9jgojfj6qmmd7ktn14gc59agu3v.apps.googleusercontent.com`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://erudioai-backend.onrender.com`)

6. **Update Frontend Config:**
   - Update `src/lib/config.ts` with your Render URL
   - Rebuild: `npm run build && npx cap sync android`

## Your Backend URL will be:
`https://your-app-name.onrender.com`

## Update Google OAuth:
Add your Render URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-app-name.onrender.com`
- Authorized redirect URIs: `https://your-app-name.onrender.com`