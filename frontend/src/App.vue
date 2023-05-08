

<template>
  <div class="navbar bg-base-100" style="background-color: #F2F2F2F2;">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li><a>Item 1</a></li>
          <li tabindex="0">
            <a class="justify-between">
              Parent
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </a>
            <ul class="p-2">
              <li><a>Submenu 1</a></li>
              <li><a>Submenu 2</a></li>
            </ul>
          </li>
          <li><a>Item 3</a></li>
        </ul>
      </div>
      <RouterLink to="/" class="btn btn-ghost normal-case text-xl">Laulud</RouterLink>
    </div>
    <div class="navbar-end hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-if="!appStore.sessionId"> <router-link to="/signup">Sign Up</router-link></li>
        <li v-if="!appStore.sessionId"><router-link to="/signin">Sign In</router-link></li>
        <li v-if="appStore.sessionId"><router-link to="/dashboard">Dashboard</router-link></li>

        <li> <button @click="submit" v-if="appStore.sessionId">Sign out</button>
        </li>
      </ul>
    </div>

  </div>
  <div id="app">

    <router-view></router-view>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { $http } from './utils/http';
import { RouterLink, useRouter } from 'vue-router'
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
