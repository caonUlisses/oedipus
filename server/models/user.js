const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID
const validator = require('validator')
const config = require('./../../config/master.js')

const key = config.app.key
const serverId = new ObjectID()

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  picture: {
    type: String,
    minlength: 1
  },
  access: {
    type: String,
    required: true,
    default: config.app.users.default_access
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
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    device: {
      _id: {
        type: String,
        required: false,
        default: serverId
      }
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  return _.pick(userObject, ['_id', 'name', 'email'])
}

UserSchema.methods.generateAuthToken = async function (issuer = 'force') {
  try {
    const user = this
    const { name, access } = user
    const expiration = Date.now() - 2000000000
    const token = await jwt.sign({ _id: user._id.toHexString(), access, expiration, name, issuer }, key).toString()
    await user.tokens.push({ token, access })
    await user.save()

    return { token }
  } catch (error) {
    return { message: 'Houve um erro gerando o token de login', error }
  }
}

UserSchema.statics.findByToken = async function (token) {
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

UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const User = this
    const user = await User.findOne({ email })
    const res = await bcrypt.compare(password, user.password)
    if (!res) {
      return { err: 'Usuário não encontrado' }
    }

    return user
  } catch (error) {
    return { message: 'Usuário ou senha incorretos', error }
  }
}

UserSchema.methods.removeToken = async function (token) {
  try {
    const User = this
    return User.update({ $pull: { tokens: { token } } })
  } catch (error) {
    return { message: 'Ocorreu um erro', error }
  }
}

UserSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findByCredentials(email, password)

    if (!user) {
      return { message: 'Usuário ou senha incorretos' }
    }

    const token = await user.generateAuthToken()
    return token
  } catch (error) {
    return { message: 'Houve um erro', error }
  }
}

UserSchema.pre('save', function (next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return err
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return err
        }
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }
