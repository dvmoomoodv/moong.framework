<template>
  <VCard>
    <template #text>
      <h3>Password</h3>

      <UValidationGroup ref="validationGroup" class="mt-5">
        <UFieldSet>
          <UFieldRow>
            <div class="mt-4 mb-4">
              <span v-html="passwordGuide"></span>
            </div>
          </UFieldRow>
          <UFieldRow>
            <UField label="아이디">
              <VTextField :modelValue="user.sub" readonly />
            </UField>
          </UFieldRow>

          <UFieldRow>
            <UField label="현재 비밀번호" required>
              <VTextField type="password" ref="currentPasswordInput" v-model="userInput.currentPassword" />
            </UField>
          </UFieldRow>

          <UFieldRow>
            <UField label="신규 비밀번호" required>
              <VTextField type="password" v-model="userInput.newPassword" />
            </UField>
          </UFieldRow>

          <UFieldRow>
            <UField label="비밀번호 확인" required>
              <VTextField type="password" v-model="userInput.passwordConfirm" />
            </UField>
          </UFieldRow>
        </UFieldSet>
      </UValidationGroup>

      <UButtonBox right top>
        <VBtn color="primary" :width="80" @click="save" v-if="!!user.sub"> 변경 </VBtn>
      </UButtonBox>
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, shallowRef } from '#ustra/nuxt'
import { useUstraLoginService } from '#ustra/nuxt/management'
import { useUstraManagementUser } from '#ustra/nuxt/management/composables'
import { useOnError } from '#ustra/nuxt/composables'

const service = useUstraLoginService()

const emits = defineEmits<{
  (e: 'requiredClose')
}>()

const currentPasswordInput = ref()
const validationGroup = shallowRef<InstanceType<typeof UValidationGroup>>()

// input box values
const user = computed(() => useUstraManagementUser())
const userInput = reactive({
  currentPassword: null,
  newPassword: null,
  passwordConfirm: null,
})

// password text
const passwordGuide = computed(() => {
  return $ustra.env.appProps.nuxt.management.security.password.creationPolicyHtmlText
})

async function validateNewPassword() {
  const currentPasswordValidationResult = await currentPasswordInput.value.validate()

  if (currentPasswordValidationResult !== true) {
    return
  }

  if (!userInput.newPassword) {
    return '비밀번호를 입력해주세요.'
  }

  const passwordValidResult = await service.validPassword(userInput.newPassword, userInput.currentPassword, user.value.sub)
  if (passwordValidResult.valid) {
    return true
  }

  return passwordValidResult.invalidMessage
}

async function save() {
  await useOnError(async () => {
    if (!user.value.sub) {
      await alert('유효하지 않은 요청입니다.')
      return
    }

    const result = await validationGroup.value.validate()
    if (!result.isValid) {
      return
    }

    if (await confirm('비밀번호를 변경하시겠습니까?')) {
      await service.updatePassword(user.value.sub, userInput.currentPassword, userInput.newPassword)
      alert('비밀번호 변경이 완료되었습니다.')
      emits('requiredClose')
    }
  })()
}
</script>
<script lang="ts">
export default {
  name: 'ConfigPopupPassword',
}
</script>
