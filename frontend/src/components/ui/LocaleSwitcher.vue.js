import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useLocale } from '@/composables/useLocale';
const { currentLocale, availableLocales, setLocale } = useLocale();
const isOpen = ref(false);
const containerRef = ref(null);
const currentFlag = computed(() => availableLocales.find((l) => l.code === currentLocale.value)?.flag ?? '🌐');
function toggle() { isOpen.value = !isOpen.value; }
function close() { isOpen.value = false; }
onClickOutside(containerRef, close);
async function select(code) {
    close();
    await setLocale(code);
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.availableLocales.length > 1) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative" },
        ref: "containerRef",
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.toggle) },
        ...{ class: "flex items-center gap-1 text-sm px-2 py-1 border-b-2 border-transparent hover:border-black transition-colors" },
        ...{ class: ({ 'border-black': __VLS_ctx.isOpen }) },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.currentFlag);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "font-medium uppercase tracking-wide" },
    });
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
    (__VLS_ctx.currentLocale);
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
            ...{ class: "absolute right-0 top-full mt-1 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden min-w-[130px]" },
        });
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['right-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['top-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
        /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
        /** @type {__VLS_StyleScopedClasses['min-w-[130px]']} */ ;
        for (const [loc] of __VLS_vFor((__VLS_ctx.availableLocales))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.availableLocales.length > 1))
                            return;
                        if (!(__VLS_ctx.isOpen))
                            return;
                        __VLS_ctx.select(loc.code);
                        // @ts-ignore
                        [availableLocales, availableLocales, toggle, isOpen, isOpen, currentFlag, currentLocale, select,];
                    } },
                key: (loc.code),
                ...{ class: "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left" },
                ...{ class: ({ 'font-semibold': loc.code === __VLS_ctx.currentLocale }) },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (loc.flag);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (loc.nativeLabel);
            // @ts-ignore
            [currentLocale,];
        }
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
