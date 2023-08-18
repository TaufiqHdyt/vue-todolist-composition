import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // state
  const username = ref('')

  // action
  const setUsername = (string) => (username.value = string)

  // getter
  const getUsername = computed(() => username.value)
  const isLoggedIn = computed(() => !!username.value)

  return { username, setUsername, getUsername, isLoggedIn }
})
