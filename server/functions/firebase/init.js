
const admin = require("firebase-admin")
const serviceAccount = require(process.env.FIREBASE_SERVICEACCOUNT)
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: process.env.FIREBASE_DATABASEURL,
   storageBucket: process.env.FIREBASE_STORAGEBUCKET,
})
exports.db = admin.firestore()
exports.auth = admin.auth()
