import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { apiFetch } from '@/services/api';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const token = route.params.token;
const action = route.name === 'invitation-accept' ? 'accept' : 'decline';
const loading = ref(true);
const success = ref('');
const error = ref('');
onMounted(async () => {
    if (!authStore.initialized) {
        await authStore.fetchUser();
    }
    if (!authStore.isAuthenticated) {
        router.replace({ name: 'login', query: { redirect: route.fullPath } });
        return;
    }
    try {
        await apiFetch(`/invitations/${token}/${action}`, { method: 'POST' });
        success.value = action === 'accept'
            ? t('invitation.joined')
            : t('invitation.declined');
    }
    catch (e) {
        const err = e;
        error.value = err.message ?? t('invitation.processFailed');
    }
    finally {
        loading.value = false;
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "min-h-screen flex items-center justify-center px-8 py-12" },
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full max-w-sm text-center" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-gray-500 text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    (__VLS_ctx.$t('invitation.processing'));
}
else if (__VLS_ctx.success) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-2xl font-bold mb-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    (__VLS_ctx.action === 'accept' ? __VLS_ctx.$t('invitation.welcomeTitle') : __VLS_ctx.$t('invitation.declinedTitle'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-gray-500 text-sm mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.success);
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        to: ({ name: 'home' }),
        ...{ class: "btn-primary inline-block" },
    }));
    const __VLS_2 = __VLS_1({
        to: ({ name: 'home' }),
        ...{ class: "btn-primary inline-block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    (__VLS_ctx.$t('invitation.goToLists'));
    // @ts-ignore
    [loading, $t, $t, $t, $t, success, success, action,];
    var __VLS_3;
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-2xl font-bold mb-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    (__VLS_ctx.$t('invitation.errorTitle'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-gray-500 text-sm mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.error);
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        to: ({ name: 'home' }),
        ...{ class: "btn-primary inline-block" },
    }));
    const __VLS_8 = __VLS_7({
        to: ({ name: 'home' }),
        ...{ class: "btn-primary inline-block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    (__VLS_ctx.$t('invitation.goToLists'));
    // @ts-ignore
    [$t, $t, error, error,];
    var __VLS_9;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
