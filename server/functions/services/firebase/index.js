const admin = require('firebase-admin')
const serviceAccount = require('./service-account.json')

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const projectId = firebaseConfig.projectId

if (process.env.FUNCTIONS_EMULATOR === 'true') {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${projectId}.firebaseio.com`,
   })
} else {
   admin.initializeApp()
}

exports.admin = admin
exports.firestore = admin.firestore()
exports.fireauth = admin.auth()
exports.firebucket = admin.storage().bucket(`${projectId}.appspot.com`)
