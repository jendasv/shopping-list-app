import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';
import AlertMessage from '@/components/elements/AlertMessage.vue';
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
onMounted(async () => {
    await authStore.fetchUser();
    if (authStore.isEmailVerified) {
        router.push({ name: 'home' });
    }
});
const loading = ref(false);
const success = ref('');
const error = ref('');
const cooldown = ref(0);
let cooldownTimer = null;
async function resend() {
    success.value = '';
    error.value = '';
    loading.value = true;
    try {
        await authService.resendVerification();
        success.value = t('auth.emailSent');
        cooldown.value = 60;
        cooldownTimer = setInterval(() => {
            cooldown.value--;
            if (cooldown.value <= 0 && cooldownTimer) {
                clearInterval(cooldownTimer);
                cooldownTimer = null;
            }
        }, 1000);
    }
    catch (e) {
        const err = e;
        error.value = err.message ?? 'Failed to send email.';
    }
    finally {
        loading.value = false;
    }
}
async function logout() {
    await authStore.logout();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold mb-2" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
(__VLS_ctx.$t('auth.verifyEmail'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-gray-500 text-sm mb-8" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
if (__VLS_ctx.authStore.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "font-medium text-black" },
    });
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-black']} */ ;
    (__VLS_ctx.authStore.user.email);
}
if (__VLS_ctx.success) {
    const __VLS_0 = AlertMessage;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        type: "success",
        message: (__VLS_ctx.success),
        ...{ class: "mb-4" },
    }));
    const __VLS_2 = __VLS_1({
        type: "success",
        message: (__VLS_ctx.success),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
}
if (__VLS_ctx.error) {
    const __VLS_5 = AlertMessage;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        type: "error",
        message: (__VLS_ctx.error),
        ...{ class: "mb-4" },
    }));
    const __VLS_7 = __VLS_6({
        type: "error",
        message: (__VLS_ctx.error),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.resend) },
    disabled: (__VLS_ctx.loading || __VLS_ctx.cooldown > 0),
    ...{ class: "btn-primary w-full mb-4" },
});
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('common.sending'));
}
else if (__VLS_ctx.cooldown > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('auth.resendEmail'));
    (__VLS_ctx.cooldown);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('auth.resendEmail'));
}
if (__VLS_ctx.authStore.isAuthenticated) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.logout) },
        ...{ class: "btn-secondary w-full mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (__VLS_ctx.$t('common.signOut'));
}
if (!__VLS_ctx.authStore.isAuthenticated) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-center text-sm text-gray-500" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    (__VLS_ctx.$t('auth.alreadyVerified'));
    let __VLS_10;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        to: ({ name: 'login' }),
        ...{ class: "font-medium underline" },
    }));
    const __VLS_12 = __VLS_11({
        to: ({ name: 'login' }),
        ...{ class: "font-medium underline" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['underline']} */ ;
    const { default: __VLS_15 } = __VLS_13.slots;
    (__VLS_ctx.$t('auth.signIn'));
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, $t, authStore, authStore, authStore, authStore, success, success, error, error, resend, loading, loading, cooldown, cooldown, cooldown, logout,];
    var __VLS_13;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
