# 📚 Modul Pembelajaran Vue TODO List
## Berdasarkan Commit History Project

---

## 📖 Deskripsi

Modul pembelajaran ini mengajarkan Vue.js 3 dengan Vite, Pinia, Vue Router, dan best practices berdasarkan struktur project yang sudah ada. Modul ini menunjukkan evolusi dari commit ke commit dengan file-file yang nyata di project.

**Target:** Pemula hingga intermediate Vue.js developer  
**Durasi:** 4-8 jam pembelajaran  
**Prasyarat:** JavaScript ES6+, Git basics

---

## 🎯 Learning Outcomes

Setelah menyelesaikan modul ini, peserta akan mampu:

- Membuat Vue 3 aplikasi dengan Vite
- Implementasi state management dengan Pinia
- Setup routing dengan Vue Router
- Integrasi API dengan Axios
- Authentication flow dengan JWT & cookies
- Write unit tests dengan Vitest
- Code quality dengan ESLint & oxfmt

---

## 📑 Daftar Isi

1. [Setup Project](#1-setup-project)
2. [State Management](#2-state-management)
3. [Authentication System](#3-authentication-system)
4. [Todo CRUD](#4-todo-crud)
5. [Routing & Guards](#5-routing--guards)
6. [API Integration](#6-api-integration)
7. [Components & Views](#7-components--views)
8. [Styling](#8-styling)
9. [Testing](#9-testing)
10. [Code Quality](#10-code-quality)

---

## 1. Setup Project

### File: `package.json`, `vite.config.js`, `.gitignore`

### Topik Pembelajaran

#### 1.1 Understanding Vue 3 Ecosystem

```json
// package.json dependencies
{
  "dependencies": {
    "vue": "^3.5.31",
    "pinia": "^3.0.4",
    "vue-router": "^5.0.4",
    "axios": "^1.14.0",
    "sass": "^1.99.0"
  }
}
```

#### 1.2 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    hot: true
  }
})
```

#### 1.3 NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",                    // Development mode
    "build": "vite build",           // Production build
    "preview": "vite preview",       // Preview production build
    "test:unit": "vitest",          // Run tests
    "lint": "oxlint . --fix",       // Lint with auto-fix
    "format": "oxfmt src/"          // Format code
  }
}
```

### Practice Exercise

1. Buat file `vite.config.js` baru
2. Tambahkan plugin Vue
3. Setup port dan hot reload
4. Test dengan `pnpm dev`

---

## 2. State Management

### File: `src/stores/counter.js`, `src/stores/todo.js`

### Topik Pembelajaran

#### 2.1 Pinia Basics - Counter Store Template

```javascript
// stores/counter.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

#### 2.2 Pinia Basics - Todo Store Real Code

```javascript
// stores/todo.js
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
```

#### 2.3 Store Registration di main.js

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

### Practice Exercise

1. Buat store baru untuk `user`
2. Tambahkan state, getter, action
3. Gunakan di component dengan `useTodoStore()`
4. Test persistence state

---

## 3. Authentication System

### File: `src/stores/auth.js`, `src/plugins/cookies.js`

### Topik Pembelajaran

#### 3.1 User State Management - Real Code

```javascript
// stores/auth.js
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
    setUser,
    login,
    g$user,
    isLoggedIn
  }
})
```

#### 3.2 Cookie Management - Real Code

```javascript
// plugins/cookies.js
import { parseJwt } from '@/plugins/helper'

const setCookies = (name, value, { datetime }) => {
  const d = new Date()
  if (datetime) d.setTime(datetime)
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;`
}

const getCookies = (name) => {
  const cookies = `; ${document.cookie}`
  const byValue = cookies.split(`; ${name}=`)
  if (byValue.length === 2) return byValue.pop().split(';').shift()
}

const delCookies = (name) => {
  setCookies(name, '', -1)
}

const certCookies = () => {
  const token = getCookies('CERT')
  if (token) {
    const { id, name, role, exp } = parseJwt(token)
    if (!id) return delCookies('CERT')
    return {
      id,
      name,
      role,
      exp
    }
  }
  return {
    id: undefined,
    name: undefined,
    role: undefined,
    exp: undefined
  }
}

export { setCookies, getCookies, delCookies, certCookies }
```

### Practice Exercise

1. Buat form login dengan email/password
2. Call API `/auth/login`
3. Set cookie dengan token
4. Redirect ke dashboard jika authenticated
5. Buat logout function

---

## 4. Todo CRUD

### File: `src/stores/todo.js`, `src/views/TodoView.vue`

### Topik Pembelajaran

#### 4.1 Todo Store Structure

```javascript
// stores/todo.js (real code dari project)
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
```

#### 4.2 Todo UI Component - Real Code

```vue
<!-- views/TodoView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'

/**
 * import component with aliase defined in vite.config.js
 */
import BaseInput from '@comp/BaseInput.vue'
import BaseTable from '@comp/BaseTable.vue'

/**
 * initiate store
 */
const store = useTodoStore()

/**
 * initial state for default input value
 * use in reset form
 */
const defaultInput = {
  title: '',
  description: '',
  category: '',
  completed: false
}
const table = {
  columns: ['id', 'title', 'description', 'completed'],
  actions: [
    {
      title: 'log',
      event: 'log-event'
    },
    {
      title: 'toggle',
      event: 'toggle-event'
    }
  ]
}

/**
 * create reactive input from default input value
 * set editing state to false
 */
const input = ref({ ...defaultInput })
const editing = ref(false)

/**
 * reset form to its initial state
 * also set editing state to false
 */
const resetForm = () => {
  Object.assign(input.value, defaultInput)
  editing.value = false
}

/**
 * submit input form
 * check if editing state is false, add todo
 * when editing state contains id, edit todo by that id
 */
async function onSubmit() {
  // event.preventDefault();
  const data = { ...input.value }

  if (editing.value === false) {
    // add list via store
    await store.addTodo(data)
  } else {
    // edit list
    await store.editTodo(editing.value, data)
  }

  // reset form
  resetForm()
}

/**
 * get detail todo from store by selected todo id
 * set input value from detail todo
 * set editing state to its id
 * @param {int} id
 */
function detailTodo(id) {
  const detail = store.getDetail(id)
  input.value = { ...detail.value }
  editing.value = id
}

/**
 * get detail todo from store by selected todo id
 * take its completed value than toggle it
 * send updated value
 * @param {int} id
 */
async function toggleComplete(id) {
  const detail = store.getDetail(id)
  await store.editTodo(id, {
    // pass all entries in detail object
    ...detail.value,
    // take completed value then toggle it
    completed: !detail.value.completed
  })
}

async function handleLogEvent(row) {
  try {
    console.log(row)
  } catch (error) {
    console.error(error)
  }
}
async function handleToggleEvent(row) {
  try {
    await toggleComplete(row.id)
  } catch (error) {
    console.error(error)
  }
}

/**
 * when page is mounted / opened in browser,
 * get todo list from back end server
 */
onMounted(async () => await store.init())
</script>

<template>
  <div class="container">
    <h1>Test {{ $route.params?.id }}</h1>

    <!-- add v-model to integrate data binding with ref -->
    <!-- add event handler listener when keyup enter -->
    <!-- method handler with addList function -->
    <!-- event modifier .enter, .prevent -->
    <form class="form" @submit.prevent="onSubmit" @reset="resetForm">
      <BaseInput v-model="input.title" name="title" placeholder="Gaming" required />
      <BaseInput v-model="input.description" name="description" placeholder="Everyday" required />
      <BaseInput v-model="input.category" name="category" placeholder="Todo" />
      <div class="checkbox">
        <input type="checkbox" v-model="input.completed" name="completed" /> Completed
      </div>
      <button type="reset">Cancel</button>
      <button type="submit">{{ editing !== false ? 'Save' : 'Submit' }}</button>
    </form>

    <h4>Tasks</h4>
    <ol class="list">
      <!-- (item, index) -->
      <template v-for="(item, index) in store.getTodo" :key="index">
        <!-- null chaining (?.), nullish coalescing (??); ternary operator; not operator -->
        <li :class="{ strike: item?.completed }" @dblclick="toggleComplete(item.id)">
          <button class="red" @click="() => store.removeList(item.id)" :disabled="editing !== false">&times;</button>
          <button class="orange" @click="() => detailTodo(item.id)" :disabled="editing !== false">&#9998;</button>
          {{ item?.title }} - {{ !!item?.description ? item.description : '' }}
        </li>
      </template>
    </ol>

    <h4>Table</h4>
    <BaseTable
      :data="store.getTodo"
      :columns="table.columns"
      :actions="table.actions"
      @log-event="handleLogEvent"
      @toggle-event="handleToggleEvent"
    />
  </div>
</template>

<!-- style default bersifat global -->
<!-- scoped untuk melimitasi hanya di komponen -->
<!-- tambahkan lang="scss" agar bisa menggunakan fitur2 scss -->
<!-- pastikan sudah install package 'sass'; 'npm i sass' -->
<style scoped>
/* body = font-size: 16px (1rem) */
.form {
  margin-block-end: 2rem;
}
.list {
  /* rem, em, vh, vw */
  padding-block: 1rem;

  & > .strike {
    text-decoration: line-through;
  }
}

.checkbox {
  width: 100%;
}

button {
  .red {
    color: red;
  }
  .orange {
    color: orange;
  }
}
</style>
```

#### 4.3 CRUD Operations Explained

| Operation | Function | API Call | Service |
|-----------|----------|----------|---------|
| Get | `init()`, `getTodo` | `GET /api/todo` | `s$todo.list()` |
| Add | `addTodo()` | `POST /api/todo` | `s$todo.add(data)` |
| Edit | `editTodo()` | `PUT /api/todo/:id` | `s$todo.edit(id, data)` |
| Delete | `removeTodo()` | `DELETE /api/todo/:id` | `s$todo.remove(id)` |

### Practice Exercise

1. Buat form tambah todo
2. Implementasi edit modal
3. Add search/filter
4. Add status toggle (completed/pending)
5. Add date sorting

---

## 5. Routing & Guards

### File: `src/router/index.js`

### Topik Pembelajaran

#### 5.1 Router Setup - Real Code

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { d$auth } from '@store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/todo',
      name: 'Todo',
      component: () => import('@/views/TodoView.vue'),
      meta: { auth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      redirect: { name: 'Login' },
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/views/Profile/LoginView.vue')
        },
        {
          // add optional params
          path: 'detail/:id?',
          name: 'Authenticated',
          component: () => import('@/views/Profile/AuthenticatedView.vue'),
          // set protected route
          meta: { auth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Match All',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// navigation guards
router.beforeEach((to, from, next) => {
  // get auth state
  const loggedIn = d$auth().isLoggedIn
  // if target route requires auth & no logged in user
  // redirect to login
  if (to.meta.auth && !loggedIn) {
    next({ name: 'Login' })
  } else if (to.path === '/profile' && loggedIn) {
    next({ name: 'Authenticated', params: { id: d$auth().g$user.id } })
  } else {
    // else then proceeds
    next()
  }
})

export default router
```

#### 5.2 Route Guards

```javascript
// Navigation Guard
router.beforeEach((to, from, next) => {
  // get auth state
  const loggedIn = d$auth().isLoggedIn
  // if target route requires auth & no logged in user
  // redirect to login
  if (to.meta.auth && !loggedIn) {
    next({ name: 'Login' }) // Redirect to login
  } 
  // Auto redirect to profile if already logged in
  else if (to.path === '/profile' && loggedIn) {
    next({ 
      name: 'Authenticated', 
      params: { id: d$auth().g$user.id } 
    })
  } 
  // Allow access
  else {
    next()
  }
})
```

#### 5.3 Route Features

| Feature | Implementation | File Location |
|---------|----------------|---------------|
| Lazy Loading | `() => import('../views/AboutView.vue')` | `router/index.js` |
| Route Params | `/profile/detail/:id?` | Nested route children |
| Nested Routes | `/profile` with `children` | Profile route |
| Redirect | `redirect: { name: 'Login' }` | Profile route |
| Auth Guard | `to.meta.auth` check | `beforeEach` guard |
| Wildcard Route | `/:pathMatch(.*)*` | Catch-all route |
| Programmatic Nav | `:to="{ name: 'Authenticated' }"` | App.vue nav |

### Practice Exercise

1. Create `/dashboard` route (protected)
2. Add route query params
3. Implement 404 page
4. Add route animation
5. Create route breadcrumbs

---

## 6. API Integration

### File: `src/services/auth.js`, `src/services/todo.js`

### Topik Pembelajaran

#### 6.1 Axios Setup dengan plugins/axios

```javascript
// plugins/axios.js (real code)
import axios from 'axios'

export const baseApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})
```

#### 6.2 Todo Service - Real Code

```javascript
// services/todo.js (real code dari project)
import { baseApi } from '@/plugins/axios'

const api = '/api/todo'

const list = () => baseApi.get(`${api}`)
const add = (body) => baseApi.post(`${api}`, body)
const remove = (id) => baseApi.delete(`${api}/${id}`)
const edit = (id, body) => baseApi.put(`${api}/${id}`, body)

export { list, add, remove, edit }
```

#### 6.3 Auth Service - Real Code

```javascript
// services/auth.js (real code dari project)
import { baseApi } from '@/plugins/axios'

const api = '/auth'

const login = (body) => baseApi.post(`${api}/login`, body)
const register = (body) => baseApi.post(`${api}/register`, body)

export { login, register }
```

#### 6.4 Cookie Helper

```javascript
// plugins/helper.js (for JWT parsing)
export function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(base64.split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}
```

### Practice Exercise

1. Create API service untuk semua endpoints
2. Add request/response interceptors
3. Handle token refresh logic
4. Create error notification system
5. Add loading states

---

## 7. Components & Views

### File: `src/components/*`, `src/views/*`

### Topik Pembelajaran

#### 7.1 Component Structure - HelloWorld

```vue
<!-- components/HelloWorld.vue -->
<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <!-- curly brackets: {{ value }} -->
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You've successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
```

#### 7.2 View Structure - HomeView

```vue
<!-- views/HomeView.vue -->
<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
```

#### 7.3 View Structure - AboutView

```vue
<!-- views/AboutView.vue -->
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
```

#### 7.4 View Structure - NotFoundView

```vue
<!-- views/NotFoundView.vue -->
<template>
  <h1>404 Not Found</h1>
</template>
```

#### 7.5 Navigation Components - App.vue

```vue
<!-- App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { d$auth } from '@store/auth'

import HelloWorld from './components/HelloWorld.vue'
import { computed } from 'vue';

const auth = d$auth()

// set user from cookies
auth.setUser()

const username = computed(() => auth.g$user.id)
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="Yess!" />

      <nav>
        <!-- a href: navigation between sfc in views (based on router/index.js) -->
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <!-- programmatic navigation -->
        <RouterLink :to="{ name: 'Authenticated', params: { id: username ?? '' } }">
          Profile
        </RouterLink>
        <!-- v-bind: add attribute binding to custom value -->
        <!-- programmatic navigation -->
        <RouterLink :to="{ name: 'Todo' }">Todo</RouterLink>
        <!-- not found page -->
        <RouterLink to="/404">404</RouterLink>
      </nav>
    </div>
  </header>

  <!-- as container for router page in folder views -->
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
```

### Practice Exercise

1. Create reusable `TodoItem` component
2. Implement `TodoForm` component
3. Create `UserCard` component
4. Add modal component for editing
5. Implement drag-and-drop sortable list

---

## 8. Styling

### File: `src/assets/main.css`, component styles

### Topik Pembelajaran

#### 8.1 CSS Variables - Dark Mode Ready

```css
/* assets/main.css (style default bersifat global) */
:root {
  --color-primary: #42b883
  --color-secondary: #35495e
  --color-text: #333
  --color-border: #ddd
  --color-bg: #fff
  --color-success: #27ae60
  --color-danger: #e74c3c
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
}

/* Dark mode */
[data-theme='dark'] {
  --color-primary: #42b883
  --color-bg: #1e1e1e
  --color-text: #f0f0f0
  --color-border: #444
}
```

#### 8.2 Component Scoped Styles

```scss
/* scoped styles in TodoView.vue */
<style scoped lang="scss">
/* body = font-size: 16px (1rem) */
.form {
  margin-block-end: 2rem;
}
.list {
  /* rem, em, vh, vw */
  padding-block: 1rem;

  & > .strike {
    text-decoration: line-through;
  }
}

.checkbox {
  width: 100%;
}

button {
  .red {
    color: red;
  }
  .orange {
    color: orange;
  }
}
</style>
```

#### 8.3 Responsive Design

```css
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
```

### Practice Exercise

1. Add mobile menu
2. Implement dark mode toggle
3. Add animations/transitions
4. Create theme switcher
5. Add loading skeletons

---

## 9. Testing

### File: `vitest.config.js`, `src/**/*.test.js`

### Topik Pembelajaran

#### 9.1 Vitest Setup

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      inline: ['vue', 'vue-router', 'pinia']
    }
  }
})
```

#### 9.2 Run Tests

```bash
# Run all tests
pnpm test:unit

# Watch mode
pnpm test:unit -- --watch

# Coverage
pnpm test:unit -- --coverage
```

### Practice Exercise

1. Write tests for todo store
2. Test todo component
3. Mock API calls in tests
4. Add test coverage
5. CI/CD integration

---

## 10. Code Quality

### File: `.oxlintrc.json`, `.oxfmtrc.json`

### Topik Pembelajaran

#### 10.1 ESLint Configuration

```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import prettier from '@vue/eslint-config-prettier'

export default [
  js.configs.recommended,
  ...vue.configsflat.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-definition': 'off'
    }
  },
  prettier
]
```

#### 10.2 Code Formatting - oxfmt

```json
// .oxfmtrc.json
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

#### 10.3 OXLint Rules

```json
// .oxlintrc.json
{
  "rules": {
    "no-console": "error",
    "no-unused-vars": "warn",
    "prefer-arrow-callback": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```

#### 10.4 Run Commands

```bash
# Lint with auto-fix
pnpm lint

# Format code
pnpm format

# Both
pnpm lint && pnpm format
```

### Practice Exercise

1. Configure ESLint rules
2. Add custom lint rules
3. Setup pre-commit hook
4. CI/CD lint check
5. Code review checklist

---

## 📋 Checklist Pembelajaran

### Basic (Wajib)
- [ ] Setup project dengan Vite
- [ ] Buat store dengan Pinia
- [ ] Implementasi routing
- [ ] CRUD operations
- [ ] API integration

### Intermediate
- [ ] Authentication system
- [ ] Protected routes
- [ ] Error handling
- [ ] Loading states
- [ ] Form validation

### Advanced
- [ ] Unit tests
- [ ] Code coverage > 80%
- [ ] ESLint configuration
- [ ] Responsive design
- [ ] Dark mode toggle

---

## 📝 Resources

### Official Documentation
- [Vue.js Guide](https://vuejs.org/guide/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/guide/)
- [Axios](https://axios-http.com/)

### Third Party
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)

### Best Practices
- [Vue Best Practices](https://vuejs.org/guide/scaling-up/best-practices.html)
- [Vite Best Practices](https://vitejs.dev/guide/)

---

## 🔧 Troubleshooting

### Common Issues

**Issue:** Store tidak tersimpan
- **Solution:** Pastikan `createPinia()` terdaftar di `main.js`

**Issue:** Route 404
- **Solution:** Cek file di folder `views` atau gunakan lazy loading

**Issue:** API 401
- **Solution:** Pastikan token disimpan di cookie dengan benar

**Issue:** Component tidak render
- **Solution:** Cek import dan `defineProps`

---

## ✍️ Assignment

### Task 1: Enhanced Todo App

1. Add filtering (all/active/completed)
2. Add search by title
3. Add date sorting
4. Export/import as JSON
5. Dark mode toggle

### Task 2: User Dashboard

1. Profile page with user info
2. Edit profile form
3. Change password
4. Account settings

### Task 3: API Integration

1. Add user CRUD endpoints
2. Add todo filtering API
3. Add statistics endpoint
4. Handle pagination

---

## 🎓 Certification

Setelah menyelesaikan semua task dan mencapai code coverage > 80%, Anda siap untuk:

- [ ] Build Vue app dari nol
- [ ] Implementasi fitur baru
- [ ] Debug aplikasi Vue
- [ ] Write unit tests
- [ ] Code review

---

**Selamat belajar Vue.js! 🚀**

*Created for Vue TODO List Project*

---

*Last updated: $(date +%Y-%m-%d)*
