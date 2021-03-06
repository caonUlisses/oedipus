const { User } = require('./../models/user.js')

const admin = async (req, res, next) => {
  try {
    const token = req.header('x-auth')
    const user = await User.findByToken(token)

    console.log(user)
    if (!token) {
      return res.status(401).send({ message: 'Faça login primeiro' })
    }

    if (!user) {
      return res.status(400).send({ message: 'Faça login novamente' })
    }

    if (user.access !== 'admin') {
      return res.status(401).send({ message: 'Você não tem permissão para acessar este recurso' })
    }

    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ message: 'Usuário não encontrado', error })
  }
}

module.exports = { admin }
