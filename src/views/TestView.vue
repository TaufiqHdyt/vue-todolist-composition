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
  description: ''
}

// ref input
// spread syntax
const input = ref({ ...defaultInput })

// function yg menerima submit form
function onSubmit() {
  // event.preventDefault();
  console.log({ ...input.value })

  // add list via store
  store.addList({ ...input.value })

  // reset form
  Object.assign(input, ref({ ...defaultInput }))
}

function detailList(index) {
  const detail = store.getDetail(index);
  console.log(detail);
}
</script>

<template>
  <div class="container">
    <h1>Test {{ $route.params?.id }}</h1>

    <!-- add v-model to integrate data binding with ref -->
    <!-- add event handler listener when keyup enter -->
    <!-- method handler with addList function -->
    <!-- event modifier .enter, .prevent -->
    <form class="form" @submit.prevent="onSubmit">
      <BaseInput v-model="input.name" name="name" placeholder="John" required />
      <BaseInput v-model="input.hobby" name="hobby" placeholder="Gaming" required />
      <BaseInput v-model="input.description" name="description" placeholder="Everyday" />
      <button type="submit">Submit</button>
    </form>

    <h4>Tasks</h4>
    <ol class="list">
      <!-- (item, index) -->
      <template v-for="(item, index) in store.getList" :key="index">
        <!-- null chaining (?.), nullish coalescing (??); ternary operator; not operator -->
        <li class="underline">
          <button class="red" @click="() => store.removeList(index)">&times;</button>
          <button class="orange" @click="() => detailList(index)">&#9998;</button>
          {{ item.name }} ({{ item.hobby }}) -
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

  & > .underline {
    text-decoration: underline;
  }
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
