const fs = require('fs')
const { uid } = require('uid')

const { admin, firestore } = require('../services/firebase')
const books = require('./books')
const pages = require('./pages')
const saveAuditEventToDB = require('./audit')

const contentPage = fs.readFileSync('lib/defaultPage.md', 'utf8')

const get = async (id) => {
   try {
      let doc = await firestore.collection('chapters').doc(id).get()
      return doc.data()
   } catch (error) {
      throw new Error(error.message)
   }
}

const getByBook = async (bookId) => {
   try {
      let snapshot = await firestore
         .collection('chapters')
         .where('bookId', '==', bookId)
         .get()
      if (snapshot.empty) return []
      let chapters = []
      snapshot.docs.forEach((doc) => {
         chapters.push(doc.data())
      })
      return chapters
   } catch (error) {
      throw new Error(error.message)
   }
}

const create = async (req, chapter) => {
   try {
      const book = await books.get(chapter.bookId)

      chapter = {
         ...chapter,
         id: chapter.id ? chapter.id : uid(),
         collaborators: book.collaborators,
         created: new Date().valueOf(),
         updated: new Date().valueOf(),
      }

      await firestore.collection('chapters').doc(chapter.id).set(chapter)
      chapter = await get(chapter.id)

      saveAuditEventToDB(req, firestore, {
         performedOn: chapter.id,
         action: 'createChapter',
         data: chapter,
      })

      if (chapter.subtitle && chapter.subtitle === 'Auto-created') {
         await pages.create(req, {
            chapterId: chapter.id,
            title: 'Page Basics',
            subtitle: 'Auto-created',
            content: contentPage,
         })
      }
      return chapter
   } catch (error) {
      console.error(`chapters create error: ${error.message}`)
      throw new Error(error.message)
   }
}

const update = async (req, { id, changes }) => {
   try {
      changes = {
         ...changes,
         updated: new Date().valueOf(),
      }
      await firestore.collection('chapters').doc(id).update(changes)

      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'updateChapter',
         data: changes,
      })

      return await get(id)
   } catch (error) {
      throw new Error(error.message)
   }
}

const del = async (req, id) => {
   try {
      await firestore.collection('chapters').doc(id).delete()

      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'deleteChapter',
      })

      return true
   } catch (error) {
      throw new Error(error.message)
   }
}

exports.get = get
exports.getByBook = getByBook
exports.create = create
exports.update = update
exports.del = del
