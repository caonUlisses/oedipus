const pick = require('lodash/pick')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const config = require('./../../config/master.js')

const key = config.app.clients.key

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  picture: {
    type: String,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email`
    }
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    minlength: 10
  },
  code: {
    type: String,
    required: true,
    minlength: 6
  },
  owns: [
    {
      type: String,
      required: false
    }
  ],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

ClientSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  return pick(userObject, ['_id', 'name', 'email', 'picture'])
}

ClientSchema.methods.generateAuthToken = async function (issuer = 'server') {
  try {
    const client = this
    const { name } = client
    const expiration = Date.now() + 2000000000
    const token = await jwt.sign({ _id: client._id.toHexString(), expiration, name, issuer }, key).toString()
    await client.tokens.push({ token })
    await client.save()

    return { token }
  } catch (error) {
    return { message: 'Houve um erro gerando o token de login', error }
  }
}

ClientSchema.statics.findByToken = async function (token) {
  try {
    const decoded = await jwt.verify(token, key)
    if (decoded.expiration < Date.now()) {
      return null
    }

    const user = this.findOne({
      '_id': decoded._id,
      'tokens.token': token
    })

    return user
  } catch (error) {
    return { error }
  }
}

ClientSchema.methods.removeToken = async function (token) {
  try {
    const User = this
    return User.update({ $pull: { tokens: { token } } })
  } catch (error) {
    return { message: 'Ocorreu um erro', error }
  }
}
const Client = mongoose.model('Client', ClientSchema)

module.exports = { Client }
