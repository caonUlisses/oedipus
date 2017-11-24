const {User} = require('./../models/user')

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth')
    const user  = await User.findByToken(token)
    try {
      if (!user) {
        throw new error({message: 'Houve um erro na requisição'})
      }
  
      req.user  = user
      req.token = token
      next()
    } catch(e) {
      res.status(401).send({message: 'Usuário não encontrado'})
    }
  }

module.exports = {authenticate}