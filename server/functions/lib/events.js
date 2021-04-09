const functions = require('firebase-functions')

const firebase = require('../services/firebase')
const algolia = require('../services/algolia')
const sendgrid = require('../services/sendgrid')
const books = require('../lib/books')
const chapters = require('../lib/chapters')
const pages = require('../lib/pages')

const pushToAlgolia = async (page) => {
   const chapter = await chapters.get(page.chapterId)
   const book = await books.get(chapter.bookId)
   page = {
      ...page,
      book,
      chapter,
   }
   algolia.push(page)
}

exports.createUser = functions.firestore
   .document('users/{id}')
   .onCreate(async (snap, context) => {
      try {
         const user = snap.data()
         sendgrid.sendRegisterResponse({
            to: user.email,
            name: user.name,
         })
      } catch (error) {
         console.error('createUser', error)
         return
      }
   })

exports.createBook = functions.firestore
   .document('books/{id}')
   .onCreate(async (snap, context) => {
      try {
         const book = snap.data()
      } catch (error) {
         console.error('createBook', error)
         return
      }
   })

exports.updateBook = functions.firestore
   .document('books/{id}')
   .onUpdate(async (change, context) => {
      try {
         const before = change.before.data()
         const after = change.after.data()
         const book = after

         if (
            JSON.stringify(before.collaborators) !== JSON.stringify(after.collaborators)
         ) {
            const bookChapters = await chapters.getByBook(book.id)
            bookChapters.forEach(async (chapter) => {
               chapters.update({
                  id: chapter.id,
                  changes: { collaborators: book.collaborators },
               })

               const chapterPages = await pages.getByChapter(chapter.id)
               chapterPages.forEach((page) => {
                  pages.update({
                     id: page.id,
                     changes: { collaborators: book.collaborators },
                  })
               })
            })
         }

      } catch (error) {
         console.error('updateBook', error)
         return
      }
   })

exports.deleteBook = functions.firestore
   .document('books/{id}')
   .onDelete(async (snap, context) => {
      try {
         const book = snap.data()
         const bookChapters = await chapters.getByBook(book.id)
         bookChapters.forEach((chapter) => {
            chapters.del(chapter.id)
         })
      } catch (error) {
         console.error('deleteBook', error)
         return
      }
   })

exports.deleteChapter = functions.firestore
   .document('chapters/{id}')
   .onDelete(async (snap, context) => {
      try {
         const chapter = snap.data()
         const chapterPages = await pages.getByChapter(chapter.id)
         chapterPages.forEach((chapter) => {
            pages.del(chapter.id)
         })
      } catch (error) {
         console.error('deleteChapter', error)
         return
      }
   })

exports.createPage = functions.firestore
   .document('pages/{id}')
   .onCreate(async (snap, context) => {
      try {
         const page = snap.data()
         pushToAlgolia(page)
      } catch (error) {
         console.error('createPage', error)
         return
      }
   })

exports.updatePage = functions.firestore
   .document('pages/{id}')
   .onUpdate(async (change, context) => {
      try {
         const before = change.before.data()
         const after = change.after.data()
         let page = after

         pushToAlgolia(page)
      } catch (error) {
         console.error('updatePage', error)
         return
      }
   })

exports.deletePage = functions.firestore
   .document('pages/{id}')
   .onDelete(async (snap, context) => {
      try {
         const page = snap.data()
         algolia.delete(page.id)
      } catch (error) {
         console.error('deletePage', error)
         return
      }
   })
