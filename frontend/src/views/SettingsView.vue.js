import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue';
const { t } = useI18n();
const authStore = useAuthStore();
// Profile
const profile = ref({ name: authStore.user?.name ?? '', email: authStore.user?.email ?? '' });
const profileLoading = ref(false);
const profileError = ref('');
const profileSuccess = ref('');
async function saveProfile() {
    profileError.value = '';
    profileSuccess.value = '';
    profileLoading.value = true;
    try {
        const res = await authService.updateProfile(profile.value);
        authStore.user = res.user;
        profileSuccess.value = t('settings.profileSaved');
    }
    catch (e) {
        const err = e;
        if (err.errors) {
            const first = Object.values(err.errors)[0];
            profileError.value = Array.isArray(first) ? (first[0] ?? '') : String(first);
        }
        else {
            profileError.value = err.message ?? t('settings.errors.saveFailed');
        }
    }
    finally {
        profileLoading.value = false;
    }
}
// Password
const password = ref({ current: '', next: '', confirm: '' });
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');
async function savePassword() {
    passwordError.value = '';
    passwordSuccess.value = '';
    passwordLoading.value = true;
    try {
        await authService.updatePassword({
            current_password: password.value.current,
            password: password.value.next,
            password_confirmation: password.value.confirm,
        });
        passwordSuccess.value = t('settings.passwordChanged');
        password.value = { current: '', next: '', confirm: '' };
    }
    catch (e) {
        const err = e;
        if (err.errors) {
            const first = Object.values(err.errors)[0];
            passwordError.value = Array.isArray(first) ? (first[0] ?? '') : String(first);
        }
        else {
            passwordError.value = err.message ?? t('settings.errors.passwordChangeFailed');
        }
    }
    finally {
        passwordLoading.value = false;
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
    ...{ class: "py-4 space-y-10" },
});
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold text-center" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
(__VLS_ctx.$t('settings.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-xl font-semibold mb-4" },
});
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('settings.profile'));
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.saveProfile) },
    ...{ class: "space-y-4" },
});
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "w-32 shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('settings.fields.name'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    value: (__VLS_ctx.profile.name),
    type: "text",
    readonly: true,
    placeholder: (__VLS_ctx.$t('settings.placeholders.name')),
    ...{ class: "flex-1 p-2 focus:outline-none text-gray-900 bg-transparent cursor-default" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-default']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "w-32 shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('settings.fields.email'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "email",
    readonly: true,
    placeholder: (__VLS_ctx.$t('settings.placeholders.email')),
    ...{ class: "flex-1 p-2 focus:outline-none text-gray-900 bg-transparent cursor-default" },
});
(__VLS_ctx.profile.email);
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-default']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "w-32 shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('settings.language'));
const __VLS_0 = LocaleSwitcher;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.profileError) {
    const __VLS_5 = AlertMessage;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        type: "error",
        message: (__VLS_ctx.profileError),
    }));
    const __VLS_7 = __VLS_6({
        type: "error",
        message: (__VLS_ctx.profileError),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
if (__VLS_ctx.profileSuccess) {
    const __VLS_10 = AlertMessage;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        type: "success",
        message: (__VLS_ctx.profileSuccess),
    }));
    const __VLS_12 = __VLS_11({
        type: "success",
        message: (__VLS_ctx.profileSuccess),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
const __VLS_15 = HandDrawnDivider;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-xl font-semibold mb-4" },
});
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('settings.changePassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.savePassword) },
    ...{ class: "space-y-4" },
});
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "w-32 shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('auth.fields.currentPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    required: true,
    placeholder: (__VLS_ctx.$t('auth.placeholders.currentPassword')),
    ...{ class: "flex-1 p-2 focus:outline-none text-gray-900" },
});
(__VLS_ctx.password.current);
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "w-32 shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('settings.fields.newPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    required: true,
    placeholder: (__VLS_ctx.$t('settings.placeholders.newPassword')),
    ...{ class: "flex-1 p-2 focus:outline-none text-gray-900" },
});
(__VLS_ctx.password.next);
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "w-32 shrink-0 text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
(__VLS_ctx.$t('settings.fields.confirmPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    required: true,
    placeholder: (__VLS_ctx.$t('settings.placeholders.confirmPassword')),
    ...{ class: "flex-1 p-2 focus:outline-none text-gray-900" },
});
(__VLS_ctx.password.confirm);
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
if (__VLS_ctx.passwordError) {
    const __VLS_20 = AlertMessage;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        type: "error",
        message: (__VLS_ctx.passwordError),
    }));
    const __VLS_22 = __VLS_21({
        type: "error",
        message: (__VLS_ctx.passwordError),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
if (__VLS_ctx.passwordSuccess) {
    const __VLS_25 = AlertMessage;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        type: "success",
        message: (__VLS_ctx.passwordSuccess),
    }));
    const __VLS_27 = __VLS_26({
        type: "success",
        message: (__VLS_ctx.passwordSuccess),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    disabled: (__VLS_ctx.passwordLoading),
    ...{ class: "btn-primary" },
});
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
(__VLS_ctx.passwordLoading ? __VLS_ctx.$t('common.saving') : __VLS_ctx.$t('settings.changePassword'));
// @ts-ignore
[$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, saveProfile, profile, profile, profileError, profileError, profileSuccess, profileSuccess, savePassword, password, password, password, passwordError, passwordError, passwordSuccess, passwordSuccess, passwordLoading, passwordLoading,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
