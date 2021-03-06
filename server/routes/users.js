require('./../db/mongoose.js').connect()

const pick = require('lodash/pick')
const express = require('express')
const oedipus = express.Router()

// TODO: set up password recovery routes

const { authenticate } = require('./../middleware/authenticate.js')
const { picture } = require('./../utils/picture.js')
const { User } = require('./../models/user.js')
const { admin } = require('./../middleware/admin')

const config = require('./../../config/master')

oedipus.get('/admin/', admin, (req, res) => res.send('oi'))

oedipus.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find()

    if (!users) {
      throw new Error({ message: 'Houve um erro na página' })
    }
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send({ message: 'Não foi possível obter a lista de usuários', error })
  }
})

oedipus.post('/', async (req, res) => {
  try {
    let body = pick(req.body, ['name', 'email', 'password', 'access'])
    if (!req.files.picture) {
      body.picture = `${config.files.server}/default.png`
    } else {
      const pic = await picture.store(req.files.picture)
      picture.prepare(pic)
    }
    const user = await new User(body).save()
    const token = await user.generateAuthToken()
    res.header('x-auth', token).status(200).send({ message: 'Usuário criado com sucesso' })
  } catch (error) {
    res.status(400).send({ message: 'Houve um erro na criação do usuário', error })
  }
})

oedipus.get('/logout', async (req, res) => {
  try {
    const token = req.headers['x-auth']
    const user = await User.findByToken(token)
    user.removeToken(token)
    res.status(200).send({ message: 'Inicie uma sessão' })
  } catch (error) {
    res.status(400).send({ message: 'Erro ao sair do sistema', error })
  }
})

oedipus.get('/token', async (req, res) => {
  try {
    const token = req.header('x-auth')
    const user = await User.returnByToken(token)
    res.status(200).send(user)
  } catch (error) {
    res.status(401).send({ message: 'Não foi possível localizar o usuário', error })
  }
})

oedipus.get('/:_id', authenticate, async (req, res) => {
  try {
    const id = req.params._id
    const user = await User.findById(id)
    if (!user) {
      res.status(400).send({ message: 'Usuário inexistente' })
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send({ message: 'O usuário não foi localizado', error })
  }
})

oedipus.patch('/:_id', authenticate, async (req, res) => {
  try {
    const _id = req.params._id
    const body = pick(req.body, ['name', 'email', 'password', 'access'])
    if (!req.files.picture) {
      body.picture = `${config.files.server}/default.png`
    } else {
      const pic = await picture.store(req.files.picture)
      picture.prepare(pic)
    }
    const user = await User.findOneAndUpdate({ _id }, { $set: body }, { new: true })
    const token = req.token
    const userToken = user.tokens[0].token

    if (userToken !== token) {
      return res.status(401).send({ message: 'Você não pode alterar este usuário' })
    }

    res.send({ user })
  } catch (error) {
    res.status(400).send({ message: 'Houve um problema na alteração do Usuário', error })
  }
})

oedipus.delete('/:_id', authenticate, async (req, res) => {
  try {
    const id = req.params._id
    const user = await User.findByIdAndRemove(id)
    res.status(200).send({ user })
  } catch (error) {
    res.status(400).send({ message: 'Erro ao remover usuário', error })
  }
})

oedipus.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const token = await User.login(email, password)
    res.status(200).send(token)
  } catch (error) {
    res.status(401).send({ message: 'Usuário ou senha incorreto', error })
  }
})

module.exports = { oedipus }
