const show = defineModel();
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
let __VLS_modelEmit;
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "absolute top-0 right-2" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.show = false;
            // @ts-ignore
            [show,];
        } },
    ...{ class: (['cursor-pointer transition-all duration-200 w-8 h-8 group', __VLS_ctx.customClass]) },
    viewBox: "0 0 40 40",
    fill: "none",
});
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M10 10 Q12 8 20 18 Q28 28 30 30",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M30 10 Q28 12 20 18 Q12 24 10 30",
    'stroke-width': "2.5",
    'stroke-linecap': "round",
});
// @ts-ignore
[customClass, strokeClass, strokeClass,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    props: {
        ...{},
        ...{
            customClass: {
                type: String,
                default: ""
            },
            strokeClass: {
                type: String,
                default: "stroke-gray-800 group-hover:stroke-gray-400 transition-all duration-200"
            }
        },
    },
});
export default {};
