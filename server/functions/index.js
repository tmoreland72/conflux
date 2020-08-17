const pages = require('./pages')
const spaces = require('./spaces')
const users = require('./users')
const files = require('./files')

const functions = require('firebase-functions')

const express = require('express')
const app = express()

app.use(function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*')
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
   res.header('Access-Control-Allow-Methods', '*')
   next()
})

// Authentication Operations
app.post('/auth', async (req, res) => {
   await users.login(req, res)
})

app.post('/register', async (req, res) => {
   await users.create(req, res)
})


// Storage Operations
app.post('/files/:userId/:name', async (req, res) => {
   await files.upload(req, res)
})


// Spaces Operations
app.get('/:tenantId/spaces', async (req, res) => {
   await spaces.get(req, res)
})

app.get('/:tenantId/spaces/:id', async (req, res) => {
   await spaces.getById(req, res)
})

app.post('/:tenantId/spaces', async (req, res) => {
   await spaces.create(req, res)
})

app.patch('/:tenantId/spaces/:id', async (req, res) => {
   await spaces.update(req, res)
})

app.delete('/:tenantId/spaces/:id', async (req, res) => {
   await spaces.delete(req, res)
})



// Pages Operations
app.get('/:tenantId/pages', async (req, res) => {
   await pages.get(req, res)
})

app.get('/:tenantId/pages/:id', async (req, res) => {
   await pages.getById(req, res)
})

app.post('/:tenantId/pages', async (req, res) => {
   await pages.create(req, res)
})

app.patch('/:tenantId/pages/:id', async (req, res) => {
   await pages.update(req, res)
})

app.delete('/:tenantId/pages/:id', async (req, res) => {
   await pages.delete(req, res)
})



// User Operations
app.get('/users/id', async (req, res) => {
   await users.getUserId(req, res)
})

app.get('/:tenantId/users', async (req, res) => {
   await users.getByTenant(req, res)
})

app.get('/:tenantId/users/:userId', async (req, res) => {
   await users.getByUserId(req, res)
})

app.post('/:tenantId/users', async (req, res) => {
   await users.create(req, res)
})

app.patch('/:tenantId/users/:userId', async (req, res) => {
   await users.update(req, res)
})

app.delete('/:tenantId/users/:userId', async (req, res) => {
   await users.delete(req, res)
})

app.get('/:tenantId/users/:userId/:subcollection', async (req, res) => {
   await users.getSubcollectionItems(req, res)
})

app.post('/:tenantId/users/:userId/:subcollection', async (req, res) => {
   await users.addSubcollectionItem(req, res)
})

app.delete('/:tenantId/users/:userId/:subcollection/:subcollectionId', async (req, res) => {
   await users.deleteSubcollectionItem(req, res)
})



exports.api = functions.https.onRequest(app)
