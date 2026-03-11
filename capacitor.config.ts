import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ydklab.mobile',
  appName: 'Mobile Capacitor',
  webDir: 'dist',
  server: {
    // 개발 시 Vite dev server 사용
    // url: 'http://localhost:5173',
    cleartext: true,
  },
};

export default config;
