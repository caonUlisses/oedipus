const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
  //
})

const Client = mongoose.model('Client', ClientSchema)

module.exports = { Client }
