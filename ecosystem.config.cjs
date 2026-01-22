module.exports = {
  apps: [
    {
      name: 'SSO-App',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        SSO_SECRET: 'buamsso2983782@issuat.hkbu.edu.hk',
        AUTH_URL: 'https://issuat.hkbu.edu.hk'
      }
    }
  ]
}
