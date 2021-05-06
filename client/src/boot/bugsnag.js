import Vue from 'vue'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

if (process.env.ENV === 'prod') {
   Bugsnag.start({
      apiKey: 'd9ff8b98063b86e6e382cf105565ac52',
      plugins: [new BugsnagPluginVue()],
   })

   const bugsnagVue = Bugsnag.getPlugin('vue')
   bugsnagVue.installVueErrorHandler(Vue)
}
