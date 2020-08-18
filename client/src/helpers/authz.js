const isAuthorized = props => {
   const { user, space, action } = props

   // Full access when no Space is selected
   if (!space) return true

   // Full access when User owns the Space
   if (space.ownerId === user.uid) return true

   let authz = space.authorizations

   let authorized = false
   switch (action) {
      case 'read':
         authorized = !!(authz.admin || authz.read || authz.create || authz.update || authz.delete)
         break
      case 'create':
         authorized = !!(authz.admin || authz.create)
         break
      case 'update':
         authorized = !!(authz.admin || authz.update)
         break
      case 'archive':
         authorized = !!(authz.admin || authz.update)
         break
      case 'delete':
         authorized = !!(authz.admin || authz.delete)
         break
      default:
         authorized = !!space.authorizations.admin
   }
   return authorized
}

export { isAuthorized }
