import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import * as s$list from '@/services/lists'

export const useListStore = defineStore('list', () => {
  // state
  const list = ref([])

  // getter
  const getList = computed(() => list.value)
  // getter with params
  const getDetail = (id) => computed(() => list.value.find(( obj ) => obj.id === id))

  // action
  async function initList() {
    try {
      const { data } = await s$list.list()
      list.value = data
    } catch ({ message, error }) {
      throw message ?? error
    }
  }

  async function addList(data) {
    try {
      await s$list.add(data)
      await initList()
    } catch ({ message, error }) {
      throw message ?? error
    }
  }

  const removeList = async (id) => {
    try {
      await s$list.remove(id)
      await initList()
    } catch ({ message, error }) {
      throw message ?? error
    }
  }
  const editList = async (id, data) => {
    try {
      await s$list.edit(id, data)
      await initList()
    } catch ({ message, error }) {
      throw message ?? error
    }
  }

  return { getList, initList, getDetail, addList, removeList, editList }
})
