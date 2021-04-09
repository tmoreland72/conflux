const { uid } = require('uid')

const { admin, firestore } = require('../services/firebase')
const chapters = require('./chapters')
const saveAuditEventToDB = require('./audit')

const get = async (id) => {
   try {
      let doc = await firestore.collection('pages').doc(id).get()
      return doc.data()
   } catch (error) {
      throw new Error(error.message)
   }
}

const getByChapter = async (chapterId) => {
   try {
      let snapshot = await firestore
         .collection('pages')
         .where('chapterId', '==', chapterId)
         .get()
      if (snapshot.empty) return []
      let pages = []
      snapshot.docs.forEach((doc) => {
         pages.push(doc.data())
      })
      return pages
   } catch (error) {
      throw new Error(error.message)
   }
}

const create = async (req, page) => {
   try {
      const chapter = await chapters.get(page.chapterId)
      page = {
         ...page,
         id: page.id ? page.id : uid(),
         content: page.content ? page.content : '# Content',
         collaborators: chapter.collaborators,
         created: new Date().valueOf(),
         updated: new Date().valueOf(),
      }

      await firestore.collection('pages').doc(page.id).set(page)

      saveAuditEventToDB(req, firestore, {
         performedOn: page.id,
         action: 'createPage',
         data: page,
      })

      return await get(page.id)
   } catch (error) {
      throw new Error(`pages create error: ${error.message}`)
   }
}

const update = async (req, { id, changes }) => {
   try {
      changes = {
         ...changes,
         updated: new Date().valueOf(),
      }
      await firestore.collection('pages').doc(id).update(changes)

      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'updatePage',
         data: changes,
      })

      return await get(id)
   } catch (error) {
      throw new Error(error.message)
   }
}

const del = async (req, id) => {
   try {
      await firestore.collection('pages').doc(id).delete()

      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'deletePage',
      })

      return true
   } catch (error) {
      throw new Error(error.message)
   }
}

exports.get = get
exports.getByChapter = getByChapter
exports.create = create
exports.update = update
exports.del = del
