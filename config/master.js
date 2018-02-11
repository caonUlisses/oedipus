module.exports = {
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/auth'
  },
  network: {
    port: process.env.PORT || 3000
  },
  app: {
    name: process.env.APP_NAME || 'app_name',
    key: process.env.APP_KEY || 'reallyLongKeyHere',
    users: {
      default_access: process.env.DEFAULT_USER_ACCESS || 'user'
    },
    validation: {
      key: process.env.VALIDATION_KEY || 'realyLongString'
    }
  }
}
