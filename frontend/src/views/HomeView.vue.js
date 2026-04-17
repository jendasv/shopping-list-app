import { RouterLink } from 'vue-router';
import { VueDraggable as VueDraggablePlus } from 'vue-draggable-plus';
import { useLists } from '@/composables/useLists';
import { reorderLists } from '@/services/listService';
import FilterBar from '@/components/ui/FilterBar.vue';
import Typewrite from '@/components/animations/Typewrite.vue';
import RowActions from '@/components/ui/RowActions.vue';
const { lists, isLoading, meta, editingListId, search, activeFilter, activeSort, isDragEnabled, prevPage, nextPage, startEditList, saveListName, removeList, } = useLists();
async function onReorderLists() {
    await reorderLists(lists.value.map((l) => l.id));
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
    ...{ class: "flex items-center justify-between mb-6" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
(__VLS_ctx.$t('lists.title'));
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: ({ name: 'new-list' }),
    ...{ class: "btn-primary" },
}));
const __VLS_2 = __VLS_1({
    to: ({ name: 'new-list' }),
    ...{ class: "btn-primary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
(__VLS_ctx.$t('lists.newList'));
// @ts-ignore
[$t, $t,];
var __VLS_3;
const __VLS_6 = FilterBar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    search: (__VLS_ctx.search),
    filter: (__VLS_ctx.activeFilter),
    sort: (__VLS_ctx.activeSort),
    filterOptions: ([
        { value: 'all', label: __VLS_ctx.$t('lists.filters.all') },
        { value: 'shared', label: __VLS_ctx.$t('lists.filters.shared') },
        { value: 'private', label: __VLS_ctx.$t('lists.filters.private') },
    ]),
    sortOptions: ([
        { value: 'custom', label: __VLS_ctx.$t('lists.sort.custom') },
        { value: 'az', label: __VLS_ctx.$t('lists.sort.az') },
        { value: 'za', label: __VLS_ctx.$t('lists.sort.za') },
        { value: 'items-desc', label: __VLS_ctx.$t('lists.sort.itemsDesc') },
        { value: 'items-asc', label: __VLS_ctx.$t('lists.sort.itemsAsc') },
        { value: 'newest', label: __VLS_ctx.$t('lists.sort.newest') },
        { value: 'oldest', label: __VLS_ctx.$t('lists.sort.oldest') },
    ]),
}));
const __VLS_8 = __VLS_7({
    search: (__VLS_ctx.search),
    filter: (__VLS_ctx.activeFilter),
    sort: (__VLS_ctx.activeSort),
    filterOptions: ([
        { value: 'all', label: __VLS_ctx.$t('lists.filters.all') },
        { value: 'shared', label: __VLS_ctx.$t('lists.filters.shared') },
        { value: 'private', label: __VLS_ctx.$t('lists.filters.private') },
    ]),
    sortOptions: ([
        { value: 'custom', label: __VLS_ctx.$t('lists.sort.custom') },
        { value: 'az', label: __VLS_ctx.$t('lists.sort.az') },
        { value: 'za', label: __VLS_ctx.$t('lists.sort.za') },
        { value: 'items-desc', label: __VLS_ctx.$t('lists.sort.itemsDesc') },
        { value: 'items-asc', label: __VLS_ctx.$t('lists.sort.itemsAsc') },
        { value: 'newest', label: __VLS_ctx.$t('lists.sort.newest') },
        { value: 'oldest', label: __VLS_ctx.$t('lists.sort.oldest') },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    name: "page",
    mode: "out-in",
}));
const __VLS_13 = __VLS_12({
    name: "page",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_16 } = __VLS_14.slots;
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        key: "loading",
        ...{ class: "text-sm text-gray-400 text-center mt-10" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
    (__VLS_ctx.$t('common.loading'));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: "content",
    });
    if (__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length) {
        let __VLS_17;
        /** @ts-ignore @type {typeof __VLS_components.VueDraggablePlus | typeof __VLS_components.VueDraggablePlus} */
        VueDraggablePlus;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
            ...{ 'onEnd': {} },
            modelValue: (__VLS_ctx.lists),
            tag: "ul",
            ...{ class: "space-y-3" },
            handle: ".drag-handle",
        }));
        const __VLS_19 = __VLS_18({
            ...{ 'onEnd': {} },
            modelValue: (__VLS_ctx.lists),
            tag: "ul",
            ...{ class: "space-y-3" },
            handle: ".drag-handle",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        let __VLS_22;
        const __VLS_23 = ({ end: {} },
            { onEnd: (__VLS_ctx.onReorderLists) });
        /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
        const { default: __VLS_24 } = __VLS_20.slots;
        for (const [list, i] of __VLS_vFor((__VLS_ctx.lists))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: (list.id),
                ...{ class: "list-stagger-item group flex items-center justify-between" },
                ...{ style: ({ '--i': i }) },
            });
            /** @type {__VLS_StyleScopedClasses['list-stagger-item']} */ ;
            /** @type {__VLS_StyleScopedClasses['group']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
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
            if (__VLS_ctx.editingListId !== list.id) {
                let __VLS_25;
                /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
                RouterLink;
                // @ts-ignore
                const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
                    to: ({ name: 'list-detail', params: { id: list.id } }),
                    ...{ class: "flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105" },
                }));
                const __VLS_27 = __VLS_26({
                    to: ({ name: 'list-detail', params: { id: list.id } }),
                    ...{ class: "flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_26));
                /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
                const { default: __VLS_30 } = __VLS_28.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "text-2xl" },
                });
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                if (list.isNew) {
                    const __VLS_31 = Typewrite;
                    // @ts-ignore
                    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
                        ...{ 'onDone': {} },
                        text: (list.name),
                    }));
                    const __VLS_33 = __VLS_32({
                        ...{ 'onDone': {} },
                        text: (list.name),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
                    let __VLS_36;
                    const __VLS_37 = ({ done: {} },
                        { onDone: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.editingListId !== list.id))
                                    return;
                                if (!(list.isNew))
                                    return;
                                list.isNew = false;
                                // @ts-ignore
                                [$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, search, activeFilter, activeSort, isLoading, isDragEnabled, lists, lists, lists, onReorderLists, editingListId,];
                            } });
                    var __VLS_34;
                    var __VLS_35;
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    (list.name);
                }
                if (list.itemsCount) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "text-gray-400 text-base tabular-nums" },
                    });
                    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                    /** @type {__VLS_StyleScopedClasses['tabular-nums']} */ ;
                    (list.completedCount);
                    (list.itemsCount);
                }
                if (list.visibility === 'shared') {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "text-gray-400 text-base" },
                    });
                    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                    (list.isOwner ? __VLS_ctx.$t('lists.owner') : __VLS_ctx.$t('lists.member'));
                }
                // @ts-ignore
                [$t, $t,];
                var __VLS_28;
                const __VLS_38 = RowActions || RowActions;
                // @ts-ignore
                const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({}));
                const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
                const { default: __VLS_43 } = __VLS_41.slots;
                {
                    const { menu: __VLS_44 } = __VLS_41.slots;
                    const [{ close }] = __VLS_vSlot(__VLS_44);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.editingListId !== list.id))
                                    return;
                                __VLS_ctx.startEditList(list);
                                close();
                                // @ts-ignore
                                [startEditList,];
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
                    (__VLS_ctx.$t('common.rename'));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.editingListId !== list.id))
                                    return;
                                __VLS_ctx.removeList(list.id);
                                close();
                                // @ts-ignore
                                [$t, removeList,];
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
                var __VLS_41;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
                    ...{ onSubmit: (...[$event]) => {
                            if (!!(__VLS_ctx.isLoading))
                                return;
                            if (!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                return;
                            if (!!(__VLS_ctx.editingListId !== list.id))
                                return;
                            __VLS_ctx.saveListName(list);
                            // @ts-ignore
                            [saveListName,];
                        } },
                    ...{ class: "flex items-center gap-2 w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
                    value: (list.name),
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
                            if (!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                return;
                            if (!!(__VLS_ctx.editingListId !== list.id))
                                return;
                            __VLS_ctx.editingListId = null;
                            // @ts-ignore
                            [$t, editingListId, vFocusEnd,];
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
        var __VLS_20;
        var __VLS_21;
    }
    else if (__VLS_ctx.lists.length) {
        let __VLS_45;
        /** @ts-ignore @type {typeof __VLS_components.TransitionGroup | typeof __VLS_components.TransitionGroup} */
        TransitionGroup;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            name: "list-stagger",
            appear: true,
            tag: "ul",
            ...{ class: "space-y-3" },
        }));
        const __VLS_47 = __VLS_46({
            name: "list-stagger",
            appear: true,
            tag: "ul",
            ...{ class: "space-y-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
        const { default: __VLS_50 } = __VLS_48.slots;
        for (const [list, i] of __VLS_vFor((__VLS_ctx.lists))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: (list.id),
                ...{ class: "group flex items-center justify-between" },
                ...{ style: ({ '--i': i }) },
            });
            /** @type {__VLS_StyleScopedClasses['group']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            if (__VLS_ctx.editingListId !== list.id) {
                let __VLS_51;
                /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
                RouterLink;
                // @ts-ignore
                const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
                    to: ({ name: 'list-detail', params: { id: list.id } }),
                    ...{ class: "flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105" },
                }));
                const __VLS_53 = __VLS_52({
                    to: ({ name: 'list-detail', params: { id: list.id } }),
                    ...{ class: "flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
                const { default: __VLS_56 } = __VLS_54.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "text-2xl" },
                });
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                (list.name);
                if (list.itemsCount) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "text-gray-400 text-base tabular-nums" },
                    });
                    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                    /** @type {__VLS_StyleScopedClasses['tabular-nums']} */ ;
                    (list.completedCount);
                    (list.itemsCount);
                }
                if (list.visibility === 'shared') {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "text-gray-400 text-base" },
                    });
                    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                    (list.isOwner ? __VLS_ctx.$t('lists.owner') : __VLS_ctx.$t('lists.member'));
                }
                // @ts-ignore
                [$t, $t, lists, lists, editingListId,];
                var __VLS_54;
                const __VLS_57 = RowActions || RowActions;
                // @ts-ignore
                const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({}));
                const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
                const { default: __VLS_62 } = __VLS_60.slots;
                {
                    const { menu: __VLS_63 } = __VLS_60.slots;
                    const [{ close }] = __VLS_vSlot(__VLS_63);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.editingListId !== list.id))
                                    return;
                                __VLS_ctx.startEditList(list);
                                close();
                                // @ts-ignore
                                [startEditList,];
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
                    (__VLS_ctx.$t('common.rename'));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isLoading))
                                    return;
                                if (!!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.lists.length))
                                    return;
                                if (!(__VLS_ctx.editingListId !== list.id))
                                    return;
                                __VLS_ctx.removeList(list.id);
                                close();
                                // @ts-ignore
                                [$t, removeList,];
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
                var __VLS_60;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
                    ...{ onSubmit: (...[$event]) => {
                            if (!!(__VLS_ctx.isLoading))
                                return;
                            if (!!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                return;
                            if (!(__VLS_ctx.lists.length))
                                return;
                            if (!!(__VLS_ctx.editingListId !== list.id))
                                return;
                            __VLS_ctx.saveListName(list);
                            // @ts-ignore
                            [saveListName,];
                        } },
                    ...{ class: "flex items-center gap-2 w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
                    value: (list.name),
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
                            if (!!(__VLS_ctx.isDragEnabled && __VLS_ctx.lists.length))
                                return;
                            if (!(__VLS_ctx.lists.length))
                                return;
                            if (!!(__VLS_ctx.editingListId !== list.id))
                                return;
                            __VLS_ctx.editingListId = null;
                            // @ts-ignore
                            [$t, editingListId, vFocusEnd,];
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
        var __VLS_48;
    }
    else if (__VLS_ctx.search || __VLS_ctx.activeFilter !== 'all') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-sm text-gray-400 text-center mt-10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
        (__VLS_ctx.$t('lists.noMatch'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-sm text-gray-400 text-center mt-10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
        (__VLS_ctx.$t('lists.empty'));
        let __VLS_64;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        RouterLink;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
            to: ({ name: 'new-list' }),
            ...{ class: "underline font-medium text-black" },
        }));
        const __VLS_66 = __VLS_65({
            to: ({ name: 'new-list' }),
            ...{ class: "underline font-medium text-black" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        /** @type {__VLS_StyleScopedClasses['underline']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-black']} */ ;
        const { default: __VLS_69 } = __VLS_67.slots;
        (__VLS_ctx.$t('lists.createFirst'));
        // @ts-ignore
        [$t, $t, $t, search, activeFilter,];
        var __VLS_67;
    }
    if (__VLS_ctx.meta.last_page > 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center justify-center gap-6 mt-8 text-sm text-gray-400" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.prevPage) },
            disabled: (__VLS_ctx.meta.current_page === 1),
            ...{ class: "disabled:opacity-30 hover:text-black transition cursor-pointer" },
        });
        /** @type {__VLS_StyleScopedClasses['disabled:opacity-30']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        (__VLS_ctx.$t('common.prev'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.meta.current_page);
        (__VLS_ctx.meta.last_page);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.nextPage) },
            disabled: (__VLS_ctx.meta.current_page === __VLS_ctx.meta.last_page),
            ...{ class: "disabled:opacity-30 hover:text-black transition cursor-pointer" },
        });
        /** @type {__VLS_StyleScopedClasses['disabled:opacity-30']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        (__VLS_ctx.$t('common.next'));
    }
}
// @ts-ignore
[$t, $t, meta, meta, meta, meta, meta, meta, prevPage, nextPage,];
var __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
