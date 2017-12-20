module.exports = {
  db: {
    url: process.env.DB_URL || 'mongodb://mongo:27017/auth'
  },
  network: {
    port: process.env.PORT || 3000
  }
}
