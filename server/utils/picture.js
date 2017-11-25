const picture = {

    preparePicture : (req) => {
        const hash    = Math.random().toString(36).substring(7)
        const picture = req.files ? req.files.picture : null
        
        const pictureName = picture ? hash + picture.name : "default.png"
        const picturePath = `./files/${pictureName}`
        
        if(picture) {
            picture.mv(`./files/${pictureName}`, (err) => {
                if(err) {
                    return err
                }
            })
        }
        
        return picturePath
    }
}
    
module.exports = {
    picture
}