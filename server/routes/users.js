const _ = require('lodash')
const express = require('express')
const oedipus = express.Router()

const { Mongoose } = require('./../db/mongoose.js')

const { authenticate } = require('./../middleware/authenticate.js')
const { picture } = require('./../utils/picture.js')
const {User} = require('./../models/user.js')

oedipus.get('/users/', authenticate, async (req, res) => {
  try {
    const users = await User.find()

    if (!users) {
      throw new error({ message: 'Houve um erro na página' })
    }
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send({ message: 'Houve um erro', error })
  }
})

oedipus.post('/users/', async (req, res) => {
  try {
    let body = _.pick(req.body, ['name', 'email', 'password'])
    body.picture = picture.preparePicture(req)
    let access = req.body.access ? req.body.access : 'admin'
    let user = await new User(body)
    await user.save()
    const token = await user.generateAuthToken(access)

    res.header('x-auth', token).status(200).send({ message: 'Usuário criado com sucesso' })
  } catch (error) {
    res.status(400).send({ message: 'Houve um erro', error })
  }
})

oedipus.patch('/users/:_id', authenticate, async (req, res) => {
  try {
    const _id = req.params._id
    const body = _.pick(req.body, ['name', 'email', 'password'])
    body.picture = picture.preparePicture(req)
    const user = await User.findOneAndUpdate({ _id }, { $set: body }, { new: true })
    const token = req.token
    const userToken = user.tokens[0].token

    if (userToken !== token) {
      return res.status(401).send({ message: 'Você não pode alterar este usuário' })
    }

    res.send({ user })
  } catch (e) {
    res.status(400).send({ message: 'Houve um problema na alteração do Usuário' })
  }
})

oedipus.get('/users/:id', authenticate, async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById(id)
    if (!user) {
      res.status(400).send({ message: 'Não deu certo' })
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send('Ocorreu um erro')
  }
})

oedipus.delete('/users/:id', authenticate, async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findByIdAndRemove(id)
    res.status(200).send({ user })
  } catch (e) {
    res.status(400).send(e)
  }
})

oedipus.get('/auth', async (req, res) => {
  const token = req.header('x-auth')

  try {
    const user = await User.returnByToken(token)
    res.status(200).send(user)
  } catch (e) {
    res.status(401).send('Não foi possível localizar o usuário')
  }
})

oedipus.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findByCredentials(email, password)
    const payload = {
      user: user,
      tokens: user.tokens
    }
    res.status(200).send(payload)
  } catch (e) {
    res.status(401).send('Usuário ou senhas incorretos', e)
  }
})

module.exports = {oedipus}
