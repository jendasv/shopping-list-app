import { ref, watch, onUnmounted } from 'vue';
export function useFilterableList(options) {
    const items = ref([]);
    const isLoading = ref(false);
    const meta = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
    const search = ref('');
    const activeFilter = ref(options.defaultFilter ?? 'all');
    const activeSort = ref(options.defaultSort ?? 'az');
    let searchTimer = null;
    async function fetchItems(page) {
        if (page !== undefined)
            meta.value.current_page = page;
        isLoading.value = true;
        try {
            const params = {
                page: String(meta.value.current_page),
                sort: activeSort.value,
            };
            if (search.value)
                params.search = search.value;
            if (activeFilter.value !== 'all')
                params.filter = activeFilter.value;
            const response = await options.fetchFn(params);
            items.value = response.data;
            meta.value = response.meta;
        }
        catch (e) {
            console.error('Failed to fetch items:', e);
            items.value = [];
        }
        finally {
            isLoading.value = false;
        }
    }
    function prevPage() {
        if (meta.value.current_page > 1)
            fetchItems(meta.value.current_page - 1);
    }
    function nextPage() {
        if (meta.value.current_page < meta.value.last_page)
            fetchItems(meta.value.current_page + 1);
    }
    watch([activeFilter, activeSort], () => fetchItems(1));
    watch(search, () => {
        if (searchTimer)
            clearTimeout(searchTimer);
        searchTimer = setTimeout(() => fetchItems(1), 300);
    });
    onUnmounted(() => {
        if (searchTimer)
            clearTimeout(searchTimer);
    });
    return {
        items,
        isLoading,
        meta,
        search,
        activeFilter,
        activeSort,
        fetchItems,
        prevPage,
        nextPage,
    };
}
