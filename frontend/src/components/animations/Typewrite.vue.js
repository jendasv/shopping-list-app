import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps();
const emit = defineEmits();
const displayed = ref('');
let timeoutId = null;
onMounted(() => {
    if (props.texts && props.texts.length > 0) {
        cycleTexts(0);
    }
    else if (props.text) {
        typeOnce(props.text, () => emit('done'));
    }
});
onUnmounted(() => {
    if (timeoutId)
        clearTimeout(timeoutId);
});
function typeOnce(str, onDone) {
    let i = 0;
    const speed = props.speed ?? 50;
    function step() {
        if (i < str.length) {
            displayed.value += str[i++];
            timeoutId = setTimeout(step, speed);
        }
        else {
            onDone?.();
        }
    }
    step();
}
function eraseOnce(onDone) {
    const speed = (props.speed ?? 50) / 2;
    function step() {
        if (displayed.value.length > 0) {
            displayed.value = displayed.value.slice(0, -1);
            timeoutId = setTimeout(step, speed);
        }
        else {
            onDone();
        }
    }
    step();
}
function cycleTexts(index) {
    const list = props.texts;
    const pause = props.pauseMs ?? 1800;
    typeOnce(list[index], () => {
        timeoutId = setTimeout(() => {
            eraseOnce(() => {
                cycleTexts((index + 1) % list.length);
            });
        }, pause);
    });
}
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
    ...{ class: "written" },
});
/** @type {__VLS_StyleScopedClasses['written']} */ ;
(__VLS_ctx.displayed || '\u00A0');
// @ts-ignore
[displayed,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
