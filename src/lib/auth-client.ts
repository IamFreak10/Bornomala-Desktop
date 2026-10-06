import { createAuthClient } from 'better-auth/react';

const TOKEN_KEY = 'bearer_token';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get('set-auth-token');
      if (authToken) {
        localStorage.setItem(TOKEN_KEY, authToken);
      }
    },
    onResponse: (ctx) => {
      const url = ctx.request?.url?.toString() || '';
      if (url.includes('/sign-out')) {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
    auth: {
      type: 'Bearer',
      token: () => localStorage.getItem(TOKEN_KEY) || '',
    },
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;
