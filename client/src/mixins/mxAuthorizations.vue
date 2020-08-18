<script>
import { mapGetters, mapState } from 'vuex'

import { isAuthorized } from 'src/helpers/authz'

export default {
   computed: {
      ...mapState('auth', ['loggedIn']),
      ...mapGetters(['spaces/space']),
   },

   methods: {
      mxAuthorized(action) {
         let spaceId = this.$route.params.spaceId
         return isAuthorized({
            user: this.loggedIn,
            space: this['spaces/space'](spaceId),
            action,
         })
      },
   }
}
</script>

<style scoped>

</style>
