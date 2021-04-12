const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use((req, res, next) => {
   req.env = {
      app: {
         env: process.env.APP_ENV,
         jwtsecret: process.env.APP_JWTSECRET,
      },
      algolia: {
         appid: process.env.ALGOLIA_APPID,
         adminkey: process.env.ALGOLIA_ADMINKEY,
         index: process.env.ALGOLIA_INDEX,
      },
      sendgrid: {
         apikey: process.env.SENDGRID_APIKEY,
      },
   }
   next()
})

const auth = require('./lib/auth')

const publicRoutes = require('./routes/public')
app.use('/public', publicRoutes)

const userRoutes = require('./routes/users')
app.use('/users', auth, userRoutes)

const bookRoutes = require('./routes/books')
app.use('/books', auth, bookRoutes)

const chapterRoutes = require('./routes/chapters')
app.use('/chapters', auth, chapterRoutes)

const pageRoutes = require('./routes/pages')
app.use('/pages', auth, pageRoutes)

const searchRoutes = require('./routes/search')
app.use('/search', auth, searchRoutes)

app.use(function (req, res) {
   res.status(404).send()
})

exports.api = functions.https.onRequest(app)

const events = require('./lib/events')
exports.createBook = events.createBook
exports.updateBook = events.updateBook
exports.deleteBook = events.deleteBook
exports.deleteChapter = events.deleteChapter
exports.createPage = events.createPage
exports.updatePage = events.updatePage
exports.deletePage = events.deletePage
