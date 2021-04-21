const axios = require('axios')

const instance = axios.create({
   baseURL: 'https://api.rebrandly.com/v1/links',
   headers: {
      'Content-Type': 'application/json',
      apikey: process.env.REBRANDLY_APIKEY,
   },
})

exports.createLink = async ({ destination, title }) => {
   try {
      if (title.length < 3) {
         const shortBy = 3 - title.length
         for (let i = 0; i < shortBy; i++) {
            title += ' '
         }
      }
      const result = await instance.post('/', {
         destination,
         title,
         domain: { id: 'd260772f55024989ade30c42ab05fd7f' },
      })

      return {
         id: result.data.id,
         url: result.data.shortUrl,
      }
   } catch (error) {
      console.error('rebrandly', 'createLink', error)
      throw new Error(error)
   }
}

exports.deleteLink = async (id) => {
   try {
      await instance.delete(`/${id}`)
   } catch (error) {
      console.error('rebrandly', 'deleteLink', error)
   }
}
