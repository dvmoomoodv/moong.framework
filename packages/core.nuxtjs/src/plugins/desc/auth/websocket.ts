import { useLogger } from '#ustra/nuxt/utils/logger'
import { UstraAuthDuplicationChecker, UstraAuthDuplicationCheckerOptions } from './base'
// import SockJS from 'sockjs-client'
// import { io, Socket } from 'socket.io-client'
import { Ustra } from '../../ustra'

const logger = useLogger('ustra:auth')

export class UstraAuthWebsocketDuplicationChecker extends UstraAuthDuplicationChecker {
  // private ws: Socket = null

  constructor($ustra: Ustra, option: UstraAuthDuplicationCheckerOptions) {
    super($ustra, option)
  }

  start() {
    if (!this.$ustra.auth.isAuthenticated) {
      return
    }

    logger.warn('websocket duplication checker is not supported.')
    return

    // if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {

    // if (this.ws) {
    //   // token update
    //   if (this.ws.connected) {
    //     try {
    //       const authInfo = this.option.authInfoProvider()

    //       if (authInfo) {
    //         this.ws.send(
    //           this.$ustra.utils.crypto.encrypt(
    //             JSON.stringify({
    //               commandType: 'REFRESH_TOKEN_UPDATED',
    //               UserKey: authInfo.userKey,
    //               RefreshToken: authInfo.token,
    //               ProcId: authInfo.procId,
    //             }),
    //           ),
    //         )
    //       }
    //     } catch (e) {
    //       logger.error(e)
    //     }
    //   }
    //   return
    // }

    // try {
    //   const authInfo = this.option.authInfoProvider()

    //   const param = this.$ustra.api.createUrlEncodedParameter({
    //     k: this.$ustra.utils.crypto.encrypt(JSON.stringify({ UserKey: authInfo.userKey, RefreshToken: authInfo.token, ProcId: authInfo.procId })),
    //   })
    //   // const sendUrl = this.authProps.duplication.checkPath + '?' + param
    //   // const sendUrl =

    //   try {
    //     this.ws && this.ws.close()
    //   } catch (e) {}

    //   // console.log('sendUrl', sendUrl)

    //   // this.ws = new SockJS(sendUrl, null, { timeout: 10000, sessionId: () => authInfo.procId })
    //   this.ws = io(this.authProps.duplication.checkPath, {
    //     // path: this.authProps.duplication.checkPath,
    //     query: {
    //       k: this.$ustra.utils.crypto.encrypt(JSON.stringify({ UserKey: authInfo.userKey, RefreshToken: authInfo.token, ProcId: authInfo.procId })),
    //     },
    //     reconnection: true,
    //   })

    //   // this.ws.onopen = () => {
    //   //   logger.info('connect websocket server')
    //   // }
    //   this.ws.on('connect', socket => {
    //     logger.info('connect websocket server')
    //   })

    //   // this.ws.onclose = () => {
    //   //   logger.info('disconnect websocket server')
    //   //   // reconnect
    //   //   // setTimeout(() => this.start(), 1000)
    //   // }
    //   this.ws.on('disconnect', () => {
    //     logger.info('disconnect websocket server')
    //   })

    //   // this.ws.onmessage = async e => {
    //   //   try {
    //   //     logger.info('message', e)
    //   //     const data = JSON.parse(this.$ustra.utils.crypto.decrypt(e.data))

    //   //     // 중복 인증 통지
    //   //     if (data.commandType === 'DUPLICATED_AUTHENTICATION') {
    //   //       this.option.onDuplicated()
    //   //       // await this.doFailureAuth(this.$ustra.context.route, false, 'duplicated', url)
    //   //     }

    //   //     // 인증 만료
    //   //     else if (data.commandType === 'EXPIRED_AUTHENTICATION') {
    //   //       this.option.onExpired()
    //   //       // await this.doFailureAuth(this.$ustra.context.route, false, 'expired', url)
    //   //     }
    //   //   } catch (e) {
    //   //     logger.error(e)
    //   //   }
    //   // }

    //   this.ws.on('data', e => {
    //     console.log('data', e)
    //   })

    //   this.ws.onAny((eventName, ...args) => {
    //     console.log('eventName', eventName)
    //   })

    //   this.ws.connect()
    //   console.log('this.ws', this.ws)

    //   // this.ws.onclose = () => {
    //   //   // reconnect
    //   //   setTimeout(() => this.start(), 1000)
    //   // }
    //} catch (e) {}
  }

  stop() {
    // if (this.ws) {
    //   this.ws.close()
    // }
  }
}
