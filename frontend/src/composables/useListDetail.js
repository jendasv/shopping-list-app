import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { fetchList } from '@/services/listService';
import { createItem, updateItem, deleteItem } from '@/services/itemService';
import { useAuthStore } from '@/stores/auth';
import echo from '@/plugins/echo';
export function useListDetail(id) {
    const { t } = useI18n();
    const route = useRoute();
    const authStore = useAuthStore();
    const list = ref(null);
    const error = ref('');
    const isLoading = ref(false);
    const editingItemId = ref(null);
    function sortItems(items) {
        return [
            ...items.filter((i) => !i.isCompleted),
            ...items.filter((i) => i.isCompleted),
        ];
    }
    onMounted(async () => {
        if (route.meta.list) {
            list.value = route.meta.list;
        }
        else {
            isLoading.value = true;
            try {
                list.value = await fetchList(id);
            }
            catch (e) {
                console.error('Failed to load list:', e);
            }
            finally {
                isLoading.value = false;
            }
        }
        const householdId = authStore.user?.householdId;
        if (!householdId)
            return;
        echo
            .private(`household.${householdId}`)
            .listen('.ItemAdded', (data) => {
            if (!list.value || data.listId !== list.value.id)
                return;
            if (list.value.items.some((i) => i.id === data.id))
                return;
            list.value.items.push(data);
        })
            .listen('.ItemUpdated', (data) => {
            if (!list.value || data.listId !== list.value.id)
                return;
            list.value.items = sortItems(list.value.items.map((i) => (i.id === data.id ? { ...i, ...data } : i)));
        })
            .listen('.ItemDeleted', (data) => {
            if (!list.value || data.listId !== list.value.id)
                return;
            list.value.items = list.value.items.filter((i) => i.id !== data.id);
        })
            .listen('.ItemsReordered', (data) => {
            if (!list.value || data.listId !== list.value.id)
                return;
            const indexMap = new Map(data.order.map((id, pos) => [id, pos]));
            list.value.items = [...list.value.items].sort((a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0));
        });
    });
    onUnmounted(() => {
        const householdId = authStore.user?.householdId;
        if (householdId)
            echo.leave(`household.${householdId}`);
    });
    async function removeItemFromList(listId, itemId) {
        if (!list.value)
            return;
        try {
            await deleteItem(listId, itemId);
            list.value.items = list.value.items.filter((item) => item.id !== itemId);
        }
        catch (e) {
            console.error('Failed to remove item:', e);
            error.value = t('items.errors.removeFailed');
        }
    }
    async function setComplete(listId, itemId, isCompleted) {
        if (!list.value)
            return;
        const newCompleted = !isCompleted;
        list.value.items = sortItems(list.value.items.map((item) => item.id === itemId ? { ...item, isCompleted: newCompleted } : item));
        try {
            await updateItem(listId, itemId, { isCompleted: newCompleted });
        }
        catch (e) {
            list.value.items = sortItems(list.value.items.map((item) => item.id === itemId ? { ...item, isCompleted } : item));
            console.error('Failed to update item:', e);
            error.value = t('items.errors.updateFailed');
        }
    }
    async function addItem(payload) {
        try {
            const data = await createItem(id, payload);
            const lastItem = data.items[data.items.length - 1];
            if (!lastItem || !list.value)
                return;
            lastItem.isNew = true;
            list.value.items.push(lastItem);
        }
        catch (e) {
            console.error('Failed to add item:', e);
            error.value = t('items.errors.addFailed');
        }
    }
    function startEdit(item) {
        editingItemId.value = item.id;
    }
    async function saveItem(listId, item) {
        if (!item.name.trim()) {
            error.value = t('items.errors.nameRequired');
            return;
        }
        try {
            await updateItem(listId, item.id, {
                name: item.name,
                quantity: item.quantity ?? null,
                unit_id: item.unit_id ?? null,
                notes: item.notes ?? null,
                isCompleted: item.isCompleted,
            });
            item.isNew = true;
            editingItemId.value = null;
        }
        catch (e) {
            console.error('Failed to update item:', e);
            error.value = t('items.errors.updateFailed');
            editingItemId.value = null;
        }
    }
    return { list, error, isLoading, editingItemId, removeItemFromList, setComplete, addItem, startEdit, saveItem };
}
