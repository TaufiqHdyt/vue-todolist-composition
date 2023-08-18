<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '@store/auth'

import BaseInput from '@comp/BaseInput.vue'

const router = useRouter()
const auth = useAuthStore()

const initialInput = {
  username: ''
}

const input = ref({ ...initialInput })

const resetForm = () => Object.assign(input.value, initialInput)

const submitForm = () => {
  auth.setUsername(input.value.username)
  resetForm()

  router.replace({
    name: 'Authenticated',
    params: { id: auth.getUsername }
  })
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <!-- conditional rendering using v-if directive -->
    <form
      v-if="!auth.getUsername"
      method="post"
      @submit.prevent="() => submitForm()"
      @reset="() => resetForm()"
    >
      <base-input
        v-model="input.username"
        placeholder="input username"
        required
      />
      <button type="submit" hidden>Login</button>
    </form>

    <!-- conditional rendering using v-else directive -->
    <h3 v-else>{{ auth.getUsername }}</h3>
  </div>
</template>
