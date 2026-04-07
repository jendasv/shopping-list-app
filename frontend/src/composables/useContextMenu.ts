import { ref } from 'vue'

export function useContextMenu() {
  const menuOpenId = ref<number | null>(null)

  function toggleMenu(id: number) {
    menuOpenId.value = menuOpenId.value === id ? null : id
  }

  function closeMenu() {
    menuOpenId.value = null
  }

  return { menuOpenId, toggleMenu, closeMenu }
}
