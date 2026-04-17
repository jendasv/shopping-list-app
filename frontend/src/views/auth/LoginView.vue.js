import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue';
const authStore = useAuthStore();
const router = useRouter();
const form = ref({ email: '', password: '' });
const error = ref('');
async function handleLogin() {
    error.value = '';
    try {
        await authStore.login(form.value.email, form.value.password);
        const redirect = router.currentRoute.value.query.redirect;
        router.push(redirect ?? { name: 'home' });
    }
    catch (e) {
        const err = e;
        if (err.errors) {
            const first = Object.values(err.errors)[0];
            error.value = Array.isArray(first) ? (first[0] ?? '') : String(first);
        }
        else {
            error.value = err.message ?? 'Sign in failed.';
        }
    }
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
    ...{ class: "absolute top-4 right-4" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
const __VLS_0 = LocaleSwitcher;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full max-w-sm" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold mb-2" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
(__VLS_ctx.$t('auth.signIn'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-gray-500 text-base mb-8" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('auth.welcomeBack'));
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleLogin) },
    ...{ class: "space-y-4" },
});
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "block text-base font-medium mb-1" },
});
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
(__VLS_ctx.$t('auth.fields.email'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "email",
    placeholder: (__VLS_ctx.$t('auth.placeholders.email')),
    required: true,
    ...{ class: "input-field" },
});
(__VLS_ctx.form.email);
/** @type {__VLS_StyleScopedClasses['input-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "block text-base font-medium mb-1" },
});
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
(__VLS_ctx.$t('auth.fields.password'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    placeholder: (__VLS_ctx.$t('auth.placeholders.yourPassword')),
    required: true,
    ...{ class: "input-field" },
});
(__VLS_ctx.form.password);
/** @type {__VLS_StyleScopedClasses['input-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-right mt-1" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
let __VLS_5;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    to: ({ name: 'forgot-password' }),
    ...{ class: "text-sm text-gray-500 hover:underline" },
}));
const __VLS_7 = __VLS_6({
    to: ({ name: 'forgot-password' }),
    ...{ class: "text-sm text-gray-500 hover:underline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
const { default: __VLS_10 } = __VLS_8.slots;
(__VLS_ctx.$t('auth.forgotPasswordLink'));
// @ts-ignore
[$t, $t, $t, $t, $t, $t, $t, handleLogin, form, form,];
var __VLS_8;
if (__VLS_ctx.error) {
    const __VLS_11 = AlertMessage;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        type: "error",
        message: (__VLS_ctx.error),
    }));
    const __VLS_13 = __VLS_12({
        type: "error",
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    disabled: (__VLS_ctx.authStore.loading),
    ...{ class: "btn-primary w-full" },
});
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
(__VLS_ctx.authStore.loading ? __VLS_ctx.$t('auth.signingIn') : __VLS_ctx.$t('auth.signIn'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-center text-base text-gray-500 mt-6" },
});
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
(__VLS_ctx.$t('auth.noAccount'));
let __VLS_16;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    to: ({ name: 'landing' }),
    ...{ class: "font-medium underline" },
}));
const __VLS_18 = __VLS_17({
    to: ({ name: 'landing' }),
    ...{ class: "font-medium underline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
const { default: __VLS_21 } = __VLS_19.slots;
(__VLS_ctx.$t('auth.signUp'));
// @ts-ignore
[$t, $t, $t, $t, error, error, authStore, authStore,];
var __VLS_19;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
