

<template>
  <div id="app">
    <nav>
      <div v-if="!appStore.sessionId">
        <router-link to="/signup">Sign Up</router-link>
        <router-link to="/signin">Sign In</router-link>
      </div>

      <button @click="submit" v-else>Sign out</button>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { $http } from './utils/http';
import { useRouter } from 'vue-router'
import { useAppStore } from './stores/app'

const appStore = useAppStore()
const router = useRouter()

const submit = async () => {

  await $http.delete(`/sessions/sessions`).then(response => {
    // Redirect to sign-in page
    localStorage.removeItem('sessionId')
    appStore.sessionId = ""
    router.push('/signin')
  });
}
onMounted(async () => {
  appStore.sessionId = localStorage.getItem("sessionId")
})
</script>
