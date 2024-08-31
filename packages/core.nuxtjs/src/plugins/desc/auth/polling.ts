import { useLogger } from "#moong/nuxt/utils/logger";
import {
  UstraAuthDuplicationChecker,
  UstraAuthDuplicationCheckerOptions,
} from "./base";
import { Ustra } from "../../ustra";

const logger = useLogger("ustra:auth");

export class UstraAuthPollingDuplicationChecker extends UstraAuthDuplicationChecker {
  private startedPolling: boolean = false;
  private timer: any = null;
  private pollingFailCnt = 0;

  constructor($ustra: Ustra, option: UstraAuthDuplicationCheckerOptions) {
    super($ustra, option);
  }

  start() {
    if (this.startedPolling) {
      return;
    }

    this.startedPolling = true;
    logger.info("started authentication polling");

    const doPolling = () => {
      if (!this.$ustra.auth.isAuthenticated) {
        this.stop();
        return;
      }

      const authInfo = this.option.authInfoProvider();
      const param = this.$ustra.api.createUrlEncodedParameter({
        k: this.$ustra.utils.crypto.encrypt(
          JSON.stringify({
            UserKey: authInfo.userKey,
            RefreshToken: authInfo.token,
            ProcId: authInfo.procId,
          })
        ),
      });
      const sendUrl = this.authProps.duplication.checkPath + "?" + param;

      this.$ustra.api
        .call({
          url: sendUrl,
          method: "GET",
          showLoadingBar: false,
          passOnResponseError: true,
          excludeAuthValidation: true,
        })
        .then(async (res) => {
          this.pollingFailCnt = 0;

          // 중복 인증
          if (res?.data?.resultCode === "FS01") {
            this.option.onDuplicated();
            this.stop();
            return;
          }

          // 인증 만료
          if (res?.data?.resultCode === "FS10") {
            this.option.onExpired();
            return;
          }

          this.timer = setTimeout(
            () => doPolling(),
            this.authProps.duplication.pollingMilliSec || 10000
          );
        })
        .catch(async (e) => {
          this.pollingFailCnt++;

          if (this.pollingFailCnt >= 10) {
            this.option.onExpired();
            this.stop();
            return;
          }

          this.timer = setTimeout(
            () => doPolling(),
            this.authProps.duplication.pollingMilliSec || 10000
          );
        });
    };
    doPolling();
  }
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.startedPolling = false;
    this.pollingFailCnt = 0;
    logger.info("finished authentication polling");
  }
}
