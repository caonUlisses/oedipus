'use strict'

require('dotenv').config()

const cors = require('cors')
const logger = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const { oedipus } = require('./server/routes/users.js')
const { authenticate } = require('./server/middleware/authenticate.js')

const config = require('./config/master')
const port = config.network.port

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())
app.use(logger('dev'))

app.use('/', oedipus)

app.use((req, res, next) => {
  const err = new Error({ message: 'Página não encontrada' })
  err.status = 404
  res.status(404).send(err)
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.oedipus.get('env') === err

  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => {
  console.log('running', port)
})

module.exports = { app, authenticate }
