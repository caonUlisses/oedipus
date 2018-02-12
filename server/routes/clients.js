require('./../db/mongoose.js').connect()

const express = require('express')
const client = express.Router()

const { Client } = require('./../models/client.js')

client.get('/', async (req, res) => {
  const clients = await Client.find({})
  res.status(200).send(clients)
})

module.exports = { client }
