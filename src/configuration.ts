import * as os from 'os';

export function configuration() {
  return {
    server: {
      name: process.env.SERVER_NAME,
      hostname: os.hostname(),
    },
    app: {
      currentEnv: process.env.NODE_ENV || 'production',
      frontend: process.env.FRONT_REDIRECT_PATH,
      encryptKey: process.env.APP_ENCRYPT_KEY,
      jwtSecret: process.env.APP_JWT_SECRET,
      apiInternalSecret: process.env.API_INTERNAL_SECRET,
      host: process.env.APP_HOST,
      scanDaysDepth: process.env.SCAN_DAYS_DEPTH,
      userTokenLifetime: process.env.USER_TOKEN_LIFETIME,

      protocol: process.env.APP_PROTOCOL,
      port: parseInt(process.env.PORT, 10) || 3000,
      front: process.env.APP_REDIRECT_PATH,
    },
    cron: {
      enabled: process.env.SCAN_ENABLED === 'true',
      schedule: process.env.SCAN_SCHEDULE || '0 12 * * *',
    },
    vk: {
      appId: process.env.VK_APP_ID,
      secureKey: process.env.VK_SECURE_KEY,
      serviceKey: process.env.VK_SERVICE_KEY,
      v: '5.120',
    },
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username:
        process.env.NODE_ENV === 'production'
          ? process.env.DB_USER
          : process.env.INTEGRATION_DB_USER,
      password:
        process.env.NODE_ENV === 'production'
          ? process.env.DB_PASSWORD
          : process.env.INTEGRATION_DB_PASSWORD,
      database:
        process.env.NODE_ENV === 'production'
          ? process.env.DB_NAME
          : process.env.INTEGRATION_DB_NAME,
    },
  };
}
