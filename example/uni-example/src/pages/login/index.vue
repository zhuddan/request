<script setup lang="ts">
import { ref } from 'vue'
import { getCodeImg } from '@/api/auth'

const form = ref({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
})

const codeImg = ref('')
function submit() {

}

function getCode() {
  return getCodeImg().then((res) => {
    codeImg.value = res.img
    form.value.uuid = res.uuid
  })
}
</script>

<template>
  <view class="w-full h-full flex flex-col items-center page  login-page">
    <image
      src="/static/logo.png"
      class="logo"
    />

    <text class="text-black-1 text-center font-bold mt-40">
      欢迎使用uni-app
    </text>

    <view class="form">
      <view class="form-item flex items-center">
        <iconfont
          name="user"
          color="#666"
        />
        <input
          v-model="form.username"
          type="text"
          class="text-black-1 text-default"
          placeholder-class="text-black-3 text-default"
          placeholder="请输入用户名"
        >
      </view>
      <view class="form-item flex items-center">
        <iconfont
          name="lock"
          color="#666"
        />
        <input
          v-model="form.password"
          type="text"
          class="text-black-1 text-default"
          placeholder-class="text-black-3 text-default"
          password
          placeholder="请输入密码"
        >
      </view>

      <view class="form-item flex items-center">
        <input
          v-model="form.code"
          type="text"
          class="text-black-1 text-default"
          placeholder-class="text-black-3 text-default"
          placeholder="请输入验证码"
        >
        <image
          class="code-img"
          :src="`data:image/gif;base64,${codeImg}`"
          @click="getCode"
        />
      </view>

      <button
        :disabled="!form.username || !form.password"
        class="login-btn"
        @click="submit"
      >
        登录
      </button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #fff;
}

.login-page {
  height: 100%;
  // background-image: url('/static/images/7c7521b8704dc3378c327e4baa364f3.png');
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  // padding-top: 120rpx;
}

.logo {
  margin-top: 200rpx;
  height: 180rpx;
  width: 180rpx;
}

.title-box {
  width: 12em;
  text-align: center;
}

.login-card {
  width: 600rpx;
  padding: 40rpx 40rpx 0;
}

.copyright {
  bottom: 10rpx;
  left: 0;
  right: 0;
}

.form {
  margin-top: 80rpx;

  .form-item {
    border-bottom: 1px solid #f2f2f2;
    width: 600rpx;
    height: 100rpx;

    & + .form-item {
      margin-top: 50rpx;
    }

    input {
      padding: 0 30rpx;
      flex: 1;
      height: 100%;
    }
  }
}

.code-img {
  width: 200rpx;
  height: 80rpx;
}

button.login-btn,
button.login-btn[disabled] {
  border-radius: 45rpx;
  text-align: center;
  line-height: 90rpx;
  margin-top: 77rpx;
  font-size: 30rpx;
  font-family:
    PingFangSC-Medium,
    PingFang SC;
  font-weight: bolder;
  color: rgba(255, 255, 255, 1);
  background-color: $uni-color-primary;
}

button.login-btn[disabled] {
  opacity: 0.5;
}
.test {
  display: flex;
  justify-content: center;
}
</style>
