import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
const isOpen = ref(false);
const containerRef = ref(null);
onClickOutside(containerRef, () => { isOpen.value = false; });
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "containerRef",
    ...{ class: "ml-3 shrink-0 relative" },
});
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isOpen = !__VLS_ctx.isOpen;
            // @ts-ignore
            [isOpen, isOpen,];
        } },
    ...{ class: "text-gray-400 hover:text-black text-2xl leading-none px-1 py-0.5 cursor-pointer transition-colors" },
    title: (__VLS_ctx.$t('common.options')),
});
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "dropdown",
}));
const __VLS_2 = __VLS_1({
    name: "dropdown",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute right-0 bottom-full mb-2 z-50 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[140px]" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottom-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-w-[140px]']} */ ;
    var __VLS_6 = {
        close: (() => (__VLS_ctx.isOpen = false)),
    };
}
// @ts-ignore
[isOpen, isOpen, $t,];
var __VLS_3;
// @ts-ignore
var __VLS_7 = __VLS_6;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({});
const __VLS_export = {};
export default {};
