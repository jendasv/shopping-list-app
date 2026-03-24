import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListDetail from '../views/ListDetail.vue'
import CreateShoppingList from "@/views/CreateShoppingList.vue";
import {apiFetch} from "@/serivices/api.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/list/:id',
      name: 'list-detail',
      component: ListDetail,
      beforeEnter: async (to) => {
        try {
          const id = to.params.id

          await apiFetch(`/lists/${id}/items`, { method: 'GET' })

          return true
        } catch (e) {
          return { name: 'home' }
        }
      }
    },
    {
      path: '/lists/new',
      name: 'new-list',
      component: CreateShoppingList,
    }
  ],
})

export default router
