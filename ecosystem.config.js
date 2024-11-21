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
        ...process.env,
      },
    },
  ],
};
