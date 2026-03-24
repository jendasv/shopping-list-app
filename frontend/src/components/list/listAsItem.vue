<!--<script setup lang="ts">-->
<!--import {RouterLink} from "vue-router";-->

<!--defineProps({-->
<!--  list: {-->
<!--    type: Object,-->
<!--    required: true-->
<!--  }-->
<!--})-->

<!--defineEmits()-->

<!--function remove(id) {-->
<!--  fetch(`http://localhost:8080/api/lists/${id}`, {-->
<!--    method: 'DELETE',-->
<!--  }).then(() => {-->
<!--    lists.value = lists.value.filter(list => list.id !== id);-->
<!--  });-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <article class="flex justify-between items-center text-gray-900">-->
<!--        <span class="cursor-pointer hover:text-gray-600 transition duration-200 hover:scale-105">-->
<!--          <router-link title="List detail" :to="{ name: 'list-detail', params: { id: list.id } }">-->
<!--            {{ list.name }}-->
<!--          </router-link>-->
<!--        </span>-->

<!--    <a-->
<!--      class="text-red-500 text-xl hover:scale-110 transition"-->
<!--      @click.prevent="remove(list.id)"-->
<!--      href="#"-->
<!--    >-->
<!--      X-->
<!--    </a>-->
<!--  </article>-->
<!--</template>-->

<!--<style scoped>-->

<!--</style>-->
