/**
 * 환경 변수를 관리하기 위한 모듈
 * @packageDocumentation
 */

/**
 * profile declaration
 */
enum Profile {
  LOCAL = "local,loc",
  DEV = "dev",
  QA = "qa",
  STAGING = "staging,tst,sta,stg",
  PRODUCTION = "prd,production,env",
}

export class Env {
  private lastConfigEnv = null;

  /**
   * 현재 프로파일 조회
   * @param configEnv profile 조회할 환경 변수 {@default process.env.CONFIG_ENV}
   * @param defaultProfile profile 값이 없을 경우, 조회할 default profile
   * @returns 현재 프로파일
   * ```typescript
   * import { Env } from '#moong/core'
   * // process.env.CONFIG_ENV 설정의 현재 프로파일 조회
   * Env.currentProfile()
   * ```
   */
  currentProfile(
    configEnv?: string,
    defaultProfile: Profile = Profile.PRODUCTION
  ): Profile {
    if (!configEnv) {
      configEnv = this.lastConfigEnv || process.env.CONFIG_ENV;
    }
    return this.getProfile(configEnv, defaultProfile);
  }

  /**
   * 환경 변수 config Env를 변경한다.
   * @param configEnv
   */
  updateCurrentProfile(configEnv: string) {
    this.lastConfigEnv = configEnv;
  }

  /**
   * property 구분에 사용할 Profile명 조회
   * @param profile {Profile}
   */
  propertyProfileName(profile?: Profile) {
    if (!profile) {
      profile = this.currentProfile();
    }

    return this.findProfileKey(profile).toLowerCase();
  }

  /**
   * local dev server 환경 여부
   */
  isDevServer(): boolean {
    const nodeEnv = process.env.NODE_ENV;

    if (!nodeEnv || nodeEnv !== "production") {
      return true;
    }

    return false;
  }

  /**
   * local 개발 환경 여부
   */
  isLocal(): boolean {
    return this.currentProfile() === Profile.LOCAL;
  }

  /**
   * 운영 환경인지 확인
   */
  isProduction(): boolean {
    return this.currentProfile() === Profile.PRODUCTION;
  }

  /**
   * 개발 환경인지 확인
   */
  isDev(): boolean {
    return this.currentProfile() === Profile.DEV;
  }

  /**
   * Staging 환경인지 확인
   */
  isStaging(): boolean {
    return this.currentProfile() === Profile.STAGING;
  }

  /**
   * QA 환경여부 확인
   * @returns
   */
  isQa(): boolean {
    return this.currentProfile() === Profile.QA;
  }

  /**
   * 환경 변수의 기본 프로파일 조회
   * @param profile 현재설정된 profile 환경변수 값
   * @param defaultProfile {Profile}
   */
  getProfile(
    profile: string,
    defaultProfile: Profile = Profile.LOCAL
  ): Profile {
    if (!this.existsProfile(profile)) {
      return defaultProfile;
    }

    return this.findProfile(profile);
  }

  /**
   * 서버 프로파일 명을 조회한다.
   * @param profile
   */
  getServerProfileName(profile: Profile) {
    if (profile === Profile.LOCAL) {
      return "local";
    } else if (profile === Profile.DEV) {
      return "dev";
    } else if (profile === Profile.STAGING) {
      return "stg";
    } else if (profile === Profile.QA) {
      return "qa";
    } else {
      return "prd";
    }
  }

  private existsProfile(profile: string): boolean {
    if (!profile) {
      return false;
    }

    for (const m in Profile) {
      if ((Profile[m] as string).indexOf(profile) >= 0) {
        return true;
      }
    }

    return Profile[profile] !== undefined;
  }

  private findProfile(profile: string): Profile {
    for (const m in Profile) {
      if ((Profile[m] as string).indexOf(profile) >= 0) {
        return Profile[m];
      }
    }

    return null;
  }

  private findProfileKey(profile: Profile): string {
    for (const key in Profile) {
      if (Profile[key] === profile) {
        return key;
      }
    }

    return null;
  }
}

const instance = new Env();
export { instance as env, Profile };
