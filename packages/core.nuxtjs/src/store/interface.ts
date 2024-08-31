import { defineInitStore } from '.'
import { ref } from 'vue'
import { interfaceModels, apiModels } from '#ustra/core/data'
import { useSessionStorage, StorageSerializers } from '@vueuse/core'

export const useUstraInterfaceStore = defineInitStore(
  'ustra:interface',
  () => {
    /**
     * 인터페이스 정의 목록
     */
    const interfaceDefinitions = useSessionStorage<Map<string, Partial<interfaceModels.InterfaceInfo>>>('ustra:interface', new Map(), {
      serializer: StorageSerializers.object,
    })
    const loadedInterfaceDefinitions = ref(false)

    return { interfaceDefinitions, loadedInterfaceDefinitions }
  },
  async (store, { $ustra, appProps }) => {
    const interfacesMap: Map<string, Partial<interfaceModels.InterfaceInfo>> = new Map()

    // add env definition
    if (appProps.interfaces.definitions) {
      appProps.interfaces.definitions.forEach(i => {
        const interfaceInfo = $ustra.utils.core.deepMergeWithNull({}, interfaceModels.DEFAULT_INTERFACE_INFO, i)
        interfacesMap.set(i.id + ':' + (i.version || '1.0'), interfaceInfo)
      })
    }

    if (!store.loadedInterfaceDefinitions) {
      const initialDataUrl = appProps.interfaces?.initialDataApiUrl

      if (initialDataUrl) {
        // 초기 데이터 조회
        const interfacesResult = await $ustra.api.call<apiModels.ApiResponse<interfaceModels.InterfaceInfo[]>>({
          url: initialDataUrl,
          method: 'POST',
          excludeAuthValidation: true,
        })

        interfacesResult.data.body.forEach(i => interfacesMap.set(i.id + ':' + (i.version || '1.0'), i))
      }
    }

    store.interfaceDefinitions = interfacesMap
  },
)
