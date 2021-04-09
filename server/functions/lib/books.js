const { uid } = require('uid')

const { admin, firestore } = require('../services/firebase')
const chapters = require('./chapters')
const saveAuditEventToDB = require('./audit')

// const get = async (id) => {
//    try {
//       let doc = await firestore.collection('books').doc(id).get()
//       return doc.data()
//    } catch (error) {
//       throw new Error(error.message)
//    }
// }

const get = async (id) => {
   try {
      let doc = await firestore.collection('books').doc(id).get()
      return doc.data()
   } catch (error) {
      throw new Error(error.message)
   }
}

const create = async (req, book) => {
   try {
      book = {
         ...book,
         id: book.id ? book.id : uid(),
         settings: {},
         overview: `# ${book.title}`,
         created: new Date().valueOf(),
         updated: new Date().valueOf(),
      }

      await firestore.collection('books').doc(book.id).set(book)

      saveAuditEventToDB(req, firestore, {
         performedOn: book.id,
         action: 'createBook',
         data: book,
      })

      book = await get(book.id)

      if (book.subtitle && book.subtitle === 'Auto-created') {
         await chapters.create(req, {
            bookId: book.id,
            title: 'Getting Started',
            subtitle: 'Auto-created',
         })
      }
      return book
   } catch (error) {
      console.error('books', error)
      throw new Error(error.message)
   }
}

const update = async (req, { id, changes }) => {
   try {
      changes = {
         ...changes,
         updated: new Date().valueOf(),
      }
      await firestore.collection('books').doc(id).update(changes)
      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'updateBook',
         data: changes,
      })
      return await get(id)
   } catch (error) {
      throw new Error(error.message)
   }
}

const del = async (req, id) => {
   try {
      await firestore.collection('books').doc(id).delete()

      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'deleteBook',
      })

      return true
   } catch (error) {
      throw new Error(error.message)
   }
}

exports.get = get
exports.create = create
exports.update = update
exports.del = del
