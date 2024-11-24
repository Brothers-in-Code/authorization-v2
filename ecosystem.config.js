// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'app-api',
      exec_mode: 'cluster',
      script: './dist/main.js',
      instances: 1,
      env_prod: {
        LAUNCH_TYPE: 'pm2',
        PORT: 3000,
        SCAN_ENABLED: 'false',
        ...process.env,
      },
    },
    {
      name: 'app-scan',
      exec_mode: 'cluster',
      script: './dist/main.js',
      instances: 1,
      env_prod: {
        LAUNCH_TYPE: 'pm2',
        PORT: 9000,
        SCAN_ENABLED: 'true',
        SCAN_SCHEDULE: '0 12 * * *',
        ...process.env,
      },
    },
  ],
};
