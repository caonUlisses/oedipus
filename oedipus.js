'use strict'

const { oedipus } = require('./server/routes/users.js')
const { authenticate } = require('./server/middleware/authenticate.js')
const { admin } = require('./server/middleware/admin.js')
const { sudo } = require('./server/middleware/sudo.js')

module.exports = {
  oedipus,
  authenticate
}
