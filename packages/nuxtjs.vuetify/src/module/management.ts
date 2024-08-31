import { Nuxt } from '@nuxt/schema'
import { addLayout as addNuxtLayout, addComponent } from '@nuxt/kit'
import { resolveFrameworkModulePath } from '#ustra/nuxt/kit'
import { NuxtAppProps } from '#ustra/nuxt/config'
import { core } from '#ustra/core/utils'
import { file, path } from '#ustra/core/utils/node'
import { fileURLToPath } from 'node:url'
import { resolve, join, dirname } from 'pathe'
import { existsSync } from 'node:fs'
import { copySync } from 'fs-extra'
import { logger } from '#ustra/nuxt/utils/logger'

function addApp(options: NuxtAppProps, nuxt: Nuxt) {
  const currentDir = dirname(fileURLToPath(import.meta.url))

  addComponent({
    name: 'UstraManagementApp',
    filePath: resolve(currentDir, '../management/apps/ustra-management-app.vue'),
    global: true,
  })

  addComponent({
    name: 'UstraManagementError',
    filePath: resolve(currentDir, '../management/apps/ustra-management-error.vue'),
    global: true,
  })
}

function addLoginPage(options: NuxtAppProps, nuxt: Nuxt) {
  if (!options.nuxt.management.ui.defaultPage.login.include || !options.auth.enabled) {
    return
  }

  nuxt.hook('pages:extend', pages => {
    const path = options.nuxt.management.ui.defaultPage.login.path || options.auth.loginPath
    const loginPage = pages.find(page => page.path === path)

    if (loginPage) {
      // loginPage.file = resolve(__dirname, '../management/pages/login.vue')
      logger.warn(`Login path component already registered. : ${path}`)
      return
    } else {
      pages.push({
        path: options.auth.loginPath,
        name: 'ustra-login',
        file: resolve(__dirname, '../management/pages/login.vue'),
      })

      logger.info(`$ustra add management login page : ${options.auth.loginPath}`)
    }
  })
}

function addMainPage(options: NuxtAppProps, nuxt: Nuxt) {
  if (!options.nuxt.management.ui.defaultPage.main.include || !options.nuxt.management.ui.defaultPage.main.path) {
    return
  }

  nuxt.hook('pages:extend', pages => {
    const path = options.nuxt.management.ui.defaultPage.main.path
    if (pages.some(page => page.path === path)) {
      logger.warn(`Main path component already registered. : ${path}`)
      return
    }
    pages.push({
      path,
      name: 'ustra-main',
      file: resolve(__dirname, '../management/pages/main.vue'),
    })

    logger.info(`$ustra add management main page : ${path}`)
  })
}

function addLayout(options: NuxtAppProps, nuxt: Nuxt) {
  const layoutProps = options.nuxt.management.ui.defaultPage.layout

  if (!layoutProps.include || !layoutProps.layoutName) {
    return
  }

  const layoutTargetPath = join(nuxt.options.srcDir, nuxt.options.dir.layouts, layoutProps.layoutName + '.vue')

  if (existsSync(layoutTargetPath)) {
    logger.warn(`layout "${layoutProps.layoutName}" is already exists..`)
    return
  }

  logger.info('=====>>>>> management/layouts/ustra')
  logger.info(resolve(__dirname, '../management/layouts/ustra.vue'))

  addNuxtLayout(
    {
      src: resolve(__dirname, '../management/layouts/ustra.vue'),
    },
    layoutProps.layoutName,
  )

  logger.info(`$ustra add default layout`)
}

async function addSystemPage(options: NuxtAppProps, nuxt: Nuxt) {
  const systemPageProps = options.nuxt.management.ui.defaultPage.system

  if (!systemPageProps.include || !systemPageProps.pathPrefix) {
    return
  }

  // copy resource
  let baseDir = resolve(__dirname, '../management/pages/system')

  if (systemPageProps.copyResource.enabled) {
    const targetDir = resolve(__dirname, '../management/pages/system')
    const destDir = path.getAbsolutePath(systemPageProps.copyResource.targetDirPath + '/system', nuxt.options.srcDir)

    if (systemPageProps.copyResource.overwrite) {
      await file.clearDir(destDir)
      logger.info(`$ustra clear directory : "${destDir}"`)
      await core.sleep(1000)
    }

    copySync(targetDir, destDir, {
      overwrite: systemPageProps.copyResource.overwrite,
    })

    // add common directory
    const commonTargetDir = resolve(__dirname, '../management/pages/common')
    const commonDestDir = path.getAbsolutePath(systemPageProps.copyResource.targetDirPath + '/common', nuxt.options.srcDir)
    copySync(commonTargetDir, commonDestDir, {
      overwrite: systemPageProps.copyResource.overwrite,
    })

    baseDir = destDir
    logger.info(`$ustra copy management system page to "${destDir}"`)
  }

  nuxt.hook('pages:extend', pages => {
    const dirs = file.getDirectoryFiles(baseDir, true)

    for (const dir of dirs) {
      const componentPath = resolve(join(baseDir, dir.name), './index.vue')
      const urlPath = systemPageProps.pathPrefix + '/' + dir.name

      if (!existsSync(componentPath)) {
        continue
      }

      if (pages.some(page => page.path === urlPath)) {
        logger.warn(`system page path component already registered. : ${urlPath}`)
        return
      }
      pages.push({
        path: urlPath,
        name: 'ustra-system-' + dir.name,
        file: componentPath,
      })

      logger.info(`$ustra add management system page : ${urlPath}, ${componentPath}`)
    }
  })
}

export const management = async (options: NuxtAppProps, nuxt: Nuxt) => {
  if (!options.nuxt.management.enabled) {
    return
  }

  if (options.nuxt.management.ui.componentType !== 'vuetify') {
    return
  }

  // add auto imports
  nuxt.hook('imports:dirs', dirs => {
    dirs.push(resolveFrameworkModulePath('#ustra/nuxt-vuetify/management/composables'))
  })

  addApp(options, nuxt)
  addLoginPage(options, nuxt)
  addMainPage(options, nuxt)
  addLayout(options, nuxt)
  await addSystemPage(options, nuxt)
}
