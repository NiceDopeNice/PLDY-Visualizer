
export default {
  mode: 'universal',
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    // Local URL
    CMSUrl_image: 'http://odsdev.intra.smart/CMS/image/visualizer/products/'
    // Live URL
    // CMSUrl_image: 'http://ods.intra.smart/CMS/image/visualizer/products/'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: (process.env.NODE_ENV == "development") ? 'http://stg-ws.intra.smart/NODSVisualizerAPI/' : 'http://stg-ws.intra.smart/ODSVisualizerAPI/',
    credentials: false
  },
  /* 
  ** Headers of the page
  */
  head: {
    title: 'What plan fits me?',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
    ]
  },
  // STAGING
  router: {
    base: "/ODSVisualizer/"
  },
  // PRODUCTION
  // router: {
  //   base: "/Visualizer/"
  // },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.css',
    '~/assets/css/rangeslider.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { mode: 'client', src: '~plugins/vue-router-back-button.js' },
    { mode: 'client', src: '~plugins/vue-router.js' },
    { src: '~plugins/vidle.js' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    vendor: ['~/assets/js/rangeslider.min.js'],
    extend (config, ctx) {
      config.node = { 
        fs: 'empty'
      }
    }
  }
}
