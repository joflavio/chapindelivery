import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'chapindelivery',
  webDir: 'www',
  
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
