import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '^/labs/broken-auth-hidden/(BlogHub|ForumNext|DevPortal)(?!/admin)': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => {
          let variant = '';
          if (path.includes('BlogHub')) variant = '2a';
          if (path.includes('ForumNext')) variant = '2b';
          if (path.includes('DevPortal')) variant = '2c';
          
          const match = path.match(/^\/labs\/broken-auth-hidden\/(BlogHub|ForumNext|DevPortal)(.*)$/);
          const rest = match ? match[2] : '/';
          return `/api/lab2/2/${variant}/navigate?path=${encodeURIComponent(rest || '/')}`;
        }
      }
    }
  }
})
