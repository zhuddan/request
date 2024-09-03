<script setup lang="ts">
import { ref } from 'vue'
import { getInfo } from '@/api/auth'

const userInfo = ref<Api.UserInfo>()
function handleGetInfo() {
  getInfo()
    .then((res) => {
      // console.log(res)
      userInfo.value = res.user
    })
}
</script>

<template>
  <navigator url="../login/index" hover-class="navigator-hover">
    <button>
      login
    </button>
  </navigator>
  <button @click="handleGetInfo">
    getinfo
  </button>
  {{ userInfo?.nickName }}
</template>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
