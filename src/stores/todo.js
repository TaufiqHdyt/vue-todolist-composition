import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import * as s$todo from '@/services/todo'

export const useTodoStore = defineStore('todo', () => {
  // state
  const todo = ref([])

  // getter
  const getTodo = computed(() => todo.value)
  // getter with params
  const getDetail = (id) => computed(() => todo.value.find(( obj ) => obj.id === id))

  // action
  async function init() {
    try {
      const { data } = await s$todo.list()
      todo.value = data
    } catch ({ message, error }) {
      throw message ?? error
    }
  }

  async function addTodo(data) {
    try {
      await s$todo.add(data)
      await init()
    } catch ({ message, error }) {
      throw message ?? error
    }
  }

  const removeTodo = async (id) => {
    try {
      await s$todo.remove(id)
      await init()
    } catch ({ message, error }) {
      throw message ?? error
    }
  }
  const editTodo = async (id, data) => {
    try {
      await s$todo.edit(id, data)
      await init()
    } catch ({ message, error }) {
      throw message ?? error
    }
  }

  return { getTodo, init, getDetail, addTodo, removeTodo, editTodo }
})
