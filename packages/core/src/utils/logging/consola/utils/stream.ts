// import { writeSync } from 'node:fs'

// export function writeStream(data, stream, mode = 'default') {
//   const write = stream.__write || stream.write

//   switch (mode) {
//     case 'async':
//       return new Promise(resolve => {
//         if (write.call(stream, data) === true) {
//           // @ts-ignore
//           resolve()
//         } else {
//           stream.once('drain', () => {
//             // @ts-ignore
//             resolve()
//           })
//         }
//       })
//     case 'sync':
//       return writeSync(stream.fd, data)
//     default:
//       return write.call(stream, data)
//   }
// }
