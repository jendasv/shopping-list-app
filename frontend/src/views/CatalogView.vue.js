import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { onClickOutside } from '@vueuse/core';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { fetchCategories } from '@/services/categoryService';
import { fetchUnits } from '@/services/unitService';
import { useConfirm } from '@/composables/useConfirm';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import RowActions from '@/components/ui/RowActions.vue';
const { t } = useI18n();
const { confirm } = useConfirm();
// --- Info tooltip ---
const showInfo = ref(false);
const infoRef = ref(null);
onClickOutside(infoRef, () => { showInfo.value = false; });
// --- Data ---
const products = ref([]);
const loading = ref(false);
const pageError = ref('');
const meta = ref({ current_page: 1, last_page: 1, total: 0 });
const categories = ref({ global: [], custom: [] });
const unitGroups = ref({});
// --- Filters ---
const searchQ = ref('');
const filterCategory = ref(null);
let searchTimer = null;
// --- Form state ---
const showForm = ref(false);
const editingProduct = ref(null);
const saving = ref(false);
const formError = ref('');
const form = ref({
    name: '',
    category_id: null,
    preferred_unit_id: null,
    preferred_quantity: null,
    notes: '',
});
onMounted(async () => {
    await Promise.all([loadPage(1), loadCategories(), loadUnits()]);
});
async function loadPage(page) {
    loading.value = true;
    pageError.value = '';
    try {
        const res = await fetchProducts({ page, category_id: filterCategory.value, q: searchQ.value || undefined });
        products.value = res.data;
        meta.value = res.meta;
    }
    catch {
        pageError.value = t('catalog.errors.loadFailed');
    }
    finally {
        loading.value = false;
    }
}
async function loadCategories() {
    try {
        const res = await fetchCategories();
        categories.value = res;
    }
    catch { /* non-critical */ }
}
async function loadUnits() {
    try {
        unitGroups.value = await fetchUnits();
    }
    catch { /* non-critical */ }
}
function onSearch() {
    if (searchTimer)
        clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadPage(1), 350);
}
// --- Form ---
function openAddForm() {
    editingProduct.value = null;
    form.value = { name: '', category_id: null, preferred_unit_id: null, preferred_quantity: null, notes: '' };
    formError.value = '';
    showForm.value = true;
}
function openEditForm(product) {
    editingProduct.value = product;
    form.value = {
        name: product.name,
        category_id: product.category_id,
        preferred_unit_id: product.preferred_unit_id,
        preferred_quantity: product.preferred_quantity,
        notes: product.notes ?? '',
    };
    formError.value = '';
    showForm.value = true;
}
function closeForm() {
    showForm.value = false;
    editingProduct.value = null;
}
async function saveProduct() {
    if (!form.value.name.trim()) {
        formError.value = t('catalog.errors.nameRequired');
        return;
    }
    saving.value = true;
    formError.value = '';
    const payload = {
        name: form.value.name.trim(),
        category_id: form.value.category_id,
        preferred_unit_id: form.value.preferred_unit_id,
        preferred_quantity: form.value.preferred_quantity,
        notes: form.value.notes || null,
    };
    try {
        if (editingProduct.value) {
            const updated = await updateProduct(editingProduct.value.id, payload);
            const idx = products.value.findIndex((p) => p.id === updated.id);
            if (idx >= 0)
                products.value[idx] = updated;
        }
        else {
            const created = await createProduct(payload);
            products.value.unshift(created);
            meta.value.total++;
        }
        closeForm();
    }
    catch (e) {
        const err = e;
        if (err?.status === 402) {
            formError.value = t('catalog.errors.freeTierLimit');
        }
        else {
            formError.value = t('catalog.errors.saveFailed');
        }
    }
    finally {
        saving.value = false;
    }
}
async function remove(product) {
    const ok = await confirm(t('catalog.deleteConfirm', { name: product.name }));
    if (!ok)
        return;
    try {
        await deleteProduct(product.id);
        products.value = products.value.filter((p) => p.id !== product.id);
        meta.value.total--;
    }
    catch {
        pageError.value = t('catalog.errors.deleteFailed');
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "py-4" },
});
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-3 mb-6" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold flex-1" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
(__VLS_ctx.$t('catalog.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative" },
    ref: "infoRef",
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showInfo = !__VLS_ctx.showInfo;
            // @ts-ignore
            [$t, showInfo, showInfo,];
        } },
    type: "button",
    ...{ class: "w-6 h-6 rounded-full border-2 border-gray-300 text-gray-400 hover:border-black hover:text-black text-sm font-bold transition flex items-center justify-center" },
    title: (__VLS_ctx.$t('catalog.infoTitle')),
});
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-black']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
if (__VLS_ctx.showInfo) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute right-0 top-8 w-64 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3 text-sm text-gray-700 z-50" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-64']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
    (__VLS_ctx.$t('catalog.infoText'));
}
if (!__VLS_ctx.showForm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.openAddForm) },
        ...{ class: "shrink-0 text-sm text-gray-500 hover:text-black underline transition" },
    });
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['underline']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    (__VLS_ctx.$t('catalog.addProduct'));
}
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "unroll",
}));
const __VLS_2 = __VLS_1({
    name: "unroll",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.showForm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-2 border-black rounded-lg p-4 mb-6 relative" },
    });
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.closeForm) },
        type: "button",
        ...{ class: "absolute top-3 right-3 text-gray-400 hover:text-black transition text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-xl font-semibold mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (__VLS_ctx.editingProduct ? __VLS_ctx.$t('catalog.editProduct') : __VLS_ctx.$t('catalog.newProduct'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col text-xl mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.$t('catalog.fields.name'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        value: (__VLS_ctx.form.name),
        type: "text",
        ...{ class: "px-2 pt-2 focus:outline-none focus:border-gray-600 text-gray-900 w-full" },
        placeholder: (__VLS_ctx.$t('catalog.fields.namePlaceholder')),
    });
    /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-gray-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex gap-6 flex-wrap mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.$t('catalog.fields.category'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
        value: (__VLS_ctx.form.category_id),
        ...{ class: "p-2 bg-transparent focus:outline-none" },
    });
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: (null),
    });
    (__VLS_ctx.$t('catalog.fields.noCategory'));
    if (__VLS_ctx.categories.global.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
            label: (__VLS_ctx.$t('catalog.globalCategories')),
        });
        for (const [c] of __VLS_vFor((__VLS_ctx.categories.global))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                key: (c.id),
                value: (c.id),
            });
            (c.name);
            // @ts-ignore
            [$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, showInfo, showForm, showForm, openAddForm, closeForm, editingProduct, form, form, categories, categories,];
        }
    }
    if (__VLS_ctx.categories.custom.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
            label: (__VLS_ctx.$t('catalog.customCategories')),
        });
        for (const [c] of __VLS_vFor((__VLS_ctx.categories.custom))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                key: (c.id),
                value: (c.id),
            });
            (c.name);
            // @ts-ignore
            [$t, categories, categories,];
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.$t('items.unit'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
        value: (__VLS_ctx.form.preferred_unit_id),
        ...{ class: "p-2 bg-transparent focus:outline-none" },
    });
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: (null),
    });
    for (const [units, groupType] of __VLS_vFor((__VLS_ctx.unitGroups))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
            label: (__VLS_ctx.$t('units.types.' + groupType)),
            key: (groupType),
        });
        for (const [unit] of __VLS_vFor((units))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                key: (unit.id),
                value: (unit.id),
            });
            (unit.name);
            // @ts-ignore
            [$t, $t, form, unitGroups,];
        }
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.$t('catalog.fields.preferredQty'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "number",
        min: "0.01",
        step: "0.01",
        placeholder: "—",
        ...{ class: "w-20 p-2 focus:outline-none" },
    });
    (__VLS_ctx.form.preferred_quantity);
    /** @type {__VLS_StyleScopedClasses['w-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col text-xl mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.$t('catalog.fields.notes'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        value: (__VLS_ctx.form.notes),
        type: "text",
        ...{ class: "px-2 pt-2 focus:outline-none w-full" },
        placeholder: (__VLS_ctx.$t('catalog.fields.notesPlaceholder')),
    });
    /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.formError) {
        const __VLS_6 = AlertMessage;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            message: (__VLS_ctx.formError),
            type: "error",
        }));
        const __VLS_8 = __VLS_7({
            message: (__VLS_ctx.formError),
            type: "error",
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex justify-end gap-4 mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.closeForm) },
        type: "button",
        ...{ class: "text-gray-500 hover:text-black transition" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    (__VLS_ctx.$t('common.cancel'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.saveProduct) },
        type: "button",
        ...{ class: "text-gray-900 hover:text-gray-600 text-xl font-medium cursor-pointer transition" },
        disabled: (__VLS_ctx.saving),
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    (__VLS_ctx.saving ? __VLS_ctx.$t('common.saving') : __VLS_ctx.$t('common.save'));
}
// @ts-ignore
[$t, $t, $t, $t, $t, $t, closeForm, form, form, formError, formError, saveProduct, saving, saving,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-wrap gap-3 mb-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (__VLS_ctx.onSearch) },
    type: "search",
    placeholder: (__VLS_ctx.$t('search.placeholder')),
    ...{ class: "flex-1 min-w-0 border-b-2 border-gray-300 focus:border-black focus:outline-none py-1 text-base" },
});
(__VLS_ctx.searchQ);
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-black']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.loadPage(1);
            // @ts-ignore
            [$t, onSearch, searchQ, loadPage,];
        } },
    value: (__VLS_ctx.filterCategory),
    ...{ class: "bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none py-1 text-base" },
});
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-black']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: (null),
});
(__VLS_ctx.$t('catalog.allCategories'));
if (__VLS_ctx.categories.global.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
        label: (__VLS_ctx.$t('catalog.globalCategories')),
    });
    for (const [c] of __VLS_vFor((__VLS_ctx.categories.global))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (c.id),
            value: (c.id),
        });
        (c.name);
        // @ts-ignore
        [$t, $t, categories, categories, filterCategory,];
    }
}
if (__VLS_ctx.categories.custom.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
        label: (__VLS_ctx.$t('catalog.customCategories')),
    });
    for (const [c] of __VLS_vFor((__VLS_ctx.categories.custom))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (c.id),
            value: (c.id),
        });
        (c.name);
        // @ts-ignore
        [$t, categories, categories,];
    }
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm text-gray-400 text-center mt-10" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
    (__VLS_ctx.$t('common.loading'));
}
else if (__VLS_ctx.products.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center mt-10 text-gray-400" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('catalog.empty'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.openAddForm) },
        ...{ class: "mt-2 underline text-gray-500 hover:text-black transition" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['underline']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    (__VLS_ctx.$t('catalog.addFirst'));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "space-y-2" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
    for (const [product] of __VLS_vFor((__VLS_ctx.products))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (product.id),
            ...{ class: "group flex items-center justify-between py-2 border-b border-gray-100" },
        });
        /** @type {__VLS_StyleScopedClasses['group']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-1 min-w-0" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-xl" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        (product.name);
        if (product.category) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-2 text-sm text-gray-400" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            (product.category.name);
        }
        if (product.preferred_quantity || product.unit) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-2 text-sm text-gray-400" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            (product.preferred_quantity ? product.preferred_quantity + ' ' : '');
            (product.unit?.symbol ?? '');
        }
        if (product.notes) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "text-sm text-gray-400 truncate" },
            });
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
            (product.notes);
        }
        const __VLS_11 = RowActions || RowActions;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({}));
        const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
        const { default: __VLS_16 } = __VLS_14.slots;
        {
            const { menu: __VLS_17 } = __VLS_14.slots;
            const [{ close }] = __VLS_vSlot(__VLS_17);
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.products.length === 0))
                            return;
                        __VLS_ctx.openEditForm(product);
                        close();
                        // @ts-ignore
                        [$t, $t, $t, openAddForm, loading, products, products, openEditForm,];
                    } },
                ...{ class: "w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors" },
            });
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            (__VLS_ctx.$t('common.edit'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.products.length === 0))
                            return;
                        __VLS_ctx.remove(product);
                        close();
                        // @ts-ignore
                        [$t, remove,];
                    } },
                ...{ class: "w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100" },
            });
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-red-50']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
            (__VLS_ctx.$t('common.delete'));
            // @ts-ignore
            [$t,];
        }
        // @ts-ignore
        [];
        var __VLS_14;
        // @ts-ignore
        [];
    }
}
if (__VLS_ctx.meta.last_page > 1) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-center gap-4 mt-6 text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.meta.last_page > 1))
                    return;
                __VLS_ctx.loadPage(__VLS_ctx.meta.current_page - 1);
                // @ts-ignore
                [loadPage, meta, meta,];
            } },
        disabled: (__VLS_ctx.meta.current_page <= 1),
        ...{ class: "disabled:opacity-30 hover:underline" },
    });
    /** @type {__VLS_StyleScopedClasses['disabled:opacity-30']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
    (__VLS_ctx.$t('common.prev'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.meta.current_page);
    (__VLS_ctx.meta.last_page);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.meta.last_page > 1))
                    return;
                __VLS_ctx.loadPage(__VLS_ctx.meta.current_page + 1);
                // @ts-ignore
                [$t, loadPage, meta, meta, meta, meta,];
            } },
        disabled: (__VLS_ctx.meta.current_page >= __VLS_ctx.meta.last_page),
        ...{ class: "disabled:opacity-30 hover:underline" },
    });
    /** @type {__VLS_StyleScopedClasses['disabled:opacity-30']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
    (__VLS_ctx.$t('common.next'));
}
if (__VLS_ctx.pageError) {
    const __VLS_18 = AlertMessage;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        message: (__VLS_ctx.pageError),
        type: "error",
        ...{ class: "mt-4" },
    }));
    const __VLS_20 = __VLS_19({
        message: (__VLS_ctx.pageError),
        type: "error",
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
}
// @ts-ignore
[$t, meta, meta, pageError, pageError,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
