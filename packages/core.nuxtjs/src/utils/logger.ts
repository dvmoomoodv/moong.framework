import { logger, useLogger } from '#ustra/core'

let nuxtLogger = logger
if (process.server) {
  // @ts-ignore
  nuxtLogger = console
}

// @ts-ignore
const useNuxtLogger = (name?: string) => {
  if (process.server) {
    return nuxtLogger
  }

  return useLogger(name)
}

export { nuxtLogger as logger, useNuxtLogger as useLogger }
