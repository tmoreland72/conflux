import {
   fireBase,
   providerFacebook,
   providerGitHub,
   providerGoogle,
   providerTwitter,
} from 'boot/firebase'

export function register(email, password) {
   return fireBase.auth().createUserWithEmailAndPassword(email, password)
}

export function isAuthenticated() {
   return !!fireBase.auth().currentUser
}

export async function login({ method, credentials }) {
   switch (method) {
      case 'EmailPassword':
         try {
            const { email, password } = credentials
            return await fireBase.auth().signInWithEmailAndPassword(email, password)
         } catch (err) {
            console.error('firebase - login - EmailPassword', err)
            return { error: true, message: err.message }
         }

      case 'Facebook':
         return fireBase.auth().signInWithRedirect(providerFacebook)

      case 'GitHub':
         return fireBase.auth().signInWithRedirect(providerGitHub)

      case 'Google':
         return fireBase.auth().signInWithRedirect(providerGoogle)

      case 'Twitter':
         return fireBase.auth().signInWithRedirect(providerTwitter)

      case 'Phone':
         try {
            const { number, recaptcha } = credentials
            return await fireBase.auth().signInWithPhoneNumber(number, recaptcha)
         } catch (err) {
            console.error('firebase - login - Phone', err)
            return { error: true, message: err.message }
         }

      default:
         return { message: 'System Error: Invalid authentication method.' }
   }
}

export function getLoginResult() {
   return fireBase.auth().getRedirectResult()
}

export function logout() {
   return fireBase.auth().signOut()
}
