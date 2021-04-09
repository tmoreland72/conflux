const algolia = require('../services/algolia')

const search = async (request) => {
   try {
      const { userId, searchString } = request

      let searchResults = await algolia.search(searchString)
      searchResults = searchResults.filter((f) => f.collaborators.includes(userId))
      searchResults = searchResults.map((r) => {
         const response = {
            id: r.objectID,
            bookTitle: r.book.title,
            chapterTitle: r.chapter.title,
            pageTitle: r.title,
            pageSubtitle: r.subtitle,
            route: { name: 'book-page', params: { id: r.book.id, pageId: r.objectID } },
         }
         return response
      })
      return searchResults
   } catch (error) {
      throw new Error(error.message)
   }
}

exports.search = search
