const SHA256 = require('crypto-js/sha256')
const jimp = require('jimp')

const picture = {

  storePicture: async (req) => {
    try {
      const hash = Math.random(26).toString().substring(7)
      const picture = req.files ? req.files.picture : null
      const pictureName = picture ? SHA256(hash) + picture.name : 'default.png'
      const picturePath = `./files/${pictureName}`

      if (picture) {
        await picture.mv(`./files/${pictureName}`, (err) => (err))
        const thumb = await jimp.read(picturePath)
        await thumb.resize(25, 25)
        await thumb.write(`./files/thumb_${pictureName}`)
      }

      return picturePath
    } catch (error) { return error }
  }
}

module.exports = { picture }
