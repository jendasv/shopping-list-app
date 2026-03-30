<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import IconPlusCircle from '@/components/icons/IconPlusCircle.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnPencil from '@/components/icons/HandDrawnPencil.vue'
import { useListDetail } from '@/composables/useListDetail'

const route = useRoute()
const id = route.params.id as string
const showItemAddForm = ref<boolean>(false)

const { list, error, isLoading, editingItemId, removeItemFromList, setComplete, addItem, startEdit, saveItem } = useListDetail(id)
</script>
<template>

  <div class="arrow-back">
    <router-link title="Back" class="text-gray-900 text-2xl" :to="{name: 'home'}">
      <ArrowLeft customClass="w-10 h-10"/>
    </router-link>
  </div>

  <a
    v-if="!showItemAddForm"
    class="add-list-btn absolute top-5 right-5"
    title="New list's item"
    href="#"
    @click.prevent="showItemAddForm = !showItemAddForm"
  ><IconPlusCircle sizeClass="w-13 h-13"  /></a>

  <h1 v-if="list" class="text-4xl text-center text-gray-900 mb-10">
    {{list.name}}
  </h1>

  <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm" />

  <AlertMessage v-if="error" :message="error" type="error"/>

  <p v-else-if="isLoading" class="text-center text-gray-400 text-2xl mt-6">Loading...</p>

  <div v-else-if="list" class="list">
    <HandDrawnDivider variant="low-wave"/>
    <ul class="text-2xl space-y-6">
      <template v-if="list.items && list.items.length">
      <li
        v-for="item in list.items"
        :key="item.id"
        class="text-gray-900 flex justify-between items-center mb-3"
        :data-isComplete="item.isCompleted? 1:0"
      >
        <a
          v-if="editingItemId !== item.id"
          :class="[item.isCompleted ? 'line-through' : '', 'item hover:text-gray-600 transition duration-200 hover:scale-105']"
          href="#"
          @click.prevent="setComplete(list.id, item.id, item.isCompleted)"
        >
          <Typewrite v-if="item.isNew" :text="item.name + ' - ' + item.quantity + 'x'" @done="item.isNew = false"/>
          <span v-else>
            {{ item.name }} - {{ item.quantity }}x
          </span>
        </a>

        <form
          v-else
          @submit.prevent="saveItem(list.id, item)"
          class="flex items-center gap-2"
        >
          <input
            v-model="item.name"
            type="text"
            class="border-b p-1 text-xl focus:outline-none"
          />

          <input
            v-model.number="item.quantity"
            type="number"
            min="1"
            class="w-16 border-b p-1 text-xl focus:outline-none"
          />

          <button type="submit" class="text-green-600 cursor-pointer">✔</button>
        </form>
        <div class="controls flex items-center gap-2">
          <a href="#" @click.prevent="startEdit(item)" class="hover:scale-110 transition">
            <HandDrawnPencil sizeClass="w-9 h-9" />
          </a>
          <a
            href="#"
            @click.prevent="removeItemFromList(list.id, item.id)"
            class="text-red-500 text-3xl hover:scale-110 transition"
          >
            ×
          </a>
        </div>

      </li>
      </template>
      <li v-else>
        Your list is empty at this moment.
      </li>
    </ul>
  </div>
</template>

<style>
.line-through {
  text-decoration: line-through;
}
</style>
