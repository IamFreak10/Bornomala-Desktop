import axios, {
  AxiosError,
  AxiosInstance,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined in your .env file');
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------ Request Interceptor ------------------

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('bearer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ------------------ Response Interceptor ------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn('Unauthorized. Redirecting to login...');
      }

      if (status === 403) {
        console.warn("Forbidden: You don't have permission.");
      }

      if (status && status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error: No response from server.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
