import { ref } from 'vue';
export function useContextMenu() {
    const menuOpenId = ref(null);
    function toggleMenu(id) {
        menuOpenId.value = menuOpenId.value === id ? null : id;
    }
    function closeMenu() {
        menuOpenId.value = null;
    }
    return { menuOpenId, toggleMenu, closeMenu };
}
