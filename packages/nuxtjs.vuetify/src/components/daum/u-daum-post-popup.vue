<template>
  <slot :modelValue="modelValue" :onUpdate:modelValue="value => (modelValue = value)" :loadZipContainer="loadZipContainer">
    <UPopup v-model="modelValue" :width="800" :height="600" title="우편번호 조회" @shown="() => loadZipContainer()">
      <div ref="zipContianerEl" style="width: 100%; height: 100%"></div>
    </UPopup>
  </slot>
</template>
<script lang="ts" setup>
import { useHead } from '#app'
import { ref, withDefaults, defineEmits, defineProps } from '#ustra/nuxt'
import { useVModel } from '@vueuse/core'
import toNumber from 'lodash/toNumber'
import UPopup from '../dialog/u-popup.vue'
import { openDaumPostScreen, DaumPostResult, DaumPostScreenOptions } from '#ustra/nuxt/externals/daum/post'

export interface Props {
  /**
   * 팝업 오픈 여부
   */
  modelValue: boolean

  /**
   * Daum Post 창 옵션
   */
  options?: DaumPostScreenOptions

  /**
   * 위경도를 표시한다. apikey가 반드시 존재해야 한다.
   * @default false
   */
  addLatLng?: boolean

  /**
   * addLatLng가 true일 경우, API 통신 키 값
   */
  apiKey?: string
}

export interface Emits {
  (e: 'selected', data: DaumPostResult): void
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  options: () => {
    return {}
  },
  addLatLng: false,
  apiKey: () => {
    return $ustra.components.getComponentsOption('UDaumPostPopup').apiKey
  },
})
const emits = defineEmits<Emits>()

const zipContianerEl = ref<HTMLDivElement>()
const { modelValue, loadZipContainer, getLoadScripts } = useDaumPostPopup({
  zipContianerEl,
  emits,
  props,
})

useHead({
  script: getLoadScripts(),
})
</script>
<script lang="ts">
import { Ref } from '#ustra/nuxt'

/**
 * Daum Post Popup 컴포넌트
 * @param options
 *  - props : 컴포넌트 Props
 *  - emits : 컴포넌트 emits
 *  - zipContainerEl : 주소 창을 로드할 HTMLElement
 *  - convertResultHandler : 주소 검색 결과를 변경할 Method
 */
export const useDaumPostPopup = (options: {
  /**
   * 컴포넌트 프로퍼티
   */
  props: Props

  /**
   * 컴포넌트 emit 객체
   */
  emits: Emits

  /**
   * 주소창을 로드할 Element
   */
  zipContianerEl?: Ref<HTMLElement>

  /**
   * 결과 값을 변경할 Handler Function
   */
  convertResultHandler?: (result: DaumPostResult) => DaumPostResult
}) => {
  if (options.props.addLatLng && !options.props.apiKey) {
    throw new Error('apiKey가 설정되지 않았습니다.')
  }

  const modelValue = useVModel(options.props, 'modelValue')

  function convertResult(result: DaumPostResult) {
    if (options.convertResultHandler) {
      return options.convertResultHandler(result)
    }

    return result
  }

  /**
   * 우편번호 화면을 로드한다.
   * @param zipContianerEl 화면을 로드할 Element
   */
  function loadZipContainer(zipContianerEl?: HTMLElement) {
    if (zipContianerEl) {
      options.zipContianerEl = ref(zipContianerEl)
    }

    $ustra.utils.core
      .getObjectAsync(() => options.zipContianerEl.value)
      .then(zipContianerEl => {
        openDaumPostScreen(zipContianerEl, {
          ...options.props.options,
          onSelected(data) {
            // 좌표 조회
            if (options.props.addLatLng) {
              $ustra.global.kakao.maps.load(() => {
                const geocoder = new $ustra.global.kakao.maps.services.Geocoder()

                geocoder.addressSearch(data.address, (results, status) => {
                  if (status === $ustra.global.kakao.maps.services.Status.OK && results.length > 0) {
                    data.lat = toNumber(results[0].x)
                    data.lng = toNumber(results[0].y)
                    options.emits('selected', convertResult(data))
                    modelValue.value = false
                    return
                  }

                  options.emits('selected', convertResult(data))
                  modelValue.value = false
                  return
                })
              })

              return
            }

            options.emits('selected', convertResult(data))
            modelValue.value = false
          },
        })
      })
  }

  function getLoadScripts() {
    const scripts = [{ key: 'daumPostMapScript', src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' }]
    if (options.props.addLatLng) {
      scripts.push({ key: 'kakaoMapScript', src: `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${options.props.apiKey}&libraries=services` })
    }

    return scripts
  }

  return { modelValue, loadZipContainer, getLoadScripts }
}

export default {
  name: 'UDaumPostPopup',
}
</script>
