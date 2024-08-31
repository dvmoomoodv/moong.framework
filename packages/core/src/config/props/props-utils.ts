import web from '../../utils/web'
import moduleUtils from '../../utils/node/module'
import { defaultI18nProps } from './i18n'

import {
  defaultCompressionOption,
  defaultJsonBodyParserOption,
  defaultServerLoggingOption,
  defaultUrlEncodedBodyParserOption,
  defaultMultipartOption,
} from '../../server/http/middlewares/config-utils'
import { AppProps, App, Server, DeviceType, LogLevel, Logging, Auth } from './index'
import { env } from '../env'

const defaultAppProps = (appProps: AppProps): App => {
  if (web.isBrowser) {
    return appProps
  }

  const appProp: App = {
    profile: env.currentProfile(appProps?.app?.profile),
    deviceType: DeviceType.DESKTOP,
  }

  if (!web.isBrowser) {
    const processPath = appProps?.app?.processPath || process?.cwd ? process.cwd() : null

    const packageInfo = moduleUtils.parsePackageJson(processPath, false)
    if (packageInfo) {
      appProp.version = appProps?.server || packageInfo.version
      appProp.title = appProps?.title || packageInfo.description
    }
  }

  return appProp
}

const defaultLoggingProps = (appProps: AppProps): Logging => {
  return {
    level: LogLevel.Debug,
    name: 'ustra',
    file: {
      enabled: false,
      dirPath: 'logs',
      filename: 'application.%DATE%.log',
      errFilename: 'error.%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: 30,
    },
    browser: {
      disabled: false,
    },
  }
}

const defaultServerProps = (appProps: AppProps): Server => {
  return {
    enabled: true,
    dev: process.env.NODE_ENV === 'development',
    // port: toNumber(process.env.PORT || 3000),
    host: 'localhost',
    middleware: {
      compression: defaultCompressionOption(appProps),
      jsonBodyParser: defaultJsonBodyParserOption(appProps),
      urlEncodedBodyParser: defaultUrlEncodedBodyParserOption(appProps),
      logging: defaultServerLoggingOption(appProps),
      multipart: defaultMultipartOption(appProps),
    },
  }
}

const defaultAuthProps = (appProps: AppProps): Auth => {
  return {
    enabled: false,
    type: 'jwt',
    loginPath: '/login',
    redirectReturnPageParamName: 'rtnUrl',
    failProcessType: 'redirect',
    expiredProcessType: 'logout',
    errorUrl: 'errorUrl',
    errorStatusCode: 401,
    autoLogoutSeconds: 0,
    excludeUrlPatterns: [],
    customModules: {},
    duplication: {
      type: 'none',
      pollingMilliSec: 10000,
      checkPath: '/api/auth-ws',
    },
    jwt: {
      cookiePath: '/',
      useCookie: false,
      cookieOptions: {
        domain: null,
        path: '/',
        syncServer: false,
        excludeSyncServerUrlPatterns: [],
        samesite: 'None',
        secure: true,
      },
      tokenStorageType: 'session',
    },
  }
}

export const defaultProps = (sourceProps?: AppProps): AppProps => {
  sourceProps = sourceProps || {}

  const mergedProps = {
    app: defaultAppProps(sourceProps),
    auth: defaultAuthProps(sourceProps),
    logging: defaultLoggingProps(sourceProps),
    server: defaultServerProps(sourceProps),
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
    i18n: defaultI18nProps(),
  }

  // deprecated props 보정
  if (sourceProps?.auth?.jwt?.cookiePath) {
    mergedProps.auth.jwt.cookieOptions.path = sourceProps?.auth?.jwt?.cookiePath
  }

  return mergedProps
}
