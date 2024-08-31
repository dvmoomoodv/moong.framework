import { useRouter } from "#app";
import { apiModels } from "#moong/core/data";
import {
  reactive,
  computed,
  onBeforeMount,
  nextTick,
  useDeepMerge,
} from "#moong/nuxt";
import { LoginResult } from "#moong/nuxt/management/services/common/login";
import { useLocalStorage } from "@vueuse/core";

const REMEMBER_ID_STORAGE_KEY = "ustra:management:remember-id";

/**
 * 로그인 기능 사용
 * @param useRememberId 사용자 아이디 기억 기능 사용 여부
 * @returns
 */
export const useUstraManagementLoginPage = (useRememberId?: boolean) => {
  const router = useRouter();

  /**
   * 로그인 시 입력 데이터
   */
  const inputData: any = reactive({
    /**
     * 사용자 아이디
     */
    userId: null,

    /**
     * 패스워드
     */
    password: null,

    /**
     * 인증 키 값
     */
    authKey: null,
  });

  /**
   * 초기화
   */
  function init() {
    console.log("init");
    $ustra.utils.core.deepMerge(inputData, {
      userId: null,
      password: null,
      authKey: null,
    });
  }

  /**
   * 어플리케이션 제목
   */
  const appTitle = computed(() => {
    return $ustra.env.appProps.nuxt.management.ui.appTitle;
  });

  /**
   * 하단 텍스트
   */
  const footerText = computed(() => {
    return `㉿ GSITM 2020-${$ustra.utils.date.format(new Date(), "yyyy")}`;
  });

  const remeberIdStorage = useLocalStorage(REMEMBER_ID_STORAGE_KEY, null);
  onBeforeMount(() => {
    if (remeberIdStorage.value) {
      inputData.userId = remeberIdStorage.value;
    }
  });

  /**
   * 저장된 아이디 조회
   * @returns
   */
  function getRememberId() {
    return remeberIdStorage.value;
  }

  /**
   * 로그인 처리
   */
  async function doLogin(options: {
    /**
     * 아이디
     */
    id?: string;

    /**
     * 패스워드
     */
    password?: string;

    /**
     * 완료 여부
     */
    completion?: boolean;

    /**
     * 성공 시 아이디 저장
     */
    storeIdOnSuccess?: boolean;

    /**
     * 로그인 결과 값 처리
     *  - result : 로그인 결과
     *    결과 코드 값은 result.body.resCd로 확인 가능하며 다음과 같은 응답이 올 수 있음.
     *    - FS02 : 계정 조회 실패
     *    - FS03 : 계정 조회 실패
     *    - FS04 : 접속 불가능한 위치
     *    - FS05 : 비밀번호 불일치
     *    - FS06 : 시스템 사용 불가
     *    - FS07 : 사용 기간 만료
     *    - FS08 : 비밀번호 변경 필요
     *    - FS09 : 계정 잠금
     *    - FS0C : 비밀번호 미입력
     *    - FS0F : 최대 인증 수 초과
     *    - FS0G : 유효하지 않은 인증 키 (2FA)
     *    - FS0H : 만료된 인증 키 (2FA)
     *    - FSFF : 기타
     *  - return : true 반환 시에는 기본 처리를 지속 진행, false 반환 시에는 종료 처리
     */
    handleLoginResult?: (
      result: apiModels.ApiResponse<LoginResult>
    ) => Promise<boolean> | boolean;

    /**
     * 비밀번호 변경 필요
     *  - optional: 변경 불필요 여부
     *  - loginResult : 로그인 결과
     *  - return : 패스워드 변경 완료 여부 (optional false일 경우, 패스워드 미변경 시 true 리턴할 경우 다음 화면 이동)
     */
    onRequirePasswordChange?: (
      optional: boolean,
      loginResult: LoginResult
    ) => boolean | Promise<boolean>;

    /**
     * 승인 처리
     *  @param type 승인 유형
     *  @param name : 승인 명
     *  @param loginResult  : 로그인 결과
     */
    onRequireApproval?: (
      type: string,
      name: string,
      loginResult: LoginResult
    ) => void | Promise<void>;

    /**
     * 로그인 성공 시 다음 페이지 이동 처리
     * @param nextUrl 다음 화면 URL
     * @returns
     */
    onLoginSuccess?: (nextUrl: string) => void | Promise<void>;
  }) {
    options = useDeepMerge(
      {
        onLoginSuccess: (nextUrl) => {
          // FIXME: nuxt3.8.1 NuxtLayout 관련 오류 사항으로 임시 수정
          nextTick(() => router.push(nextUrl));
          // if (process.dev) {
          //   nextTick(() => router.push(nextUrl))
          // } else {
          //   window.location.href = nextUrl
          // }
        },
      },
      options
    );

    const result = await $ustra.management.auth.login(
      options.id,
      options.password,
      options.completion
    );
    const response = result.body.actionResponse;
    const storeId = useRememberId && options.storeIdOnSuccess;

    if (options.handleLoginResult) {
      const handleResult = await options.handleLoginResult(result);

      if (handleResult === false) {
        return result.body;
      }
    }

    if (response.action === "SUCCESS") {
      if (storeId) {
        remeberIdStorage.value = options.id;
      }

      await options.onLoginSuccess(response.nextPath);
      return result.body;
    }

    if (response.action === "SHOW_DIALOG") {
      if (storeId) {
        remeberIdStorage.value = null;
      }
      await alert(response.message);
      return result.body;
    }

    if (response.action === "SUCCESS_RECOMMEND_CHANGE_PASSWORD") {
      if (storeId) {
        remeberIdStorage.value = options.id;
      }
      if (options.onRequirePasswordChange) {
        const passwordChangeResult = await options.onRequirePasswordChange(
          true,
          result.body
        );

        if (passwordChangeResult) {
          await options.onLoginSuccess(response.nextPath);
        }
        return result.body;
      }
    }

    if (response.action === "REQUIRE_CHANGE_PASSWORD") {
      if (storeId) {
        remeberIdStorage.value = options.id;
      }
      if (options.onRequirePasswordChange) {
        await options.onRequirePasswordChange(false, result.body);
        return result.body;
      }
    }

    if (response.action === "FAIL_REQUIRE_APPROVAL") {
      if (storeId) {
        remeberIdStorage.value = options.id;
      }
      if (options.onRequireApproval) {
        await options.onRequireApproval(
          response.approvalType,
          response.approvalName,
          result.body
        );
        return result.body;
      }
    }

    return result.body;
  }

  return { inputData, doLogin, appTitle, footerText, init, getRememberId };
};
