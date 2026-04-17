import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';
import HandDrawnUserIcon from '@/components/icons/HandDrawnUserIcon.vue';
const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;
const isOpen = ref(false);
const panelRef = ref(null);
function toggle() { isOpen.value = !isOpen.value; }
function close() { isOpen.value = false; }
onClickOutside(panelRef, close);
async function handleLogout() {
    await authStore.logout();
    close();
    router.push({ name: 'landing' });
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative" },
    ref: "panelRef",
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.toggle) },
    ...{ class: "flex items-center justify-center w-9 h-9 rounded-full border-2 border-current hover:bg-black/5 transition-colors cursor-pointer" },
    ...{ class: ({ 'bg-black/5': __VLS_ctx.isOpen }) },
    'aria-label': "User menu",
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-current']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
const __VLS_0 = HandDrawnUserIcon;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    size: (22),
}));
const __VLS_2 = __VLS_1({
    size: (22),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    name: "dropdown",
}));
const __VLS_7 = __VLS_6({
    name: "dropdown",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_10 } = __VLS_8.slots;
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute right-0 top-11 w-56 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-11']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-56']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "px-4 py-3 border-b border-gray-100" },
    });
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-base font-semibold truncate" },
    });
    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_ctx.user?.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm text-gray-500 truncate" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_ctx.user?.email);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "py-1" },
    });
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    let __VLS_11;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        to: ({ name: 'settings' }),
        ...{ class: "flex items-center gap-2 px-4 py-2 text-xl hover:bg-gray-50 transition-colors" },
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        to: ({ name: 'settings' }),
        ...{ class: "flex items-center gap-2 px-4 py-2 text-xl hover:bg-gray-50 transition-colors" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = ({ click: {} },
        { onClick: (__VLS_ctx.close) });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    const { default: __VLS_18 } = __VLS_14.slots;
    (__VLS_ctx.$t('settings.title'));
    // @ts-ignore
    [toggle, isOpen, isOpen, user, user, close, $t,];
    var __VLS_14;
    var __VLS_15;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-t border-gray-100 py-1" },
    });
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleLogout) },
        ...{ class: "flex w-full items-center gap-2 px-4 py-2 text-xl text-red-600 hover:bg-red-50 transition-colors" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-red-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    (__VLS_ctx.$t('common.signOut'));
}
// @ts-ignore
[$t, handleLogout,];
var __VLS_8;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
