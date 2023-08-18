import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { setCookies, certCookies } from '@/plugins/cookies'

import * as s$auth from '@/services/auth'

export const d$auth = defineStore('auth', () => {
  // state
  const user = ref({
    id: undefined,
    name: undefined,
    role: undefined
  })

  // action
  const setUser = () => {
    try {
      const { id, name, role } = certCookies()
      user.value = {
        id,
        name,
        role
      }
      return 'User Authenticated'
    } catch ({ message }) {
      user.value = {
        id: undefined,
        name: undefined,
        role: undefined
      }
      throw message
    }
  }

  const login = async (body) => {
    try {
      const { data } = await s$auth.login(body)
      setCookies('CERT', data.token, { datetime: data.expiresAt })
      return true
    } catch ({ error, message }) {
      throw message ?? error
    }
  }

  // getter
  const g$user = computed(() => user.value)
  const isLoggedIn = computed(() => !!user.value.id)

  return {
    // actions
    setUser,
    login,

    // getters
    g$user,
    isLoggedIn
  }
})
