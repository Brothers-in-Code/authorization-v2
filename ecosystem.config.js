// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const server = process.env.SERVER_NAME || 'default';

const apps = [];

apps.push({
  name: 'app-api',
  exec_mode: 'cluster',
  script: './dist/main.js',
  instances: 1,
  autorestart: true,
  env: {
    LAUNCH_TYPE: 'pm2',
    PORT: 3000,
    SCAN_ENABLED: 'false',
    ...process.env,
  },
});

if (server === 'scan') {
  apps.push(
    {
      name: 'app-scan',
      exec_mode: 'cluster',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      env: {
        LAUNCH_TYPE: 'pm2',
        PORT: 9000,
        SCAN_ENABLED: 'true',
        SCAN_SCHEDULE: '0 12 * * *',
        SCAN_DAYS_DEPTH: 7,
        ...process.env,
      },
    },
    {
      name: 'app-hourly-scan',
      exec_mode: 'cluster',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      env: {
        LAUNCH_TYPE: 'pm2',
        PORT: 9100,
        SCAN_ENABLED: 'true',
        SCAN_SCHEDULE: '0 0-11,13-23 * * *',
        SCAN_DAYS_DEPTH: 1,
        ...process.env,
      },
    },
  );
}

module.exports = { apps };
