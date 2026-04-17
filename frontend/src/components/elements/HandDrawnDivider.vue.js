const __VLS_props = defineProps({
    customClass: {
        type: String,
        default: "mb-6"
    },
    strokeClass: {
        type: String,
        default: "stroke-gray-800"
    },
    variant: {
        type: String,
        default: "default"
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
    ...{ class: (['group w-full h-6', __VLS_ctx.customClass]) },
    viewBox: "0 0 100 20",
    preserveAspectRatio: "none",
    fill: "none",
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
if (__VLS_ctx.variant === 'default') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        ...{ class: (__VLS_ctx.strokeClass) },
        d: "\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u004d\u0030\u0020\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0051\u0031\u0030\u0020\u0036\u0020\u0032\u0030\u0020\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0054\u0034\u0030\u0020\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0054\u0036\u0030\u0020\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0054\u0038\u0030\u0020\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0054\u0031\u0030\u0030\u0020\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020",
        'stroke-width': "1",
        'stroke-linecap': "round",
        fill: "none",
    });
}
if (__VLS_ctx.variant === 'low-wave') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        ...{ class: (__VLS_ctx.strokeClass) },
        d: "M0 10 Q25 8 50 10 T100 10",
        'stroke-width': "1",
        'stroke-linecap': "round",
        fill: "none",
    });
}
if (__VLS_ctx.variant === 'hand-shake') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        ...{ class: (__VLS_ctx.strokeClass) },
        d: "M0 10 Q10 5 20 11 T40 9 T60 12 T80 8 T100 10",
        'stroke-width': "1",
        'stroke-linecap': "round",
        fill: "none",
    });
}
// @ts-ignore
[customClass, variant, variant, variant, strokeClass, strokeClass, strokeClass,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        customClass: {
            type: String,
            default: "mb-6"
        },
        strokeClass: {
            type: String,
            default: "stroke-gray-800"
        },
        variant: {
            type: String,
            default: "default"
        }
    },
});
export default {};
