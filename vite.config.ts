import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.PORT || 4173);

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: false,
      allowedHosts: ['localhost', '127.0.0.1', 'total-energie-1.onrender.com'],
    },
    preview: {
      host: '0.0.0.0',
      port,
      strictPort: false,
      allowedHosts: ['localhost', '127.0.0.1', 'total-energie-1.onrender.com'],
    },
  };
});
