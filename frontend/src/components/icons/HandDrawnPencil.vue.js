const __VLS_props = defineProps({
    sizeClass: {
        type: String,
        default: "w-10 h-10"
    },
    strokeClass: {
        type: String,
        default: "stroke-gray-800 group-hover:stroke-gray-400 transition-all duration-200"
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ class: (['group cursor-pointer p-2 transition-all duration-200 hover:scale-105 hover:rotate-3', __VLS_ctx.sizeClass]) },
    viewBox: "0 0 40 40",
    fill: "none",
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:rotate-3']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M10 30 Q12 28 26 14 Q30 10 32 12 Q34 14 30 18 Q16 32 14 34 Q12 36 10 30",
    'stroke-width': "2.2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M26 14 Q28 12 30 14",
    'stroke-width': "2.2",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M12 32 Q16 30 18 28",
    'stroke-width': "2",
    'stroke-linecap': "round",
});
// @ts-ignore
[sizeClass, strokeClass, strokeClass, strokeClass,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        sizeClass: {
            type: String,
            default: "w-10 h-10"
        },
        strokeClass: {
            type: String,
            default: "stroke-gray-800 group-hover:stroke-gray-400 transition-all duration-200"
        }
    },
});
export default {};
