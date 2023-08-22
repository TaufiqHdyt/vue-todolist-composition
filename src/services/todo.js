import { baseApi } from '@/plugins/axios'

const api = '/api/todo'

const list = () => baseApi.get(`${api}`)
const add = (body) => baseApi.post(`${api}`, body)
const remove = (id) => baseApi.delete(`${api}/${id}`)
const edit = (id, body) => baseApi.put(`${api}/${id}`, body)

export { list, add, remove, edit }
