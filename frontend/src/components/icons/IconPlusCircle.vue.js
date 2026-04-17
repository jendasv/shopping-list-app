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
    ...{ class: (['group p-2 cursor-pointer transition-all duration-200 hover:scale-105', __VLS_ctx.sizeClass]) },
    viewBox: "0 0 40 40",
    fill: "none",
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M20 6 Q30 8 34 20 Q32 30 20 34 Q10 32 6 20 Q8 10 20 6",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M20 13 Q20 20 20 27",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M13 20 Q20 20 27 20",
    'stroke-width': "2.5",
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
