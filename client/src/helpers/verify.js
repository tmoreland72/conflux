import axios from 'axios'

const emailAddress = async address => {
   let url = 'https://apilayer.net/api/check?access_key=' + process.env.MAILBOXLAYER_APIKEY
   url = url + '&email=' + address
   url = url + '&smtp=1&format=1'
   let config = {
      method: 'GET',
      url,
      headers: {
         Accept: 'application/json',
      },
   }

   try {
      let result = await axios(config)
      return result.data
   } catch (err) {
      console.error('verify-emailAddress', err)
   }
}

export { emailAddress }
