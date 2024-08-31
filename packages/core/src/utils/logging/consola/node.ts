// import * as env from 'std-env'
// import Consola from './consola'
// import BasicReporter from './reporters/basic'
// import FancyReporter from './reporters/fancy'
// import JSONReporter from './reporters/json'
// import WinstonReporter from './reporters/winston'
// import { LogLevel } from './logLevels'

// export interface NodeConsola extends Consola {
//   Consola?: typeof Consola
//   BasicReporter?: typeof BasicReporter
//   FancyReporter?: typeof FancyReporter
//   JSONReporter?: typeof JSONReporter
//   WinstonReporter?: typeof WinstonReporter
//   LogLevel?: typeof LogLevel
// }

// function createConsola(): NodeConsola {
//   // Log level

//   let level = env.isDebug ? 4 : 3
//   if (process.env.CONSOLA_LEVEL) {
//     level = parseInt(process.env.CONSOLA_LEVEL) || level
//   }

//   // Create new consola instance
//   const consola: NodeConsola = new Consola({
//     level,
//     reporters: [env.isCI || env.isTest ? new BasicReporter() : new FancyReporter()],
//   })

//   // Expose constructors
//   consola.Consola = Consola
//   consola.BasicReporter = BasicReporter
//   consola.FancyReporter = FancyReporter
//   consola.JSONReporter = JSONReporter
//   consola.WinstonReporter = WinstonReporter
//   consola.LogLevel = LogLevel

//   return consola as NodeConsola
// }

// if (!global.consola) {
//   global.consola = createConsola()
// }

// export default global.consola as NodeConsola
