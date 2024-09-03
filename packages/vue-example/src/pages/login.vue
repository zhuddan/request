<script setup lang="ts">
import { ref } from 'vue'
import { getCodeImg, login } from '~/api/auth'
import { setCacheToken } from '~/utils/cache'

const router = useRouter()
const form = ref({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
})

const codeImg = ref('')
function submit() {
  login(form.value)
    .then((res) => {
      setCacheToken(res.token)
      router.back()
    }).catch(getCode)
}

function getCode() {
  return getCodeImg()
    .then((res) => {
      codeImg.value = res.img
      form.value.uuid = res.uuid
    })
}
getCode()
</script>

<template>
  <div class="page login-page h-full w-full flex flex-col items-center">
    <p class="text-black-1 mt-40 text-center font-bold">
      vue-example
    </p>

    <div class="form">
      <div class="form-item flex items-center">
        <input
          v-model="form.username"
          type="text"
          class="text-black-1 text-default"
          placeholder-class="text-black-3 text-default"
          placeholder="请输入用户名"
        >
      </div>
      <div class="form-item flex items-center">
        <input
          v-model="form.password"
          type="text"
          class="text-black-1 text-default"
          placeholder-class="text-black-3 text-default"
          password
          placeholder="请输入密码"
        >
      </div>

      <div class="form-item flex items-center">
        <input
          v-model="form.code"
          type="text"
          class="text-black-1 text-default"
          placeholder-class="text-black-3 text-default"
          placeholder="请输入验证码"
        >
        <img
          class="h-10"
          :src="`data:image/gif;base64,${codeImg}`"
          @click="getCode"
        >
      </div>

      <button
        :disabled="!form.username || !form.password"
        @click="submit"
      >
        登录
      </button>
    </div>
  </div>
</template>

<style lang="scss">
input {
  border: 1px solid #ccc;
  height: 2em !important;
  margin: 10px;
  border-radius: 0.25em;
  padding: 0.2em;
  box-sizing: border-box;
  width: 100%;
}

button {
  background: rgb(24, 205, 218);
  width: 100%;
  height: 2em !important;
  margin: 10px;
  border-radius: 0.25em;
  color: white;
}

.login-page {
  height: 100%;
  // background-image: url('/static/images/7c7521b8704dc3378c327e4baa364f3.png');
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  // padding-top: 120px;
}
</style>
