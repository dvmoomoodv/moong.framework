import { Profile } from "#moong/core/config/props";

export interface BuildOptions {
  /**
   * generation 설정
   */
  generation?: Generation;
}

export interface PrivateBuildOptions {
  /**
   * 프레임워크 경로
   */
  frameworkDirPath?: string;
  /**
   * U.STRA 플러그인 확장 모듈
   */
  pluginProps?: {
    propName?: string;
    modulePath?: string;
    moduleAlias?: string;
  }[];
}

/**
 * Generation 설정
 */
export interface Generation {
  /**
   * 추가 generation path
   */
  additionalPath?: string;

  /**
   * Profile 조회 API URL
   * @deprecated
   * @default /api/current-profile
   */
  profileApiUrl?: string;

  /**
   * generate profile (SPA일 경우, 빌드 시 저장할 profile을 multiple로 설정한다.)
   * @deprecated
   * @default []
   */
  generateProfiles?: Profile[];
}
