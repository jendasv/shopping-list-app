const model = defineModel();
const __VLS_props = defineProps({
    sizeClass: {
        type: String,
        default: ""
    },
    strokeClass: {
        type: String,
        default: "stroke-gray-800 group-hover:stroke-gray-400"
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
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "inline-flex items-center cursor-pointer group text-xl" },
});
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
if (__VLS_ctx.$slots.default) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-2" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    var __VLS_0 = {};
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "checkbox",
    ...{ class: "hidden" },
});
(__VLS_ctx.model);
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ class: (['w-6 h-6 transition-all duration-200', __VLS_ctx.sizeClass]) },
    viewBox: "0 0 40 40",
    fill: "none",
});
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    ...{ class: (__VLS_ctx.strokeClass) },
    d: "M8 9 C 14 7.5, 26 8.5, 32 9 C 32.5 15, 32 25, 32 31 C 26 32.5, 14 31.5, 8 31 C 7.5 25, 8 15, 8 9 Z",
    'stroke-width': "2.2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
if (__VLS_ctx.model) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        ...{ class: (__VLS_ctx.strokeClass) },
        d: "M11 22 Q18 29 20 27 Q27 18 36 11",
        'stroke-width': "2.2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
}
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[$slots, model, model, sizeClass, strokeClass, strokeClass,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeEmits: {},
    props: {
        ...{},
        ...{
            sizeClass: {
                type: String,
                default: ""
            },
            strokeClass: {
                type: String,
                default: "stroke-gray-800 group-hover:stroke-gray-400"
            }
        },
    },
});
const __VLS_export = {};
export default {};
