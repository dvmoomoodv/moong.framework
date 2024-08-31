import { NuxtApp } from '#app'
import { interfaceModels, apiModels } from '#ustra/core/data'

/**
 * 인터페이스 연계 기능
 */
export class UstraInterfaces {
  private get interfaceProp() {
    return this.nuxtApp.$ustra.env.appProps.interfaces
  }

  constructor(private nuxtApp: NuxtApp) {}

  /**
   * 아웃 바운드 인터페이스 조회
   * @param id 인터페이스 아이디
   * @param type 인터페이스 유형
   */
  getOutboundInterface = (id: string, type: string = null) => {
    const interfaceDefinitions = this.nuxtApp.$ustra.definedStore.interfaces.interfaceDefinitions

    if (!interfaceDefinitions) {
      return null
    }

    const interfaces = Array.from(interfaceDefinitions.entries())
    return interfaces.find(([key, i]) => i.id === id && i.direction === 'OUTBOUND' && (!type || i.type === type))?.[1]
  }

  /**
   * 인바운드 인터페이스 조회
   * @param id 인터페이스 아이디
   * @param type 인터페이스 유형
   */
  getInboundInterface = (id: string, type: string = null) => {
    const interfaceDefinitions = this.nuxtApp.$ustra.definedStore.interfaces.interfaceDefinitions

    if (!interfaceDefinitions) {
      return null
    }

    const interfaces = Array.from(interfaceDefinitions.entries())
    return interfaces.find(([key, i]) => i.id === id && i.direction === 'INBOUND' && (!type || i.type === type))
  }

  /**
   * 인터페이스 목록을 조회한다.
   */
  getInterfaces = () => {
    const interfaceDefinitions = this.nuxtApp.$ustra.definedStore.interfaces.interfaceDefinitions
    const interfaces = Array.from(interfaceDefinitions.entries()).map(([key, i]) => i)

    return interfaces || []
  }

  /**
   * 인터페이스 정보를 조회한다.
   * @param id 아이디
   * @param version 버전
   */
  getInterfaceInfo = (id: string, version: string = '1.0') => {
    const interfaceDefinitions = this.nuxtApp.$ustra.definedStore.interfaces.interfaceDefinitions

    if (!interfaceDefinitions) {
      return null
    }

    return interfaceDefinitions.get(id + ':' + version)
  }

  /**
   * 요청 인터페이스 로깅을 추가한다.
   * @param IfsInfo
   * @param ifsInfo
   */
  public async addRequestLogging(logginInfo: interfaceModels.InterfaceRequestLogging) {
    const apiUrl = this.interfaceProp?.apiLogging?.reqLoggingUrl

    if (!apiUrl) {
      return
    }

    try {
      if (logginInfo.requestContent) {
        logginInfo.requestContent =
          typeof logginInfo.requestContent === 'string' ? logginInfo.requestContent : JSON.stringify(logginInfo.requestContent)
      }

      const result = await this.nuxtApp.$ustra.api.call<apiModels.ApiResponse<number>>({
        url: apiUrl,
        data: logginInfo,
      })

      return result.data.body
    } catch (e) {
      return null
    }
  }

  /**
   * 응답 로깅 정보 추가
   */
  public addResponseLogging(loggingData: interfaceModels.InterfaceResponseLogging) {
    const apiUrl = this.interfaceProp?.apiLogging?.resLoggingUrl

    if (!apiUrl) {
      return
    }

    if (!loggingData.loggingId) {
      return
    }

    this.nuxtApp.$ustra.api.call<apiModels.ApiResponse<number>>({
      url: apiUrl,
      data: loggingData,
    })
  }
}
