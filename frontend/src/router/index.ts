import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListDetail from '../views/ListDetail.vue'
import CreateShoppingList from '@/views/CreateShoppingList.vue'
import { fetchList } from '@/services/shoppingListService'
import type { iShoppingList } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    list?: iShoppingList
  }
}

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
          to.meta.list = await fetchList(to.params.id as string)
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
