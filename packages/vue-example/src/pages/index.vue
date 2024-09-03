<script setup lang="ts">
import { ref } from 'vue'
import { getInfo } from '~/api/auth'

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
  <router-link to="/login">
    <button>
      login
    </button>
  </router-link>
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
  height: 200px;
  width: 200px;
  margin-top: 200px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36px;
  color: #8f8f94;
}

button {
  background: rgb(24, 205, 218);
  width: 100%;
  height: 2em !important;
  margin: 10px;
  border-radius: 0.25em;
  color: white;
}
</style>
