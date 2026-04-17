import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/layout/AppHeader.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
const authStore = useAuthStore();
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "min-h-screen flex flex-col items-center" },
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full max-w-xl min-h-screen shadow-xl relative flex flex-col paper" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['paper']} */ ;
if (__VLS_ctx.authStore.isAuthenticated) {
    const __VLS_0 = AppHeader;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "flex-1 p-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
let __VLS_5;
/** @ts-ignore @type {typeof __VLS_components.RouterView | typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
{
    const { default: __VLS_10 } = __VLS_8.slots;
    const [{ Component }] = __VLS_vSlot(__VLS_10);
    let __VLS_11;
    /** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        name: "page",
        mode: "out-in",
    }));
    const __VLS_13 = __VLS_12({
        name: "page",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    const { default: __VLS_16 } = __VLS_14.slots;
    const __VLS_17 = (Component);
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    // @ts-ignore
    [authStore,];
    var __VLS_14;
    // @ts-ignore
    [];
    __VLS_8.slots['' /* empty slot name completion */];
}
var __VLS_8;
const __VLS_22 = ConfirmDialog;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
