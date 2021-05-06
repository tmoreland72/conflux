const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = function(/* ctx */) {
   return {
      supportTS: false,
      boot: ['i18n', 'axios', 'bugsnag', 'firebase', 'loading', 'notify', 'storage'],

      css: ['app.sass'],

      extras: [
         // 'ionicons-v4',
         // 'mdi-v5',
         // 'fontawesome-v5',
         // 'eva-icons',
         // 'themify',
         // 'line-awesome',
         // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
         'roboto-font', // optional, you are not bound to it
         'material-icons', // optional, you are not bound to it
      ],

      build: {
         vueRouterMode: 'history',

         chainWebpack(config) {
            config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
               {
                  languages: ['markdown'],
               },
            ])
         },
      },

      devServer: {
         https: false,
         port: 8080,
         open: true, // opens browser window automatically
      },

      framework: {
         iconSet: 'material-icons', // Quasar icon set
         lang: 'en-us', // Quasar language pack
         config: {},

         importStrategy: 'auto',

         plugins: ['Dialog', 'LocalStorage', 'SessionStorage', 'Notify', 'Loading'],
      },

      animations: [],

      ssr: {
         pwa: false,
      },

      pwa: {
         workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
         workboxOptions: {}, // only for GenerateSW
         manifest: {
            name: `Conflux 2021`,
            short_name: `Conflux 2021`,
            description: `Document Everything from Anywhere`,
            display: 'standalone',
            orientation: 'portrait',
            background_color: '#ffffff',
            theme_color: '#027be3',
            icons: [
               {
                  src: 'icons/icon-128x128.png',
                  sizes: '128x128',
                  type: 'image/png',
               },
               {
                  src: 'icons/icon-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
               },
               {
                  src: 'icons/icon-256x256.png',
                  sizes: '256x256',
                  type: 'image/png',
               },
               {
                  src: 'icons/icon-384x384.png',
                  sizes: '384x384',
                  type: 'image/png',
               },
               {
                  src: 'icons/icon-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
               },
            ],
         },
      },

      cordova: {
         // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      },

      capacitor: {
         hideSplashscreen: true,
      },

      electron: {
         bundler: 'packager', // 'packager' or 'builder'

         packager: {},

         builder: {
            appId: 'client',
         },

         nodeIntegration: true,

         extendWebpack(/* cfg */) {},
      },
   }
}
