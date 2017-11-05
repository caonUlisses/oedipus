require('dotenv').config()

const _            = require('lodash')
const path         = require('path')
const logger       = require('morgan')
const express      = require('express')
const bodyParser   = require('body-parser')
const fileUpload   = require('express-fileupload')

const {User}         = require('./server/models/user')
const {authenticate} = require('./server/middleware/authenticate')
const {mongoose}     = require('./server/db/mongoose')
const {ObjectId}     = require('mongodb')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())
app.use(logger('dev'))

app.get('/users/', authenticate, (req, res) => {
  User.find().then((users) => {
    return res.status(200).send({users})
  }).catch((e) => {
    return res.status(400).send(e)
  })
})

app.post('/users/', (req, res) => {
  let hash    = Math.random().toString(36).substring(7)
  let picture = req.files ? req.files.picture : null
  
  let pictureName = picture ? hash + picture.name : "default.png"
  let picturePath = `./files/${pictureName}` 
   
  if(picture) {
      picture.mv(`./files/${pictureName}`, (err) => {
          if(err) {
              return res.send(err)
            }
          })
  }
        
  let body     = _.pick(req.body, ['name','email', 'password'])
  body.picture = picturePath

  let access   = req.body.access ? req.body.access : null
  let user     = new User(body)
  
  
  user.save().then(() => {
    if(access) {
        return user.generateAuthToken(access)
      } else{
        return user.generateAuthToken('admin')
    }
  }).then((token) => {
    res.header('x-auth', token).status(200).send({message: "Usuário criado com sucesso"})
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('users/:id', (req, res) => {
  let id = req.params.id
  User.findById(id).then((user) => {
    res.status(200).send({user})
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.use((req, res, next) => {
  let err        = new Error('Not Found')
      err.status = 404;
  next(err)
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error   = req.app.get('env') === err

  res.status(err.status || 500)
  res.send(err)
})

module.exports = {app}