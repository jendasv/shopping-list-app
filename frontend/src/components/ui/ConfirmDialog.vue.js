import { watch, nextTick, ref } from 'vue';
import { useConfirm } from '@/composables/useConfirm';
const { state, accept, cancel } = useConfirm();
const overlayRef = ref(null);
const confirmBtnRef = ref(null);
// Focus confirm button when dialog opens
watch(() => state.isOpen, async (open) => {
    if (open) {
        await nextTick();
        confirmBtnRef.value?.focus();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['confirm-enter-active']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-leave-active']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-enter-from']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-leave-to']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Teleport | typeof __VLS_components.Teleport} */
Teleport;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    name: "confirm",
}));
const __VLS_8 = __VLS_7({
    name: "confirm",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
if (__VLS_ctx.state.isOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onKeydown: (__VLS_ctx.cancel) },
        ...{ onKeydown: (__VLS_ctx.accept) },
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center p-4" },
        tabindex: "-1",
        ref: "overlayRef",
    });
    /** @type {__VLS_StyleScopedClasses['fixed']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.cancel) },
        ...{ class: "absolute inset-0 bg-black/40" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative bg-white border-2 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm p-6 space-y-4" },
        role: "alertdialog",
        'aria-modal': "true",
        'aria-labelledby': (__VLS_ctx.state.title ? 'confirm-title' : undefined),
        'aria-describedby': ('confirm-message'),
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
    if (__VLS_ctx.state.title) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            id: "confirm-title",
            ...{ class: "text-xl font-bold" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        (__VLS_ctx.state.title);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        id: "confirm-message",
        ...{ class: "text-xl" },
        ...{ class: ({ 'font-medium': !__VLS_ctx.state.title }) },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    (__VLS_ctx.state.message);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex gap-3 justify-end pt-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.cancel) },
        ...{ class: "px-4 py-2 text-base border-2 border-black rounded-lg hover:bg-gray-100 transition cursor-pointer" },
    });
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    (__VLS_ctx.$t('common.cancel'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.accept) },
        ref: "confirmBtnRef",
        ...{ class: "btn-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.$t('common.confirm'));
}
// @ts-ignore
[state, state, state, state, state, state, cancel, cancel, cancel, accept, accept, $t, $t,];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
