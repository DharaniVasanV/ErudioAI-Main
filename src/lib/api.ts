import { config } from './config';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
  };
}

export const authService = {
  async googleLogin(googleToken: string): Promise<AuthResponse> {
    const response = await fetch(`${config.api.baseUrl}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    });

    if (!response.ok) {
      throw new Error('Google login failed');
    }

    return response.json();
  },
};