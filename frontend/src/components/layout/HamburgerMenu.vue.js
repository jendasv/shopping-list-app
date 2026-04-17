import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
const isOpen = ref(false);
const menuRef = ref(null);
const menuItems = [
    { name: 'home', labelKey: 'lists.title', to: { name: 'home' } },
    { name: 'catalog', labelKey: 'catalog.title', to: { name: 'catalog' } },
    { name: 'household', labelKey: 'household.title', to: { name: 'household' } },
    { name: 'settings', labelKey: 'settings.title', to: { name: 'settings' } },
];
function toggle() { isOpen.value = !isOpen.value; }
function close() { isOpen.value = false; }
onClickOutside(menuRef, close);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "menuRef",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.toggle) },
    ...{ class: "flex flex-col justify-center items-center w-9 h-9 gap-[5px] hover:bg-black/5 rounded-md transition-colors cursor-pointer" },
    'aria-label': "Menu",
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-[5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
for (const [i] of __VLS_vFor((3))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        key: (i),
        ...{ class: "block h-[2px] bg-current transition-all duration-200 origin-center" },
        ...{ class: ([
                i === 1 ? (__VLS_ctx.isOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-6') : '',
                i === 2 ? (__VLS_ctx.isOpen ? 'opacity-0 w-0' : 'w-5') : '',
                i === 3 ? (__VLS_ctx.isOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-6') : '',
            ]) },
    });
    /** @type {__VLS_StyleScopedClasses['block']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-[2px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-current']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['origin-center']} */ ;
    // @ts-ignore
    [toggle, isOpen, isOpen, isOpen,];
}
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "slide",
}));
const __VLS_2 = __VLS_1({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute top-14 left-0 w-56 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50 py-2" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-14']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-56']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    for (const [item] of __VLS_vFor((__VLS_ctx.menuItems))) {
        let __VLS_6;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        RouterLink;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            ...{ 'onClick': {} },
            key: (item.name),
            to: (item.to),
            ...{ class: "flex items-center gap-3 px-4 py-3 text-xl font-medium hover:bg-gray-50 transition-colors" },
        }));
        const __VLS_8 = __VLS_7({
            ...{ 'onClick': {} },
            key: (item.name),
            to: (item.to),
            ...{ class: "flex items-center gap-3 px-4 py-3 text-xl font-medium hover:bg-gray-50 transition-colors" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        let __VLS_11;
        const __VLS_12 = ({ click: {} },
            { onClick: (__VLS_ctx.close) });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        const { default: __VLS_13 } = __VLS_9.slots;
        (__VLS_ctx.$t(item.labelKey));
        // @ts-ignore
        [isOpen, menuItems, close, $t,];
        var __VLS_9;
        var __VLS_10;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
