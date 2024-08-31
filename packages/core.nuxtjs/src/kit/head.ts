import { system } from '#ustra/core/utils'
import { useNuxt, createResolver } from '@nuxt/kit'
import { join } from 'pathe'
import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { copyFileSync, mkdirSync } from 'fs-extra'

/**
 * 스크립트를 add 한다.
 * @param srcScriptPath 원본 파일 경로
 * @param destScriptFilePath 대상 파일 경로
 * @param addVerString version query string 포함여부
 * @param includeHeadOption nuxt head option 포함여부
 * @returns
 */
export const addScript = async (srcScriptPath: string, destScriptFilePath: string, addVerString: boolean = true, includeHeadOption = true) => {
  const nuxt = useNuxt()

  const { resolve, resolvePath } = createResolver(nuxt.options.rootDir)
  const destScriptFileAbsolutePath = join(nuxt.options.rootDir, nuxt.options.dir.public, destScriptFilePath)
  const destScriptFileDirPath = dirname(destScriptFileAbsolutePath)
  const srcScriptAsolutePath = await resolvePath(srcScriptPath, {
    alias: nuxt.options.alias,
  })

  if (!existsSync(srcScriptAsolutePath)) {
    console.warn(`$ustra : Cannot found script source path : ${srcScriptAsolutePath}`)
    return
  }

  if (!existsSync(destScriptFileDirPath)) {
    mkdirSync(destScriptFileDirPath, { recursive: true })
  }

  // copy file
  copyFileSync(srcScriptAsolutePath, destScriptFileAbsolutePath)

  console.info(`$ustra : copy script file : ${srcScriptAsolutePath} -> ${destScriptFileAbsolutePath}`)

  // add header
  if (includeHeadOption) {
    nuxt.options.app.head = nuxt.options.app.head || {}
    nuxt.options.app.head.script = nuxt.options.app.head.script || []

    let importPath = '/' + destScriptFilePath

    if (addVerString) {
      importPath += `?v=${system.uuidBase62()}`
    }

    nuxt.options.app.head.script.push({
      key: destScriptFilePath.replace(/\//g, '-'),
      src: '/' + destScriptFilePath,
    })

    console.info(`$ustra : add script header : ${'/' + destScriptFilePath}`)
  }
}
