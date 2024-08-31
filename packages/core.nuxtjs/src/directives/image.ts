import { ObjectDirective } from 'vue'

export interface NoImageOptions {
  /**
   * 이미지가 없을 경우, Path
   */
  notFoundImagePath: string
}

function nomalizeOptions(options: string | undefined | NoImageOptions): NoImageOptions {
  const defaultNotFoundImage = $ustra.env.appProps.nuxt.directives?.image?.defaultNotFoundImagePath

  if (typeof options === 'string') {
    return {
      notFoundImagePath: options,
    }
  }

  if (typeof options === 'object') {
    return $ustra.utils.core.deepMerge(options, {
      notFoundImagePath: defaultNotFoundImage,
    })
  }

  return {
    notFoundImagePath: defaultNotFoundImage,
  }
}

/**
 * input box or button focus
 */
export const image: ObjectDirective = {
  beforeMount(el, binding) {
    const imgEl = el as HTMLImageElement
    const options = nomalizeOptions(binding.value)

    // image notfound
    imgEl.addEventListener('error', () => {
      const src = imgEl.getAttribute('src')
      if (src === options.notFoundImagePath) {
        return
      }
      imgEl.setAttribute('src', options.notFoundImagePath)
    })
  },
  updated(el, binding) {},
}
