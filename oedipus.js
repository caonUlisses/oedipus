'use strict'

const { oedipus } = require('./server/routes/users.js')
const { authenticate } = require('./server/middleware/authenticate.js')

module.exports = {
  oedipus,
  authenticate
}
