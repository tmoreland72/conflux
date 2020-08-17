const init = require("./init")

// AUTHENTICATION
exports.authGetById = async (userId) => {
   return new Promise(async (resolve, reject) => {
      let response = await init.auth.getUser(userId)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error("authGet", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(false)
      }
   })
}

exports.authGetByEmail = async (email) => {
   return new Promise(async (resolve, reject) => {
      let response = await init.auth.getUserByEmail(email)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error("authGet", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(false)
      }
   })
}

exports.authGetByPhoneNumber = async (phoneNumber) => {
   return new Promise(async (resolve, reject) => {
      let response = await init.auth.getUserByPhoneNumber(phoneNumber)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error("authGet", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(false)
      }
   })
}

exports.authAdd = async (props) => {
   return new Promise(async (resolve, reject) => {
      const { userId, item } = props

      let payload = {
         uid: userId,
         email: item.email,
         emailVerified: true,
         phoneNumber: item.mobile,
         password: item.password,
         displayName: item.name,
         photoUrl: item.image,
         disabled: false,
      }

      try {
         let result = await init.auth.createUser(payload)
         resolve({ success: true, res: result })
      } catch(err) {
         console.error("authAdd", "err", err)
         reject({ success: false, ...err })
      }
   })
}

exports.authDelete = async (userId) => {
   return new Promise(async (resolve, reject) => {
      let response = await init.auth.deleteUser(userId)
      .then(() => {
         return true
      })
      .catch(err => {
         console.error("authAdd", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(response)
      }
   })
}

exports.authCreateAuthToken = async ({userId, role = "member", sub = "free"}) => {
   return new Promise(async (resolve, reject) => {
      /*
      Account Claim usage in Firebase security rules:
         Database Rules: read: auth.token.role === 'owner'...
         Cloud Storage: read: if request.auth.token.role === 'member'...
      */
      const additionalClaims = { role, sub }
      let response = await init.auth.createCustomToken(userId, additionalClaims)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error("authGet", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(false)
      }
   })
}

// FIRESTORE
exports.dbGet = props => {
   return new Promise(async (resolve, reject) => {
      const {
         collection,
         collectionId,
         subcollection,
         subcollectionId,
         collectionGroup,
         where,
         orderBy,
      } = props

      let queryType = "many"
      let queryRef = null

      if (collectionGroup) {
         queryRef = init.db.collectionGroup(collectionGroup)
      } else {
         queryRef = init.db.collection(collection)

         if (collectionId) {
            queryType = "one"
            queryRef = queryRef.doc(collectionId)
         }

         if (subcollection) {
            queryType = "many"
            queryRef = queryRef.collection(subcollection)
         }

         if (subcollectionId) {
            queryType = "one"
            queryRef = queryRef.doc(subcollectionId)
         }
      }

      if (where) {
         queryRef = queryRef.where(where[0], where[1], where[2])
      }

      if (orderBy) {
         queryRef = queryRef.orderBy(orderBy)
      }

      let response = await queryRef
      .get()
      .then(result => {
         if (queryType === "one") {
            if (result.exists) {
               let doc = {
                  ...result.data(),
                  id: result.id,
               }
               return doc
            } else {
               return false
            }
         }

         if (queryType === "many") {
            let documents = []
            result.docs.map(item => {
               let doc = {
                  ...item.data(),
                  id: item.id,
               }
               documents.push(doc)
            })

            return documents
         }
      })
      .catch(err => {
         console.error("dbGet", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(response)
      }
   })
}

exports.dbAdd = props => {
   return new Promise((resolve, reject) => {
      const {
         collection,
         collectionId,
         subcollection,
         subcollectionId,
         item,
      } = props

      let payload = {
         ...item,
         id: subcollectionId ? subcollectionId : collectionId,
      }

      let dbRef = init.db.collection(collection)
      dbRef = dbRef.doc(collectionId)

      if (subcollection) {
         dbRef = dbRef.collection(subcollection)
         dbRef = dbRef.doc(subcollectionId)
      }

      try {
         dbRef.set(payload)
         resolve(payload)
      } catch(err) {
         console.error("firebase", "dbAdd", "err", err)
         reject(err)
      }
   })
}

exports.dbUpdate = props => {
   return new Promise(async (resolve, reject) => {
      const {
         collection,
         collectionId,
         subcollection,
         subcollectionId,
         updates,
      } = props

      let payload = {
         ...updates,
      }
      let dbRef = init.db.collection(collection)
      dbRef = dbRef.doc(collectionId)

      if (subcollection) {
         dbRef = dbRef.collection(subcollection)
         dbRef = dbRef.doc(subcollectionId)
      }

      let response = await dbRef
      .update(payload)
      .then(() => {
         return true
      })
      .catch(err => {
         console.error("dbUpdate", "err", err)
         return false
      })

      if (response) {
         resolve(response)
      } else {
         reject(response)
      }
   })
}

exports.dbDelete = props => {
   return new Promise((resolve, reject) => {
      const { collection, collectionId, subcollection, subcollectionId } = props

      let dbRef = init.db.collection(collection)
      dbRef = dbRef.doc(collectionId)
      if (subcollection) {
         dbRef = dbRef.collection(subcollection)
         dbRef = dbRef.doc(subcollectionId)
      }

      dbRef
      .delete()
      .then(result => {
         resolve(subcollectionId ? subcollectionId : collectionId)
      })
      .catch(err => {
         console.error("dbDelete", "end", "err", err)
         reject(false)
      })
   })
}
