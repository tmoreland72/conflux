const fb = require("./firebase")

exports.get = async (props) => {
   const { collection, collectionId, subcollection, subcollectionId, collectionGroup, where, orderBy } = props
   let payload = { collection, collectionId, subcollection, subcollectionId, collectionGroup, where, orderBy }
   return await fb.dbGet(payload)
   .then(result => {
      return result
   })
   .catch(err => {
      console.error(err)
      return false
   })
}

exports.add = async (props) => {
   const { collection, collectionId, subcollection, subcollectionId, item } = props
   let payload = { collection, collectionId, subcollection, subcollectionId, item }
   let result = await fb.dbAdd(payload)

   if (result) {
      return item
   } else {
      return false
   }
}

exports.update = async (props) => {
   const { collection, collectionId, subcollection, subcollectionId, updates } = props
   let payload = { collection, collectionId, subcollection, subcollectionId, updates }
   let result = await fb.dbUpdate(payload)
   return !!result
}

exports.delete = async (props) => {
   const { collection, collectionId, subcollection, subcollectionId } = props
   let payload = { collection, collectionId, subcollection, subcollectionId }
   let result = await fb.dbDelete(payload)
   return !!result
}
