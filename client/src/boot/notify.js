import { Notify } from 'quasar'

Notify.setDefaults({
   color: 'primary',
   icon: 'check_circle_outline',
   position: 'bottom',
   progress: true,
   timeout: 3000,
   textColor: 'white',
   actions: [{ icon: 'close', color: 'white' }],
})
