import { ref, computed } from 'vue'
import { defineInitStore } from '#ustra/nuxt/store'
import { core } from '#ustra/core/utils'
import { useUstra } from '#ustra/nuxt/composables'
import { useJwtAuthStore } from './auth-jwt'
import { useServerAuthStore } from './auth-server'
import { useStorage, StorageSerializers } from '@vueuse/core'

export const useAuthStore = defineInitStore(
  'ustra:auth',
  () => {
    const $ustra = useUstra()
    const authType = $ustra.env.appProps.auth.type
    const jwtStore = ref<Awaited<ReturnType<typeof useJwtAuthStore>>>(null)
    const serverStore = ref<Awaited<ReturnType<typeof useServerAuthStore>>>(null)
    const storageType = $ustra.env.appProps.auth.jwt.tokenStorageType

    useJwtAuthStore($ustra?.nuxtApp).then(store => (jwtStore.value = store))
    useServerAuthStore($ustra?.nuxtApp).then(store => (serverStore.value = store))

    const states = {
      /**
       * 인증 정보 (세션 인증 등의 처리에서 사용)
       */
      authInfo: computed(() => {
        return authType === 'jwt' ? jwtStore.value.tokenClaim : serverStore.value.authInfo
      }),

      /**
       * 인증여부
       */
      authenticated: computed(() => {
        return authType === 'jwt' ? jwtStore.value.authenticated : serverStore.value.authenticated
      }),

      /**
       * 사용자 정보 존재 여부
       */
      existsUser: computed(() => {
        return authType === 'jwt' ? jwtStore.value.existsUser : serverStore.value.existsUser
      }),

      /**
       * 인증 역할 목록
       */
      roles: useStorage<Set<string>>(
        'ustra:roles',
        new Set<string>([]),
        storageType === 'local' ? core.global.localStorage : core.global.sessionStorage,
        {
          serializer: StorageSerializers.set,
        },
      ),
    }

    const autoLogoutStates = {
      /**
       * 자동 로그아웃 잔여 초
       */
      remainAutoLogoutSec: ref(-1),

      /**
       * 자동 로그아웃 타이머
       */
      autoLogoutTimer: ref<any>(null),
    }

    const actions = {
      /**
       * 인증 정보 제거
       */
      remove() {
        if (authType === 'jwt') {
          jwtStore.value.removeToken()
        } else {
          serverStore.value.authInfo = null
        }

        states.roles.value = new Set<string>([])
      },
    }

    return { ...states, ...actions }
  },
  async store => {},
)
