import plugins from './plugins'

export function register(service, email, password) {
   return plugins[service].register(email, password)
}

export function isAuthenticated(service) {
   return plugins[service].isAuthenticated()
}

export async function login(service, { method, credentials }) {
   try {
      return await plugins[service].login({ method, credentials })
   } catch (err) {
      console.error('authn - login', err)
      return err
   }
}

export function getLoginResult(service) {
   return plugins[service].getLoginResult()
}

export function logout(service) {
   return plugins[service].logout()
}
