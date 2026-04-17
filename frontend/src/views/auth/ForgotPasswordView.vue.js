import { ref } from 'vue';
import { authService } from '@/services/authService';
import AlertMessage from '@/components/elements/AlertMessage.vue';
const email = ref('');
const error = ref('');
const loading = ref(false);
const sent = ref(false);
async function handleSubmit() {
    error.value = '';
    loading.value = true;
    try {
        await authService.forgotPassword(email.value);
        sent.value = true;
    }
    catch (e) {
        const err = e;
        error.value = err.message ?? 'Something went wrong.';
    }
    finally {
        loading.value = false;
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
(__VLS_ctx.$t('auth.forgotPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-gray-500 text-base mb-8" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
if (!__VLS_ctx.sent) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmit) },
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
    (__VLS_ctx.email);
    /** @type {__VLS_StyleScopedClasses['input-field']} */ ;
    if (__VLS_ctx.error) {
        const __VLS_0 = AlertMessage;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            type: "error",
            message: (__VLS_ctx.error),
        }));
        const __VLS_2 = __VLS_1({
            type: "error",
            message: (__VLS_ctx.error),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        disabled: (__VLS_ctx.loading),
        ...{ class: "btn-primary w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    (__VLS_ctx.loading ? __VLS_ctx.$t('common.sending') : __VLS_ctx.$t('auth.sendResetLink'));
}
else {
    const __VLS_5 = AlertMessage;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        type: "success",
        message: (__VLS_ctx.$t('auth.linkSent')),
    }));
    const __VLS_7 = __VLS_6({
        type: "success",
        message: (__VLS_ctx.$t('auth.linkSent')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-center text-base text-gray-500 mt-6" },
});
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
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
(__VLS_ctx.$t('auth.backToSignIn'));
// @ts-ignore
[$t, $t, $t, $t, $t, $t, $t, sent, handleSubmit, email, error, error, loading, loading,];
var __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
