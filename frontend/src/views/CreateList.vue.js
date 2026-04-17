import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { createList } from '@/services/listService';
import AddItemForm from '@/components/form/AddItemForm.vue';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import HandDrawnCheckbox from '@/components/elements/form/HandDrawnCheckbox.vue';
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue';
import ArrowLeft from '@/components/icons/ArrowLeft.vue';
import Typewrite from '@/components/animations/Typewrite.vue';
const LIST_TYPES = ['shopping', 'packing', 'todo'];
const { t } = useI18n();
const router = useRouter();
const listType = ref('shopping');
const listName = ref('');
const isShared = ref(false);
const items = ref([]);
const showItemAddForm = ref(false);
const error = ref('');
const success = ref('');
const listNamePlaceholder = computed(() => {
    const map = {
        shopping: t('newList.listNamePlaceholder'),
        packing: t('newList.listNamePlaceholderPacking'),
        todo: t('newList.listNamePlaceholderTodo'),
    };
    return map[listType.value];
});
function addItem(payload) {
    items.value.push({ id: Date.now(), name: payload.name, quantity: payload.quantity, unit_id: payload.unit_id, isNew: true });
}
function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id);
}
async function submitCreate() {
    if (!listName.value.trim()) {
        error.value = t('lists.errors.nameRequired');
        return;
    }
    try {
        await createList(listName.value.trim(), isShared.value ? 'shared' : 'private', listType.value !== 'todo' ? items.value : [], listType.value);
        router.push({ name: 'home' });
    }
    catch (e) {
        console.error(e);
        error.value = t('lists.errors.createFailed');
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
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: ({ name: 'home' }),
    ...{ class: "text-gray-400 hover:text-black transition" },
    title: (__VLS_ctx.$t('common.back')),
}));
const __VLS_2 = __VLS_1({
    to: ({ name: 'home' }),
    ...{ class: "text-gray-400 hover:text-black transition" },
    title: (__VLS_ctx.$t('common.back')),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold flex-1 text-center" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
(__VLS_ctx.$t('newList.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-6" },
});
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "block text-base text-gray-500 mb-2" },
});
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
(__VLS_ctx.$t('newList.listType'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
for (const [type] of __VLS_vFor((__VLS_ctx.LIST_TYPES))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.listType = type;
                // @ts-ignore
                [$t, $t, LIST_TYPES, listType,];
            } },
        key: (type),
        type: "button",
        ...{ class: (__VLS_ctx.listType === type
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-gray-50') },
        ...{ class: "flex-1 py-2 px-3 border-2 rounded-lg text-base font-medium transition cursor-pointer" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    (__VLS_ctx.$t(`newList.types.${type}`));
    // @ts-ignore
    [$t, listType,];
}
const __VLS_11 = HandDrawnDivider;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ class: "mb-5" },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "mb-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-6 flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('newList.listName'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.error = '';
            // @ts-ignore
            [$t, error,];
        } },
    value: (__VLS_ctx.listName),
    type: "text",
    placeholder: (__VLS_ctx.listNamePlaceholder),
    ...{ class: "flex-1 p-2 focus:outline-none text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
const __VLS_16 = HandDrawnDivider;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ class: "mb-5" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "mb-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
if (__VLS_ctx.listType !== 'todo') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between mb-3" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-xl font-semibold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    (__VLS_ctx.$t('newList.items'));
    if (!__VLS_ctx.showItemAddForm) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.listType !== 'todo'))
                        return;
                    if (!(!__VLS_ctx.showItemAddForm))
                        return;
                    __VLS_ctx.showItemAddForm = true;
                    // @ts-ignore
                    [$t, listType, listName, listNamePlaceholder, showItemAddForm, showItemAddForm,];
                } },
            ...{ class: "text-sm text-gray-500 hover:text-black underline transition" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['underline']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition']} */ ;
        (__VLS_ctx.$t('items.addItem'));
    }
    const __VLS_21 = AddItemForm;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ 'onAdd': {} },
        showAddForm: (__VLS_ctx.showItemAddForm),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onAdd': {} },
        showAddForm: (__VLS_ctx.showItemAddForm),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_26;
    const __VLS_27 = ({ add: {} },
        { onAdd: (__VLS_ctx.addItem) });
    var __VLS_24;
    var __VLS_25;
    if (__VLS_ctx.items.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
            ...{ class: "space-y-6 mt-3" },
        });
        /** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
        for (const [item] of __VLS_vFor((__VLS_ctx.items))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: (item.id),
                ...{ class: "flex items-center justify-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-2xl" },
            });
            /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
            if (item.isNew) {
                const __VLS_28 = Typewrite;
                // @ts-ignore
                const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
                    ...{ 'onDone': {} },
                    text: (item.quantity ? item.name + ' — ' + item.quantity + '×' : item.name),
                }));
                const __VLS_30 = __VLS_29({
                    ...{ 'onDone': {} },
                    text: (item.quantity ? item.name + ' — ' + item.quantity + '×' : item.name),
                }, ...__VLS_functionalComponentArgsRest(__VLS_29));
                let __VLS_33;
                const __VLS_34 = ({ done: {} },
                    { onDone: (...[$event]) => {
                            if (!(__VLS_ctx.listType !== 'todo'))
                                return;
                            if (!(__VLS_ctx.items.length))
                                return;
                            if (!(item.isNew))
                                return;
                            item.isNew = false;
                            // @ts-ignore
                            [$t, showItemAddForm, addItem, items, items,];
                        } });
                var __VLS_31;
                var __VLS_32;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (item.name);
                (item.quantity ? ' — ' + item.quantity + '×' : '');
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.listType !== 'todo'))
                            return;
                        if (!(__VLS_ctx.items.length))
                            return;
                        __VLS_ctx.removeItem(item.id);
                        // @ts-ignore
                        [removeItem,];
                    } },
                ...{ class: "text-red-400 hover:text-red-600 text-3xl leading-none ml-3" },
            });
            /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:text-red-600']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
            // @ts-ignore
            [];
        }
    }
    else if (!__VLS_ctx.showItemAddForm) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-base text-gray-400 mt-2" },
        });
        /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
        (__VLS_ctx.$t('items.noItems'));
    }
}
if (__VLS_ctx.listType !== 'todo') {
    const __VLS_35 = HandDrawnDivider;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        ...{ class: "mb-5" },
    }));
    const __VLS_37 = __VLS_36({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    /** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-6" },
});
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
const __VLS_40 = HandDrawnCheckbox || HandDrawnCheckbox;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.isShared),
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.isShared),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
(__VLS_ctx.$t('newList.shareWithHousehold'));
// @ts-ignore
[$t, $t, listType, showItemAddForm, isShared,];
var __VLS_43;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-base text-gray-400 mt-1" },
});
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
(__VLS_ctx.$t('newList.sharedInfo'));
if (__VLS_ctx.error) {
    const __VLS_46 = AlertMessage;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        type: "error",
        message: (__VLS_ctx.error),
    }));
    const __VLS_48 = __VLS_47({
        type: "error",
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
}
if (__VLS_ctx.success) {
    const __VLS_51 = AlertMessage;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        type: "success",
        message: (__VLS_ctx.success),
    }));
    const __VLS_53 = __VLS_52({
        type: "success",
        message: (__VLS_ctx.success),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex justify-end mt-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.submitCreate) },
    disabled: (!__VLS_ctx.listName.trim()),
    ...{ class: "btn-primary" },
});
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
(__VLS_ctx.$t('newList.createBtn'));
// @ts-ignore
[$t, $t, error, error, listName, success, success, submitCreate,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
