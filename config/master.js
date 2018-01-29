module.exports = {
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/auth'
  },
  network: {
    port: process.env.PORT || 3000
  },
  app: {
    key: process.env.APP_KEY || 'reallyLongKeyHere'
  }
}
