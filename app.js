require('dotenv').config()

const _ = require('lodash')
const cors = require('cors')
const logger = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const { userRouter } = require('./server/routes/users.js')
const { authenticate } = require('./server/middleware/authenticate.js')

const oedipus = express()

oedipus.use(cors())
oedipus.use(bodyParser.json())
oedipus.use(bodyParser.urlencoded({ extended: false }))
oedipus.use(fileUpload())
oedipus.use(logger('dev'))

oedipus.use('/', userRouter)

oedipus.use((req, res, next) => {
  const err = new Error('Página não encontrada')
  err.status = 404
  next(err)
})

oedipus.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.oedipus.get('env') === err

  res.status(err.status || 500)
  res.send(err)
})

oedipus.listen(3000, () => {
  console.log('running on 3000')
})

module.exports = { oedipus, authenticate }
