const { User } = require('./../models/user.js')

const sudo = async (req, res, next) => {
  try {
    const token = req.header('x-auth')
    const user = await User.findByToken(token)

    if (!token) {
      return res.status(401).send({message: 'Faça login primeiro'})
    }

    if (!user) {
      return res.status(400).send({message: 'Usuário não encontrado'})
    }

    if (user.tokens.access !== 'sudo') {
      return res.status(401).send({message: 'Você não tem permissão para acessar este recurso'})
    }

    req.token = token
    next()
  } catch (error) {
    res.status(401).send({message: 'Usuário não encontrado'})
  }
}

module.exports = { sudo }
