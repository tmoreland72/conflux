const admin = require("firebase-admin")
const serviceAccount = require("../google-service-account.json")
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://conflux-bacaa.firebaseio.com",
   storageBucket: "conflux-bacaa.appspot.com",
})
exports.db = admin.firestore()
exports.auth = admin.auth()
