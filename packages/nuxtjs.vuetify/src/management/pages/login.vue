<template>
  <div id="login-wrapper" class="d-flex h-screen">
    <VRow class="h-100 contents">
      <VCol class="">
        <VRow>
          <VCol align="center"
            ><img
              src="@moong/nuxt-vuetify/src/management/resources/img/gsitm.png"
              style="margin-bottom: 5px"
          /></VCol>
        </VRow>
        <VRow>
          <VCol
            align="center"
            class="inter text-h6 font-weight-bold text-white"
          >
            U.STRA Node Framework Sample - BO
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <div class="px-10">
              <VTextField
                label="아이디"
                bg-color="white"
                v-model="inputData.userId"
                @keyup.enter="() => passwordInput.control.focus()"
                clearable
              ></VTextField>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <div class="px-10">
              <VTextField
                label="비밀번호"
                bg-color="white"
                ref="passwordInput"
                v-model="inputData.password"
                @keyup.enter="() => login()"
                type="password"
                clearable
              ></VTextField>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <div class="px-10">
              <!-- <UCheckGroupBox :items-source="[{ text: '아이디 기억하기' }]" v-model="rememberId"> </UCheckGroupBox> -->

              <VBtn
                prepend-icon="mdi-login"
                block
                class="bg-primary mb-2"
                @click="() => login()"
                v-show="loginBtnShow"
                >로그인</VBtn
              >
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <span class="text-notice d-block"
              >※ 테스트 시, 사용자 삭제 및 비밀번호 변경에 주의하시기
              바랍니다.</span
            >
            <span class="text-white d-block"
              >㉿ GSITM 2020-{{ new Date().getFullYear() }}</span
            >
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>
<script lang="ts" setup>
import { useUstraManagementLoginPage } from "#moong/nuxt/management/composables";
import { useUstraManagementApp } from "#moong/nuxt/management/composables/ui";
import { onMounted, ref } from "#moong/nuxt";
import { useOnError } from "#moong/nuxt/composables/utils";
const { inputData, doLogin, appTitle, footerText, init, getRememberId } =
  useUstraManagementLoginPage(true);
const { passwordPopup } = useUstraManagementApp();
const passwordInput = ref();
const rememberId = ref(false);
const loginBtnShow = ref(true);

passwordPopup.onHidden(() => init());

async function login() {
  // const validationResult = await validationGroup.value.validate()

  // if (!validationResult.isValid) {
  //   return
  // }

  await useOnError(
    () =>
      doLogin({
        id: inputData.userId,
        password: inputData.password,
        completion: false,
        storeIdOnSuccess: rememberId.value,
        onRequireApproval: async (type, name, result) => {
          console.log("result", result);
          await confirm(result.actionResponse.message);
        },
        onRequirePasswordChange: async (optional, result) => {
          if (optional) {
            const confirmResult = await confirm(result.actionResponse.message);

            if (confirmResult) {
              await passwordPopup.value.openAndWait();
              return;
            }
            return true;
          } else {
            await alert(result.actionResponse.message);
            await passwordPopup.value.openAndWait();
            return false;
          }

          return false;
        },
        onLoginSuccess: (nextUrl) => {
          navigateTo(nextUrl);
        },
      }),
    {
      message: "로그인 처리 중 오류가 발생하였습니다.",
    }
  )();
}

definePageMeta({
  layout: false,
  auth: {
    required: false,
  },
});
</script>
<style scoped lang="scss">
#login-wrapper {
  background-image: url("@moong/nuxt-vuetify/src/management/resources/img/main-background.jpg");
  background-size: cover;
  background-position: center center;
  .contents {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 400px;
  }

  .text-notice {
    font-size: 0.85rem;
    margin: 5px;
    color: rgb(122, 184, 235);
    text-decoration: underline;
  }
  .text-white {
    font-size: 0.9rem;
    color: white;
  }
}
</style>
