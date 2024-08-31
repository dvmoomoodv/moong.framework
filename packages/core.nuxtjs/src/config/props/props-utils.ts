import { NuxtAppProps, Profile } from '../nuxt-app-props'
import { defaultProps as _defaultProps } from '#ustra/core/config/props/props-utils'
import { core } from '#ustra/core/utils'
import { crypto } from '#ustra/core/utils/browser'

/**
 * 기본 properties 조회
 * @param appProps
 */
export const defaultProps = (appProps?: NuxtAppProps): NuxtAppProps => {
  return core.deepMerge(
    {},
    _defaultProps(appProps),
    {
      nuxt: {
        _build: {
          pluginProps: [],
        },
        error: {
          handlerType: 'logging',
          statusCode: 500,
        },
        router: {
          extendPagesDirs: [],
        },
        vueuse: {
          enabled: true,
          autoImports: true,
        },
        wijmo: {
          enabled: false,
          styles: {
            useCss: true,
            theme: 'light',
            addFrameworkCustomStyle: true,
          },
          culture: 'ko',
          samples: {
            enabled: true,
            path: '/samples/wijmo',
            copyResource: {
              enabled: true,
              overwrite: true,
              targetDirPath: './components/ustra',
            },
          },
          components: {
            inputDate: {
              useCalendarIcon: true,
            },
          },
          functions: {
            gridPdf: false,
          },
        },
        vuetify: {
          enabled: false,
          // mdi: {
          //   enabled: true,
          // },
          // icons: {
          //   mdi: true,
          //   fa: true,
          //   useCdn: true,
          // },
          // autoImport: true,
          // treeshaking: false,
          // styles: true,
          vuetifyOptions: {
            defaults: {},
            theme: {
              defaultTheme: 'light',
            },
          },
          samples: {
            enabled: true,
            path: '/samples/vuetify',
            copyResource: {
              enabled: true,
              overwrite: true,
              targetDirPath: './components/ustra',
            },
          },
          datepicker: {
            enabled: true,
          },
        },
        ckeditor5: {
          enabled: false,
          editor: {
            ClassicEditor: {
              buildPath: '@ustra/nuxt-ckeditor5/src/builtin/classic-basic3/ckeditor',
              mapPath: '@ustra/nuxt-ckeditor5/src/builtin/classic-basic3/ckeditor.js.map',
              language: 'ko',
            },
          },
        },
        markdown: {
          enabled: false,
          theme: 'github',
        },
        ui: {
          useDefaultFont: true,
          replaceDialogFunctions: true,
          callPageLoadingProgressHook: true,
          useDefaultFavicon: true,
        },
        api: {
          occurErrorwhenReceivedApiErrCode: true,
          excludeAuthValidation: false,
          passOnResponseCode: ['0000'],
          showLoadingBar: true,
          method: 'GET',
          disableCheckErrorWhenAuthInactivated: true,
          excludeAuthValidationOnServer: true,
          maximumConcurrentNumber: 3,
          taskDelay: 10,
          retries: 0,
        },
        env: {
          secureClientProps: ['app.processPath', 'app.configDir', 'app.types', 'logger.file.dirname', 'server.middleware', 'nuxt._build'],
          secret: crypto.generateSecret(),
        },
        build: {
          generation: {
            profileApiUrl: '/api/current-profile',
            generateProfiles: [Profile.PRODUCTION, Profile.QA, Profile.STAGING],
          },
        },
        management: {
          enabled: false,
          systemApiUrlPrefix: '/api/system',
          ui: {
            displayHomeMenu: true,
            mainPagePath: '/main',
            componentType: 'wijmo',
            appTitle: 'U.STRA Node Framework3 Management System',
            favoriteMenu: {
              enabled: true,
              highlightDefault: true,
              visibleAlways: true,
            },
            tabMenu: {
              enabled: true,
              maximumTabNumbers: 10,
              preventDirectConnectMenuUrl: {
                enabled: true,
                excludeUrlPatterns: [],
              },
            },
            defaultPage: {
              layout: {
                include: true,
                layoutName: 'ustra',
              },
              login: {
                include: true,
                path: '/login',
              },
              main: {
                include: true,
                path: '/main',
              },
              system: {
                include: true,
                pathPrefix: '/system',
                copyResource: {
                  enabled: false,
                  overwrite: true,
                  targetDirPath: './components/ustra',
                },
              },
            },
          },
          initialData: {
            enabled: true,
            initialDataApiUrl: '/api/system/initializing-data.json',
            useCache: true,
          },
          security: {
            password: {
              creationPolicyHtmlText:
                '비밀번호 길이는 <b>10~16 자</b>로 설정하여야 하며, 아이디와 비밀번호는 동일할 수 없습니다.<br />동일한 문자는 3자 이상 사용이 불가하며, 연속된 문자 (예:abc, 123 등) 또한 3자리 이상 사용이 불가능합니다.',
            },
          },
        },
        components: {
          UPaginationBar: {
            showStartEndButtons: false,
          },
          UDatepicker: {
            showMonthLabel: true,
            weekStart: 1,
          },
        },
        directives: {
          image: {},
        },
        utilities: {
          mediaQuery: {
            enabled: true,
            breakPoitns: {
              XS: '(max-width: 599.99px)',
              S: '(min-width: 600px) and (max-width: 959.99px)',
              M: '(min-width: 960px) and (max-width: 1279.99px)',
              L: '(min-width: 1280px)',
            },
          },
        },
        mobile: {
          enabled: false,
          hybrid: {
            nativeAgent: {
              android: null,
              ios: null,
            },
            bridge: {
              enabled: false,
              useTokenSecurity: false,
              staticBridgeNames: {},
            },
          },
        },
        interfaces: {
          apiLogging: {},
          definitions: [],
        },
        cache: {
          ssr: {
            enabled: false,
            pages: [],
          },
        },
        experimental: {
          compressBundle: true,
          splitChunkModules: false,
        },
      },
    } as NuxtAppProps,
    appProps,
  )
}
