const plugins = () => {
   let modules = {}
   const plugins = require.context('src/plugins/authn', true, /index\.js/)
   let keys = plugins.keys()

   Promise.all(keys.map(async key => {
      let parts = key.split('/')
      const name = parts[1]
      modules[name] = await import(`src/plugins/authn/${name}/index.js`)
   }))
   return modules
}

export default plugins()
