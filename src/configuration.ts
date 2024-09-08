export function configuration() {
  return {
    app: {
      host: process.env.APP_HOST,
      protocol: process.env.APP_PROTOCOL,
      port: parseInt(process.env.PORT, 10) || 3000,
      frontend: process.env.FRONT_REDIRECT_PATH,
      front: process.env.APP_REDIRECT_PATH,
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
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  };
}
