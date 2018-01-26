const {User} = require('./../models/user')

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('x-auth')
    const user = await User.findByToken(token)

    if (!token) {
      return res.status(401).send({message: 'Faça login primeiro'})
    }

    if (!user) {
      return res.status(400).send({message: 'Houve um erro na requisição'})
    }

    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(401).send({message: 'Usuário não encontrado'})
  }
}

module.exports = {authenticate}
