import { watch, ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const localMessage = ref(props.message);
const timeout = ref(null);
const defaultTimeout = 5000;
// 🎨 dynamické styly podle typu
const alertClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'block text-green-700 text-center text-lg';
        case 'warning':
            return 'block text-yellow-600 text-center text-lg';
        case 'error':
        default:
            return 'text-red-500 text-sm';
    }
});
// 👀 sleduj změnu message z parenta
watch(() => props.message, (newVal) => {
    localMessage.value = newVal;
    if (timeout.value) {
        clearTimeout(timeout.value);
    }
    if (newVal) {
        timeout.value = setTimeout(() => {
            localMessage.value = '';
            emit('update:message', '');
        }, props.duration ?? defaultTimeout);
    }
}, { immediate: true });
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
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "fade",
}));
const __VLS_2 = __VLS_1({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.localMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-2" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: (__VLS_ctx.alertClass) },
    });
    (__VLS_ctx.localMessage);
}
// @ts-ignore
[localMessage, localMessage, alertClass,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
