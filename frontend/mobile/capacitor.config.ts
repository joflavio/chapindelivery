import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Chapin Delivery',
  webDir: 'www',
  
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
