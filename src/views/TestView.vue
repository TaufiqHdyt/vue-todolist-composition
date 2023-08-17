<script setup>
import { ref } from 'vue'
import { useListStore } from '@/stores/lists'

// components
import BaseInput from '@comp/BaseInput.vue'

// store container
const store = useListStore()

// initial input / default input
const defaultInput = {
  name: '',
  hobby: '',
  description: '',
  completed: false
}

// ref input
// spread syntax
const input = ref({ ...defaultInput })
const editing = ref(false)

// function reset form
const resetForm = () => {
  Object.assign(input.value, defaultInput)

  editing.value = false
}

// function yg menerima submit form
function onSubmit() {
  // event.preventDefault();
  const data = { ...input.value }

  if (editing.value === false) {
    // add list via store
    store.addList(data)
  } else {
    // edit list
    store.editList(editing.value, data)
  }

  // reset form
  resetForm()
}

function detailList(index) {
  const detail = store.getDetail(index)

  input.value = { ...detail.value }

  editing.value = index
}
function toggleComplete(index) {
  const detail = store.getDetail(index)

  store.editList(index, {
    ...detail.value,
    completed: !detail.value.completed
  })
}
</script>

<template>
  <div class="container">
    <h1>Test {{ $route.params?.id }}</h1>

    <!-- add v-model to integrate data binding with ref -->
    <!-- add event handler listener when keyup enter -->
    <!-- method handler with addList function -->
    <!-- event modifier .enter, .prevent -->
    <form class="form" @submit.prevent="onSubmit" @reset="resetForm">
      <BaseInput v-model="input.name" id="name" name="name" placeholder="John" required />
      <BaseInput v-model="input.hobby" id="hobby" name="hobby" placeholder="Gaming" required />
      <BaseInput v-model="input.description" id="description" name="description" placeholder="Everyday" />
      <div class="checkbox">
        <input type="checkbox" v-model="input.completed" name="completed" id="completed"> Completed
      </div>
      <button type="reset">Cancel</button>
      <button type="submit">{{ editing ? 'Save' : 'Submit' }}</button>
    </form>

    <h4>Tasks</h4>
    <ol class="list">
      <!-- (item, index) -->
      <template v-for="(item, index) in store.getList" :key="index">
        <!-- null chaining (?.), nullish coalescing (??); ternary operator; not operator -->
        <li :class="{ strike: item?.completed }" @dblclick="toggleComplete(index)">
          <button class="red" @click="() => store.removeList(index)" :disabled="editing !== false">&times;</button>
          <button class="orange" @click="() => detailList(index)" :disabled="editing !== false">&#9998;</button>
          {{ item?.name }} ({{ item?.hobby }}) -
          {{ !!item?.description ? item.description : 'description?' }}
        </li>
      </template>
    </ol>
  </div>
</template>

<!-- style default bersifat global -->
<!-- scoped untuk melimitasi hanya di komponen -->
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
