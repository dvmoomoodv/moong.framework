import logging, { logger } from './utils/logging'
import { ConsolaInstance } from 'consola'

const exportLogger = logger || logging.getLogger()
const useLogger = (name?: string) => logging.getLogger.bind(logging)(name) as ConsolaInstance

export { exportLogger as logger, useLogger }
