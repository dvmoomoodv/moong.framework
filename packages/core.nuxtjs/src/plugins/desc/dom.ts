import type { Ustra } from "../ustra";
import { MediaQuery } from "#moong/core/utils/browser";

/**
 * dom 관련 유틸리티
 */
export class UstraDom {
  private _mediaQuery: MediaQuery = null;

  constructor(private $ustra: Ustra) {
    const mediaQueryConfig = this.$ustra.env.appProps.nuxt.utilities.mediaQuery;

    if (mediaQueryConfig.enabled) {
      this._mediaQuery = new MediaQuery(mediaQueryConfig.breakPoitns);
      this._mediaQuery.on((state) => {
        this.$ustra.definedStore.core.mediaState = state;
      });

      this.$ustra.definedStore.core.mediaState = this._mediaQuery.getState();
    }
  }

  /**
   * window 객체 조회
   */
  get window() {
    return window;
  }

  /**
   * document 객체 조회
   */
  get document() {
    return this.window.document;
  }

  /**
   * body 객체 조회
   */
  get body() {
    return this.document.body;
  }

  /**
   * media query
   */
  get mediaQuery() {
    const _this = this;

    return {
      get instance() {
        return _this._mediaQuery;
      },

      get state() {
        return _this.$ustra.definedStore.core.mediaState;
      },
    };
  }
}
