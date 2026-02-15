import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { authService } from '@/lib/api';
import { Capacitor } from '@capacitor/core';
import { config } from '@/lib/config';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('College');
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      signup(name, email, level);
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Check if running on Android
      if (Capacitor.isNativePlatform()) {
        const { androidGoogleSignIn } = await import('@/lib/android-auth');
        const authResponse = await androidGoogleSignIn();
        signup(authResponse.user.name, authResponse.user.email, 'College');
        localStorage.setItem('access_token', authResponse.access_token);
        navigate('/dashboard');
        return;
      }

      // Web Google Sign-In
      const google = (window as any).google;
      if (!google) {
        alert('Google Sign-In not loaded');
        return;
      }

      google.accounts.id.initialize({
        client_id: config.web.googleClientId,
        callback: async (response: any) => {
          try {
            const authResponse = await authService.googleLogin(response.credential);
            signup(authResponse.user.name, authResponse.user.email, 'College');
            localStorage.setItem('access_token', authResponse.access_token);
            navigate('/dashboard');
          } catch (error) {
            console.error('Google login failed:', error);
            alert('Google login failed');
          }
        },
        use_fedcm_for_prompt: false
      });

      // Render button instead of prompt
      google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large', width: 400 }
      );
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  React.useEffect(() => {
    handleGoogleLogin();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-2">Create your account</h2>
        <p className="text-gray-500 text-center mb-8">Start your personalized learning journey</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Alex Student"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="School">School</option>
              <option value="College">College</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            Sign up
          </button>
        </form>

        <div className="mt-6">
          <div id="googleSignInButton" className="flex justify-center"></div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};
