const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')

const key = '$2y$10$hqaELBb/CTd7fwUwduC18uqC4G0Iw.T3IGM3c21HGKMRFHNnRTQ7m'

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
    access: {
      type: String,
      required: true
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

UserSchema.methods.generateAuthToken = async function (access) {
  try {
    const user = this
    const token = await jwt.sing({_id: user._id.toHexString(), access}, key).toString()
    user.tokens.push({access, token})
    await user.save()

    return token
  } catch (e) {
    return e
  }
}

UserSchema.statics.returnByToken = async function (token) {
  try {
    const User = this
    const decoded = await jwt.verify(token, key)
    const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })

    return user
  } catch (error) {
    return { err: 'Ocorreu um erro ao buscar o usuário', error }
  }
}

UserSchema.statics.findByToken = async function (token) {
  try {
    const User = this
    const decoded = await jwt.verify(token, key)
    const user = User.findOne({
      '_id': decoded._id,
      'tokens.token': token
    })

    return user
  } catch (e) {
    return e
  }
}

UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const User = this
    const user = await User.findOne({email})
    const res = await bcrypt.compare(password, user.password)
    if (!res) {
      return { err: 'Usuário não encontrado' }
    }

    return user
  } catch (e) {
    return {err: 'Usuário ou senha incorretos', e}
  }
}

UserSchema.methods.removeToken = async function (token) {
  try {
    const User = this
    return User.update({ $pull: {tokens: { token }} })
  } catch (e) {
    return { err: 'Ocorreu um erro', e }
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

module.exports = {User}
