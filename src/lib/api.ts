import axios, { type InternalAxiosRequestConfig } from 'axios';

/**
 * Retrieves the authentication token from storage.
 * This can be adapted to use sessionStorage, cookies, or any other storage mechanism.
 * @returns The token string or null if not found.
 */
const getAuthToken = (): string | null => {
  // This check ensures code doesn't break during Server-Side Rendering (SSR)
  if (typeof window !== 'undefined') {
    // You can replace 'authToken' with the key you use to store the JWT.
    return localStorage.getItem('authToken');
  }
  return null;
};

const apiClient = axios.create({
  // It's a good practice to set a baseURL for your API.
  // You can use environment variables for this.
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject the authentication token into headers.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized errors globally.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear the expired token from storage
        localStorage.removeItem('authToken');
        // Redirect to the connection/login flow
        window.location.href = '/connect';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;