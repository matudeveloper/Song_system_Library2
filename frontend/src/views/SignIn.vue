<template>
  <div>
    <h1>Sign In</h1>
    <!-- Email -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Email</span>
      </label>
      <input type="text" name="email" placeholder="Type here" class="input input-bordered w-full max-w-xs"
        v-on:keyup="checkEmail" v-model="state.signInEmail" />
      <label class="label">
      </label>
    </div>

    <!-- Password -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Password</span>
      </label>
      <input type="password" name="password" placeholder="Type here" class="input input-bordered w-full max-w-xs"
        v-model="state.signInPassword" />
      <label class="label">
        <!-- Show red text if the password is too short -->
        <span class="label-text-alt text-red-600" id="password-error"
          :class="{ invisible: !(state.signInPassword.length > 0 && state.signInPassword.length < 8) }">Password must be
          at least 8
          characters long</span>
      </label>
    </div>
  </div>
  <div class="h-30">&nbsp;</div>
  <button id="sign-up" class="btn btn-primary" @click="signIn">Sign In</button>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { $http } from '../utils/http'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const router = useRouter()
const state = reactive({
  signInEmail: '',
  signInPassword: '',
  emailCheckResult: ''
})

async function signIn() {

  // Send a POST request to the backend
  $http.post('/sessions/sessions', {
    email: state.signInEmail,
    password: state.signInPassword
  }).then((response: any) => {
    // Redirect to sign-in page
    localStorage.setItem('sessionId', response.message)
    appStore.sessionId = response.message

    router.push('/dashboard')

  })
}
async function checkEmail() {

  // If the email is empty, don't send a request
  if (!state.signInEmail) {
    state.emailCheckResult = ''
    return
  }

  // Send a POST /users/check-email request to the backend
  $http.post('/users/check-email', {
    email: state.signInEmail
  }, { disableErrorHandling: true }).then(response => {
    state.emailCheckResult = '';
  }).catch(response => {
    state.emailCheckResult = response.body.error;
  })
}


</script>
