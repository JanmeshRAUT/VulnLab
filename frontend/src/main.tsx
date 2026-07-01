import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'
import toast from 'react-hot-toast'

// Global Axios Interceptor for Error Handling & Redirection
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const url = error.config?.url || '';
      const isLabEndpoint = url.includes('/api/lab');

      if (error.response.status === 401) {
        // Only redirect if it's a platform error, and not already on login/register
        if (!isLabEndpoint && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
          toast.error('Session expired or unauthorized. Please login.');
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        if (!isLabEndpoint) {
          toast.error(error.response.data?.detail || 'You do not have permission to access this resource.');
        }
      } else if (error.response.status >= 500) {
        if (!isLabEndpoint) {
          toast.error('A server error occurred. Please try again later.');
        }
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" />
  </StrictMode>,
)
