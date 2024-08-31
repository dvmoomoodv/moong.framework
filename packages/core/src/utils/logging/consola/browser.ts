// import Consola from './consola.js'
// import BrowserReporter from './reporters/browser.js'
// import { LogLevel } from './logLevels'

// function createConsola() {
//   const consola = new Consola({
//     reporters: [new BrowserReporter()],
//   })

//   // Expose constructors
//   // @ts-ignore
//   consola.Consola = Consola
//   // @ts-ignore
//   consola.LogLevel = LogLevel
//   // @ts-ignore
//   consola.BrowserReporter = BrowserReporter

//   return consola
// }

// // @ts-ignore
// export default (typeof window !== 'undefined' && window.consola) || createConsola()
