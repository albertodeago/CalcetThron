// Configuration for your app

module.exports = function(ctx) {
    return {
        // app boot file (/src/boot)
        // --> boot files are part of "main.js"
        boot: [
            'axios',
            'firebase'
        ],

        css: [
            'app.styl'
        ],

        extras: [
            'roboto-font',
            'material-icons' // optional, you are not bound to it
            // 'ionicons-v4',
            // 'mdi-v3',
            // 'fontawesome-v5',
            // 'eva-icons'
        ],

        framework: {
            // all: true, // --- includes everything; for dev only!

            components: [
                'QLayout',
                'QHeader',
                'QDrawer',
                'QPageContainer',
                'QPage',
                'QToolbar',
                'QToolbarTitle',
                'QBtn',
                'QIcon',
                'QList',
                'QItem',
                'QItemSection',
                'QItemLabel',
                'QImg',
                'QAvatar',
                'QSeparator',
                'QTabs',
                'QTab',
                'QRouteTab',
                'QTabPanels',
                'QTabPanel',
                'QCard',
                'QCardSection',
                'QCardActions',
                'QInput',
                'QSpinner',
                'QBanner',
                'QPageSticky',
                'QDialog',
                'QBar',
                'QSpace',
                'QStepperNavigation',
                'QStepper',
                'QStep',
                'QSelect',
                'QBadge',
                'QChip',
                'QExpansionItem',
                'QPopupProxy'
            ],

            directives: [
                'Ripple'
            ],

            // Quasar plugins
            plugins: [
                'Notify'
            ]

            // iconSet: 'ionicons-v4'
            // lang: 'de' // Quasar language
        },

        supportIE: false,

        build: {
            scopeHoisting: true,
            // vueRouterMode: 'history',
            // vueCompiler: true,
            // gzip: true,
            // analyze: true,
            // extractCSS: false,
            extendWebpack(cfg) {}
        },

        devServer: {
            // https: true,
            // port: 8080,
            open: true // opens browser window automatically
        },

        // animations: 'all' --- includes all animations
        animations: [
            'slideInRight',
            'fadeIn',
            'fadeOut'
        ],

        ssr: {
            pwa: false
        },

        pwa: {
            // workboxPluginMode: 'InjectManifest',
            // workboxOptions: {},
            manifest: {
                name: 'CalcetThron',
                short_name: 'CalcetThron',
                description: 'A PWA to store THRON Calcetto\'s games',
                display: 'standalone',
                start_url: "/games",
                orientation: 'portrait',
                background_color: '#ffffff',
                theme_color: '#1937e0',
                icons: [{
                        'src': 'statics/icons/icon-128x128.png',
                        'sizes': '128x128',
                        'type': 'image/png'
                    },
                    {
                        'src': 'statics/icons/icon-192x192.png',
                        'sizes': '192x192',
                        'type': 'image/png'
                    },
                    {
                        'src': 'statics/icons/icon-256x256.png',
                        'sizes': '256x256',
                        'type': 'image/png'
                    },
                    {
                        'src': 'statics/icons/icon-512x512.png',
                        'sizes': '512x512',
                        'type': 'image/png'
                    }
                ]
            }
        },

        cordova: {
            // id: 'org.cordova.quasar.app'
        },

        electron: {
            // bundler: 'builder', // or 'packager'

            extendWebpack(cfg) {
                // do something with Electron main process Webpack cfg
                // chainWebpack also available besides this extendWebpack
            },

            packager: {
                // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

                // OS X / Mac App Store
                // appBundleId: '',
                // appCategoryType: '',
                // osxSign: '',
                // protocol: 'myapp://path',

                // Window only
                // win32metadata: { ... }
            },

            builder: {
                // https://www.electron.build/configuration/configuration

                // appId: 'quasar-app'
            }
        }
    }
}