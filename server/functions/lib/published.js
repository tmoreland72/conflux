const { firestore } = require('../services/firebase')
const books = require('../lib/books')
const chapters = require('../lib/chapters')
const pages = require('../lib/pages')
const links = require('../lib/rebrandly')

exports.getPublishedBook = async (id) => {
   try {
      const doc = await firestore.collection('published').doc(id).get()
      if (doc.exists) {
         return doc.data()
      } else {
         return false
      }
   } catch (error) {
      return false
   }
}

exports.unpublishBook = async (id) => {
   try {
      const exists = await this.getPublishedBook(id)
      if (exists) {
         links.deleteLink(exists.link.id)
      }
      await firestore.collection('published').doc(id).delete()
   } catch (error) {
      throw new Error(error)
   }
}

exports.publishBook = async (id) => {
   try {
      const exists = await this.getPublishedBook(id)
      let book = await books.get(id)
      if (exists && exists.link) {
         book.link = exists.link
      } else {
         let destination = `${process.env.APP_BASEURL}/published/${id}`
         let link = await links.createLink({
            destination,
            title: book.title,
         })
         link.url = `https://${link.url}`
         book.link = link
      }
      const bookChapters = await chapters.getByBook(book.id)
      let bookPages = []
      await Promise.all(
         bookChapters.map(async (chapter) => {
            const chapterPages = await pages.getByChapter(chapter.id)
            bookPages = [...bookPages, ...chapterPages]
         })
      )

      await firestore
         .collection('published')
         .doc(id)
         .set({
            ...book,
            chapters: bookChapters,
            pages: bookPages,
         })
   } catch (error) {
      throw new Error(error)
   }
}
