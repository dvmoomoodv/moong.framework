위의 예제와 같이 API 등의 통신을 통한 데이터의 검증은 custom function을 사용하여 설정 가능하나, 입력 데이터의 변경 시 마다 검증을 수행하는 것은 문제가 될 수 있으므로 delay 설정을 추가하여 일정 기간의 지연을 설정할 수 있다.
```html
<template>
<UValidationGroup ref="validationGroup">
  <UFieldSet>
  </UFieldSet>

  <UButton text="Validate" @click="() => validateForm()" />
</template>

<script lang="ts" setup>

const userInput = reactive({
  currentPassword: null,
  newPassword: null,
  passwordConfirm: null,
})
const currentPasswordInput = ref()
const validationGroup = ref<InstanceType<typeof UValidationGroup>>()

async function validateNewPassword() {
  const currentPasswordValidationResult = await currentPasswordInput.value.validate()

  if (currentPasswordValidationResult !== true) {
    return
  }

  if (!userInput.newPassword) {
    return '비밀번호를 입력해주세요.'
  }

  const { validPassword } = useUstraLoginService()
  const passwordValidResult = await validPassword(userInput.newPassword, userInput.currentPassword, 'admin')
  if (passwordValidResult.valid) {
    return true
  }

  return passwordValidResult.invalidMessage
}

async function validateForm() {
  const result = await validationGroup.value.validate()

  console.log('result', result)
}
</script>

```
