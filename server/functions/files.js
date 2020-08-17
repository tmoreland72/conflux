const storage = require("./firebase")

exports.upload = async (req, res) => {
   const { content } = req.body

   const name = req.params.name
   const userId = req.params.userId

   const payload = {
      content,
      userId,
      name: name,
   }

   await storage.fileUpload(payload)
   .then(() => {
      res.status(201).send('uploaded')
   })
   .catch(err => {
      console.error("files.js", "upload", "err", err)
      res.status(400).send("Bad Request")
   })
}

