const sharp = require('sharp')
const SHA256 = require('crypto-js/sha256')
const config = require('./../../config/master')
const fileServer = config.files.server

const picture = {
  name: null,
  store: async (file) => {
    try {
      const name = await picture.setName(file.name)
      await file.mv(`${fileServer}/${name}`)
      this.name = name
      return `${fileServer}/${name}`
    } catch (error) {
      throw new Error(error)
    }
  },
  prepare: async (file) => {
    try {
      const resize = await sharp(file)
      await resize.resize(400, 400)
      await resize.toFile(`${fileServer}/400x400_${this.name}`)
      await resize.resize(25, 25)
      await resize.toFile(`${fileServer}/thumbnails/thumb_${this.name}`)
    } catch (error) {
      throw new Error(error)
    }
  },

  setName: async (fileName) => {
    try {
      const hash = SHA256(Math.random(36).toString().substring(7))
      return hash + fileName
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = { picture }
