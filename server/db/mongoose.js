let mongoose = require('mongoose')
let config = require('./../../config/master')

mongoose.Promise = global.Promise

const connect = () => {
  mongoose.connect(config.db.url || 'mongodb://mongo:27017/auth')
}

module.exports = { connect }
