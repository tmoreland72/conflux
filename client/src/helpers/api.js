import { http } from 'boot/axios'

const BASEURL = process.env.API_BASEURL

const getItems = async (tenantId, collection, collectionId, subcollection) => {
   let url = BASEURL + '/' + tenantId + '/' + collection
   if (collectionId && subcollection) {
      url = url + '/' + collectionId + '/' + subcollection
   }
   let config = {
      method: 'GET',
      url,
      headers: {
         Accept: 'application/json',
      },
   }

   try {
      let result = await http(config)
      if (result.status === 200) {
         return {
            success: true,
            data: result.data,
         }
      } else {
         return {
            success: false,
            data: result.data,
         }
      }
   } catch (err) {
      console.error('api', 'getItems', 'error', result.status, result.statusText)
      return {
         success: false,
         status: result.status,
         statusText: result.statusText,
      }
   }
}

const getItem = async (tenantId, collection, id) => {
   let config = {
      method: 'GET',
      url: BASEURL + '/' + tenantId + '/' + collection + '/' + id,
      headers: {
         Accept: 'application/json',
      },
   }
   let result = await http(config)

   if (result.status === 200) {
      let res = {
         success: true,
         data: result.data,
      }
      return res
   } else {
      console.error('api', 'getItem', 'error', result.status, result.statusText)
      let res = {
         success: false,
         status: result.status,
         statusText: result.statusText,
      }
      return res
   }
}

const createItem = async props => {
   const { tenantId, collection, collectionId, subcollection, createdBy, item } = props
   let url = BASEURL + '/' + tenantId + '/' + collection
   if (collectionId && subcollection) {
      url = url + '/' + collectionId + '/' + subcollection
   }
   let config = {
      method: 'POST',
      url,
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
      data: { item, createdBy },
   }

   try {
      let result = await http(config)
      if (result.status === 201) {
         return {
            success: true,
            data: result.data,
         }
      } else {
         return result.data
      }
   } catch (err) {
      console.error('api', 'createItem', 'error', err)
      return {
         success: false,
         result: err,
      }
   }
}

const updateItem = async props => {
   const { tenantId, collection, collectionId, subcollection, subcollectionId, updatedBy, updates } = props
   let url = BASEURL + '/' + tenantId + '/' + collection + '/' + collectionId
   if (subcollection && subcollectionId) {
      url = url + '/' + subcollection + '/' + subcollectionId
   }

   let config = {
      method: 'PATCH',
      url: url,
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
      data: { updates, updatedBy },
   }

   try {
      let result = await http(config)
      if (result.status === 200) {
         return {
            success: true,
            result,
         }
      }
   } catch (err) {
      console.error('api', 'updateItem', 'error', err)
      return {
         success: false,
         result: err,
      }
   }
}

const deleteItem = async props => {
   const { tenantId, collection, collectionId, subcollection, subcollectionId } = props
   let url = BASEURL + '/' + tenantId + '/' + collection + '/' + collectionId
   if (subcollection && subcollectionId) {
      url = url + '/' + subcollection + '/' + subcollectionId
   }

   let config = {
      method: 'DELETE',
      url: url,
      headers: {
         Accept: '*/*',
      },
   }

   try {
      let result = await http(config)

      if (result.status === 204) {
         return {
            success: true,
         }
      } else {
         return { success: false }
      }
   } catch(err) {
      console.error('api', 'deleteItem', 'error', result.status, result.statusText)
      return { success: false, result: err }
   }
}

const getSpaces = async (user) => {
   let url = BASEURL + '/spaces/retrieve'
   let config = {
      method: 'POST',
      url,
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
      data: user,
   }

   try {
      let result = await http(config)
      if (result.status === 200) {
         return {
            success: true,
            data: result.data,
         }
      } else {
         return result.data
      }
   } catch (err) {
      console.error('api', 'getSpaces', 'error', err)
      return {
         success: false,
         result: err,
      }
   }
}

const getPages = async (user, spaces) => {
   let url = BASEURL + '/pages/retrieve'
   let config = {
      method: 'POST',
      url,
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
      data: { REQUESTER: user, SPACES: spaces },
   }

   try {
      let result = await http(config)
      if (result.status === 200) {
         return {
            success: true,
            data: result.data,
         }
      } else {
         return result.data
      }
   } catch (err) {
      console.error('api', 'getPages', 'error', err)
      return {
         success: false,
         result: err,
      }
   }
}

export {
   getItems,
   getItem,
   createItem,
   updateItem,
   deleteItem,
   getSpaces,
   getPages,
}
