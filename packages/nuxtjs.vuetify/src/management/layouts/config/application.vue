<template>
  <VCard>
    <template #text>
      <h3>Application</h3>
      <div class="mt-10">
        <UMessage>어플리케이션 캐시를 제거합니다. (재인증 필요)</UMessage>
        <div class="mt-3 ml-5">
          <VBtn @click="() => removeCache()">캐시 제거</VBtn>
        </div>
      </div>

      <div class="mt-10">
        <span>일부 데이터의 캐시 정보를 삭제하고 리로드합니다.</span>
        <div class="mt-3 ml-5">
          <VBtn @click="() => reloadCache('code')">코드 데이터</VBtn>
          <VBtn @click="() => reloadCache('menu')">메뉴 데이터</VBtn>
          <VBtn @click="() => reloadCache('prop')">설정 데이터</VBtn>
        </div>
      </div>
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { nextTick } from "#moong/nuxt";

async function removeCache() {
  const result = await confirm(
    "어플리케이션 캐시를 제거하겠습니까?\n캐시 제거 후, 로그인 페이지로 이동됩니다."
  );

  if (!result) {
    return;
  }

  window.localStorage.clear();
  window.sessionStorage.clear();

  await nextTick();

  window.location.replace(
    $ustra.env.appProps.nuxt.management.ui.defaultPage.login.path || "/"
  );
}

async function reloadCache(type: "code" | "menu" | "prop") {
  await $ustra.management.store.initData.initData(type);
  alert("데이터 리로드가 완료 되었습니다.");
}
</script>
<script lang="ts">
export default {
  name: "ConfigPopupApplication",
};
</script>
