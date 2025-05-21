import gsap from 'gsap'
import siteName from './config'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Timothée DURAND | Web-developer',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          "I'm a french web developer based in Paris - Currently in school at Hetic and working at Ubisoft",
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/style/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    'nuxt-font-loader',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-clipboard',
    '@nuxtjs/svg',
    [
      'nuxt-social-meta',
      {
        url: 'timotheedurand.fr',
        title: 'Timothée DURAND | Web-developer',
        site_name: 'Timothée DURAND | Web-developer',
        description:
          "I'm a french web developer based in Paris - Currently in school at Hetic and working at Ubisoft",
        img: 'home-screen.png',
        img_size: { width: 1920, height: 1080 },
        locale: 'en_US',
        twitter_card: 'summary_large_image',
        theme_color: '#efcb68',
      },
    ],
    'vue-plausible'
  ],

  plausible: {
    domain: 'timotheedurand.fr',
    autoTrack: true,
    trackLocalhost: false,
    trackOnBeforeRouteLeave: true,
    apiHost:'https://poseidon.timotheedurand.fr',
  },

    // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      name: 'Timothée DURAND | Portfolio',
      theme_color: '#efcb68',
    },
    manifest: {
      name: 'Timothée DURAND | Portfolio',
      lang: 'en',
      useWebmanifestExtension: false,
    },
    icon: {
      fileName: 'logo.png',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['@svgdotjs/svg.js', 'gsap'],
    extend(config, { isClient }) {
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      })
    },
  },

  router: {
    middleware: 'route-guard',
  },

  fontLoader: {
    url: '/fonts/fonts.css',
  },
}
