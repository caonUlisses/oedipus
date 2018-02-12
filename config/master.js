module.exports = {
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/oedipus'
  },
  network: {
    port: process.env.PORT || 3000
  },
  files: {
    server: process.env.FILE_SERVER || './files'
  },
  app: {
    name: process.env.APP_NAME || 'oedipus',
    users: {
      key: process.env.USER_KEY || '6753cc7c049794d0c1300ef9ca24c50da471d6b5fca329d81c7a0e8bc6d388dd',
      default_access: process.env.DEFAULT_USER_ACCESS || 'user'
    },
    clients: {
      key: process.env.CLIENT_KEY || '2a2c7d546b44c1757e92e9225597cf9a709ded621f07288815d70ece3b19072c'
    },
    validation: {
      key: process.env.USER_VALIDATION_KEY || 'a6ea3ae2ed650e003315cf44d40f68834c9a399173416acf5e6079aa4807e5b7'
    }
  }
}
