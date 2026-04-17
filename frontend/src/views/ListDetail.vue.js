import { ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { VueDraggable as VueDraggablePlus } from 'vue-draggable-plus';
import { useListDetail } from '@/composables/useListDetail';
import { reorderItems } from '@/services/listService';
import { updateItem } from '@/services/itemService';
import { createProduct } from '@/services/productService';
import AddItemForm from '@/components/form/AddItemForm.vue';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue';
import ArrowLeft from '@/components/icons/ArrowLeft.vue';
import Typewrite from '@/components/animations/Typewrite.vue';
import HandDrawnStrikethrough from '@/components/animations/HandDrawnStrikethrough.vue';
import RowActions from '@/components/ui/RowActions.vue';
const { t } = useI18n();
function formatItem(item, listType) {
    if (listType === 'todo')
        return item.name;
    if (!item.quantity)
        return item.name;
    if (item.unit?.symbol)
        return `${item.name} ${item.quantity} ${item.unit.symbol}`;
    return item.quantity > 1 ? `${item.name} — ${item.quantity}×` : item.name;
}
const route = useRoute();
const id = route.params.id;
const showItemAddForm = ref(false);
const { list, error, isLoading, editingItemId, removeItemFromList, setComplete, addItem, startEdit, saveItem } = useListDetail(id);
const animatingItemId = ref(null);
const savingCatalogItemId = ref(null);
async function saveItemToCatalog(listId, item, close) {
    close();
    savingCatalogItemId.value = item.id;
    try {
        const product = await createProduct({
            name: item.name,
            preferred_unit_id: item.unit_id ?? null,
            category_id: null,
            preferred_quantity: null,
            notes: null,
        });
        // link item to newly created product
        await updateItem(listId, item.id, { product_id: product.id });
        item.product_id = product.id;
    }
    catch {
        if (list.value)
            error.value = t('items.errors.saveToCatalogFailed');
    }
    finally {
        savingCatalogItemId.value = null;
    }
}
async function handleSetComplete(listId, itemId, isCompleted) {
    animatingItemId.value = itemId;
    await new Promise((r) => setTimeout(r, 280));
    await setComplete(listId, itemId, isCompleted);
    await nextTick();
    await new Promise((r) => setTimeout(r, 16));
    animatingItemId.value = null;
}
async function onReorderItems() {
    if (!list.value)
        return;
    await reorderItems(list.value.id, list.value.items.map((i) => i.id));
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
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: ({ name: 'home' }),
    ...{ class: "text-gray-400 hover:text-black transition shrink-0" },
    title: (__VLS_ctx.$t('common.back')),
}));
const __VLS_2 = __VLS_1({
    to: ({ name: 'home' }),
    ...{ class: "text-gray-400 hover:text-black transition shrink-0" },
    title: (__VLS_ctx.$t('common.back')),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = ArrowLeft;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    customClass: "w-6 h-6",
}));
const __VLS_8 = __VLS_7({
    customClass: "w-6 h-6",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
// @ts-ignore
[$t,];
var __VLS_3;
if (__VLS_ctx.list) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-2xl font-bold flex-1 text-center truncate" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_ctx.list.name);
}
if (!__VLS_ctx.showItemAddForm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.showItemAddForm))
                    return;
                __VLS_ctx.showItemAddForm = true;
                // @ts-ignore
                [list, list, showItemAddForm, showItemAddForm,];
            } },
        ...{ class: "shrink-0 text-sm text-gray-500 hover:text-black underline transition" },
    });
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['underline']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    (__VLS_ctx.$t('items.addItem'));
}
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm text-gray-400 text-center mt-10" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
    (__VLS_ctx.$t('common.loading'));
}
else if (__VLS_ctx.list) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_11 = AddItemForm;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onAdd': {} },
        showAddForm: (__VLS_ctx.showItemAddForm),
        listType: (__VLS_ctx.list.listType),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onAdd': {} },
        showAddForm: (__VLS_ctx.showItemAddForm),
        listType: (__VLS_ctx.list.listType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = ({ add: {} },
        { onAdd: (__VLS_ctx.addItem) });
    var __VLS_14;
    var __VLS_15;
    if (__VLS_ctx.error) {
        const __VLS_18 = AlertMessage;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            message: (__VLS_ctx.error),
            type: "error",
        }));
        const __VLS_20 = __VLS_19({
            message: (__VLS_ctx.error),
            type: "error",
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    }
    const __VLS_23 = HandDrawnDivider;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ class: "my-4" },
    }));
    const __VLS_25 = __VLS_24({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    /** @type {__VLS_StyleScopedClasses['my-4']} */ ;
    if (__VLS_ctx.list.items && __VLS_ctx.list.items.length) {
        let __VLS_28;
        /** @ts-ignore @type {typeof __VLS_components.VueDraggablePlus | typeof __VLS_components.VueDraggablePlus} */
        VueDraggablePlus;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
            ...{ 'onEnd': {} },
            modelValue: (__VLS_ctx.list.items),
            tag: "ul",
            ...{ class: "space-y-3" },
            handle: ".drag-handle",
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onEnd': {} },
            modelValue: (__VLS_ctx.list.items),
            tag: "ul",
            ...{ class: "space-y-3" },
            handle: ".drag-handle",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_33;
        const __VLS_34 = ({ end: {} },
            { onEnd: (__VLS_ctx.onReorderItems) });
        /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
        const { default: __VLS_35 } = __VLS_31.slots;
        for (const [item, i] of __VLS_vFor((__VLS_ctx.list.items))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: (item.id),
                ...{ class: "list-stagger-item group flex items-center justify-between transition-[opacity,transform] duration-[280ms] ease-in-out" },
                ...{ class: (__VLS_ctx.animatingItemId === item.id ? 'opacity-0 scale-95' : '') },
                ...{ style: ({ '--i': i }) },
            });
            /** @type {__VLS_StyleScopedClasses['list-stagger-item']} */ ;
            /** @type {__VLS_StyleScopedClasses['group']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-[opacity,transform]']} */ ;
            /** @type {__VLS_StyleScopedClasses['duration-[280ms]']} */ ;
            /** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
            if (__VLS_ctx.editingItemId !== item.id) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "drag-handle cursor-grab active:cursor-grabbing text-gray-200 group-hover:text-gray-400 mr-2 shrink-0 text-2xl leading-none select-none transition-colors" },
                });
                /** @type {__VLS_StyleScopedClasses['drag-handle']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor-grab']} */ ;
                /** @type {__VLS_StyleScopedClasses['active:cursor-grabbing']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-gray-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['group-hover:text-gray-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['select-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.isLoading))
                                return;
                            if (!(__VLS_ctx.list))
                                return;
                            if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                return;
                            if (!(__VLS_ctx.editingItemId !== item.id))
                                return;
                            __VLS_ctx.handleSetComplete(__VLS_ctx.list.id, item.id, item.isCompleted);
                            // @ts-ignore
                            [$t, $t, list, list, list, list, list, list, list, showItemAddForm, isLoading, addItem, error, error, onReorderItems, animatingItemId, editingItemId, handleSetComplete,];
                        } },
                    ...{ class: "flex-1 text-left text-2xl transition hover:text-gray-600 hover:scale-105 duration-200" },
                    ...{ class: (item.isCompleted ? 'text-gray-400' : '') },
                });
                /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
                if (item.isNew) {
                    const __VLS_36 = Typewrite;
                    // @ts-ignore
                    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
                        ...{ 'onDone': {} },
                        text: (__VLS_ctx.formatItem(item, __VLS_ctx.list.listType)),
                    }));
                    const __VLS_38 = __VLS_37({
                        ...{ 'onDone': {} },
                        text: (__VLS_ctx.formatItem(item, __VLS_ctx.list.listType)),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                    let __VLS_41;
                    const __VLS_42 = ({ done: {} },
                        { onDone: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!(__VLS_ctx.list))
                                    return;
                                if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                    return;
                                if (!(__VLS_ctx.editingItemId !== item.id))
                                    return;
                                if (!(item.isNew))
                                    return;
                                item.isNew = false;
                                // @ts-ignore
                                [list, formatItem,];
                            } });
                    var __VLS_39;
                    var __VLS_40;
                }
                else if (item.isCompleted) {
                    const __VLS_43 = HandDrawnStrikethrough || HandDrawnStrikethrough;
                    // @ts-ignore
                    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
                        seed: (item.id),
                    }));
                    const __VLS_45 = __VLS_44({
                        seed: (item.id),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
                    const { default: __VLS_48 } = __VLS_46.slots;
                    (__VLS_ctx.formatItem(item, __VLS_ctx.list.listType));
                    // @ts-ignore
                    [list, formatItem,];
                    var __VLS_46;
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    (__VLS_ctx.formatItem(item, __VLS_ctx.list.listType));
                }
                const __VLS_49 = RowActions || RowActions;
                // @ts-ignore
                const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
                const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
                const { default: __VLS_54 } = __VLS_52.slots;
                {
                    const { menu: __VLS_55 } = __VLS_52.slots;
                    const [{ close }] = __VLS_vSlot(__VLS_55);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!(__VLS_ctx.list))
                                    return;
                                if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                    return;
                                if (!(__VLS_ctx.editingItemId !== item.id))
                                    return;
                                __VLS_ctx.startEdit(item);
                                close();
                                // @ts-ignore
                                [list, formatItem, startEdit,];
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
                    if (__VLS_ctx.list.listType !== 'todo' && !item.product_id) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                            ...{ onClick: (...[$event]) => {
                                    if (!!(__VLS_ctx.isLoading))
                                        return;
                                    if (!(__VLS_ctx.list))
                                        return;
                                    if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                        return;
                                    if (!(__VLS_ctx.editingItemId !== item.id))
                                        return;
                                    if (!(__VLS_ctx.list.listType !== 'todo' && !item.product_id))
                                        return;
                                    __VLS_ctx.saveItemToCatalog(__VLS_ctx.list.id, item, close);
                                    // @ts-ignore
                                    [$t, list, list, saveItemToCatalog,];
                                } },
                            ...{ class: "w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors border-t border-gray-100" },
                            disabled: (__VLS_ctx.savingCatalogItemId === item.id),
                        });
                        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                        /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
                        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
                        /** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
                        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
                        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
                        /** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
                        (__VLS_ctx.savingCatalogItemId === item.id ? __VLS_ctx.$t('common.saving') : __VLS_ctx.$t('items.saveToCatalog'));
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!(__VLS_ctx.list))
                                    return;
                                if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                    return;
                                if (!(__VLS_ctx.editingItemId !== item.id))
                                    return;
                                __VLS_ctx.removeItemFromList(__VLS_ctx.list.id, item.id);
                                close();
                                // @ts-ignore
                                [$t, $t, list, savingCatalogItemId, savingCatalogItemId, removeItemFromList,];
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
                var __VLS_52;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
                    ...{ onSubmit: (...[$event]) => {
                            if (!!(__VLS_ctx.isLoading))
                                return;
                            if (!(__VLS_ctx.list))
                                return;
                            if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                return;
                            if (!!(__VLS_ctx.editingItemId !== item.id))
                                return;
                            __VLS_ctx.saveItem(__VLS_ctx.list.id, item);
                            // @ts-ignore
                            [list, saveItem,];
                        } },
                    ...{ class: "flex items-center gap-2 w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
                    value: (item.name),
                    type: "text",
                    ...{ class: "flex-1 border-b-2 border-gray-300 focus:border-black text-base px-1 py-1 outline-none transition-colors" },
                });
                __VLS_asFunctionalDirective(__VLS_directives.vFocusEnd, {})(null, { ...__VLS_directiveBindingRestFields, }, null, null);
                /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:border-black']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
                    type: "number",
                    min: "1",
                    ...{ class: "w-14 border-b-2 border-gray-300 focus:border-black text-base px-1 py-1 outline-none transition-colors" },
                });
                (item.quantity);
                /** @type {__VLS_StyleScopedClasses['w-14']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:border-black']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                    type: "submit",
                    ...{ class: "text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer" },
                });
                /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
                (__VLS_ctx.$t('common.save'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.isLoading))
                                return;
                            if (!(__VLS_ctx.list))
                                return;
                            if (!(__VLS_ctx.list.items && __VLS_ctx.list.items.length))
                                return;
                            if (!!(__VLS_ctx.editingItemId !== item.id))
                                return;
                            __VLS_ctx.editingItemId = null;
                            // @ts-ignore
                            [$t, editingItemId, vFocusEnd,];
                        } },
                    type: "button",
                    ...{ class: "text-base text-gray-400 px-1 py-0.5 cursor-pointer" },
                });
                /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
                (__VLS_ctx.$t('common.cancel'));
            }
            // @ts-ignore
            [$t,];
        }
        // @ts-ignore
        [];
        var __VLS_31;
        var __VLS_32;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-sm text-gray-400 text-center mt-6" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
        (__VLS_ctx.$t('items.noItemsAdd'));
    }
}
// @ts-ignore
[$t,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
