<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'

/**
 * import component with aliase defined in vite.config.js
 */
import BaseInput from '@comp/BaseInput.vue'

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
