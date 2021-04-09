const algoliasearch = require('algoliasearch')
const functions = require('firebase-functions')
const config = functions.config()

const client = algoliasearch(config.algolia.appid, config.algolia.adminkey)
const index = client.initIndex(config.algolia.index)

exports.push = (data) => {
   data.objectID = data.id
   data._tags = data.tags ? data.tags : []
   delete data.id
   delete data.tags
   try {
      index.saveObjects([data])
   } catch (err) {
      console.error('algolia/push', err)
      return false
   }
}

exports.delete = (id) => {
   index.deleteObjects([id])
}

exports.search = async (searchString) => {
   try {
      let results = await index.search(searchString)
      if (results.hits) return results.hits
      return []
   } catch (error) {
      console.error('algolia/search', err)
      return false
   }
}

/*
algolia.push({
   id: pageId,
   facetType: 'page',
   tags: page.tags,
   title: page.title,
   subtitle: page.subtitle,
   content: page.content,
})

algolia.delete(collectionId)

algolia.search('plain string search')
   .then({{ hits }) => { console.log(hits) })


Search for a scifi, book OR movie, containing "star"
[['book', 'movie'], 'scifi'] // (book OR movie) AND scifi
algolia.search('star', {
   tagFilters: [
      [
         'book',
         'movie',
      ],
      'scifi'
   ]
})
   .then({{ hits }) => { console.log(hits) })

algolia.searchForFacetValues('pages', 'search string')
   .then({{ hits }) => { console.log(hits) })


*/
