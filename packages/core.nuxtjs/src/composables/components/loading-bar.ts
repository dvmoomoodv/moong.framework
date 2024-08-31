import { ref, nextTick } from "#moong/nuxt";

/**
 * 로딩 바 컴포넌트를 정의한다.
 * @see http://guide.ustraframework.kro.kr/ref-doc/11/2qVJzrAG84jnhZ104ktx
 */
export const defineUstraLoadingBarComponent = () => {
  const showLoadingBar = ref(false);
  const showPrgressBar = ref(false);
  const loadingCount = ref(0);
  const progressRate = ref(0);

  $ustra.hooks.hook("ui:progress", async (progress) => {
    await nextTick();

    if (progress.type === "loading") {
      if (progress.show) {
        loadingCount.value++;
        showLoadingBar.value = true;
      } else {
        loadingCount.value--;

        if (loadingCount.value < 1) {
          showLoadingBar.value = false;
        }
      }
    } else {
      // when wrong progressRate
      if (isNaN(progress.progressRate)) {
        showPrgressBar.value = false;
        return;
      }

      progressRate.value = progress.progressRate;
      showPrgressBar.value = progress.show;
    }
  });

  return { showLoadingBar, loadingCount, progressRate, showPrgressBar };
};
