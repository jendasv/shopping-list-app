import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import AlertMessage from '@/components/elements/AlertMessage.vue';
const route = useRoute();
const router = useRouter();
const form = ref({
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
});
const error = ref('');
const loading = ref(false);
onMounted(() => {
    form.value.token = route.query.token ?? '';
    form.value.email = route.query.email ?? '';
});
async function handleSubmit() {
    error.value = '';
    loading.value = true;
    try {
        await authService.resetPassword(form.value);
        router.push({ name: 'login' });
    }
    catch (e) {
        const err = e;
        if (err.errors) {
            const first = Object.values(err.errors)[0];
            error.value = Array.isArray(first) ? (first[0] ?? '') : String(first);
        }
        else {
            error.value = err.message ?? 'Password reset failed.';
        }
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
(__VLS_ctx.$t('auth.newPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-gray-500 text-base mb-8" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('auth.chooseNewPassword'));
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
(__VLS_ctx.$t('auth.fields.newPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    placeholder: (__VLS_ctx.$t('auth.placeholders.password')),
    required: true,
    ...{ class: "input-field" },
});
(__VLS_ctx.form.password);
/** @type {__VLS_StyleScopedClasses['input-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "block text-base font-medium mb-1" },
});
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
(__VLS_ctx.$t('auth.fields.confirmNewPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    placeholder: (__VLS_ctx.$t('auth.placeholders.repeatNewPassword')),
    required: true,
    ...{ class: "input-field" },
});
(__VLS_ctx.form.password_confirmation);
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
(__VLS_ctx.loading ? __VLS_ctx.$t('common.saving') : __VLS_ctx.$t('auth.setNewPassword'));
// @ts-ignore
[$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, handleSubmit, form, form, form, error, error, loading, loading,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
