// Centralized API base URL configuration.
// In production (Vercel), requests go to the same origin (empty string),
// which are then reverse-proxied by Vercel to the Render backend.
// In development, it defaults to the local backend.
export const API_BASE = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || '') 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
