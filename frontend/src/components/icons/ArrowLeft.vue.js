const __VLS_props = defineProps({
    customClass: {
        type: String,
        default: ""
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    viewBox: "0 0 40 40",
    ...{ class: (['group cursor-pointer transition-all duration-200', __VLS_ctx.customClass]) },
    fill: "none",
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M30 20 Q22 18 12 20",
    fill: "none",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M18 14 Q14 18 12 20",
    fill: "none",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M18 26 Q14 22 12 20",
    fill: "none",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
});
// @ts-ignore
[customClass, strokeClass, strokeClass, strokeClass,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        customClass: {
            type: String,
            default: ""
        },
        strokeClass: {
            type: String,
            default: "stroke-gray-800 group-hover:stroke-gray-400 transition-all duration-200"
        }
    },
});
export default {};
