import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import Typewrite from '@/components/animations/Typewrite.vue';
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue';
const authStore = useAuthStore();
const router = useRouter();
const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});
const error = ref('');
async function handleRegister() {
    error.value = '';
    try {
        await authStore.register(form.value);
        router.push({ name: 'email-verify' });
    }
    catch (e) {
        const err = e;
        if (err.errors) {
            const first = Object.values(err.errors)[0];
            error.value = Array.isArray(first) ? (first[0] ?? '') : String(first);
        }
        else {
            error.value = err.message ?? 'Registration failed.';
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
    ...{ class: "min-h-screen flex flex-col md:flex-row" },
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute top-4 right-4 z-10" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
const __VLS_0 = LocaleSwitcher;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 flex flex-col justify-center px-8 py-12 md:pl-8 md:pr-0 order-1 md:order-2" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pl-8']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pr-0']} */ ;
/** @type {__VLS_StyleScopedClasses['order-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:order-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-sm mx-auto w-full" },
});
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "md:hidden text-xs font-bold tracking-widest uppercase text-gray-400 mb-5" },
});
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
(__VLS_ctx.$t('auth.appName'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold mb-2" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
(__VLS_ctx.$t('auth.getStarted'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-gray-500 text-base mb-8" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('auth.noCredits'));
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleRegister) },
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
(__VLS_ctx.$t('auth.fields.name'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    value: (__VLS_ctx.form.name),
    type: "text",
    placeholder: (__VLS_ctx.$t('auth.placeholders.name')),
    required: true,
    ...{ class: "input-field" },
});
/** @type {__VLS_StyleScopedClasses['input-field']} */ ;
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
(__VLS_ctx.$t('auth.fields.confirmPassword'));
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "password",
    placeholder: (__VLS_ctx.$t('auth.placeholders.repeatPassword')),
    required: true,
    ...{ class: "input-field" },
});
(__VLS_ctx.form.password_confirmation);
/** @type {__VLS_StyleScopedClasses['input-field']} */ ;
if (__VLS_ctx.error) {
    const __VLS_5 = AlertMessage;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        type: "error",
        message: (__VLS_ctx.error),
    }));
    const __VLS_7 = __VLS_6({
        type: "error",
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    disabled: (__VLS_ctx.authStore.loading),
    ...{ class: "btn-primary w-full" },
});
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
(__VLS_ctx.authStore.loading ? __VLS_ctx.$t('auth.creatingAccount') : __VLS_ctx.$t('auth.createAccount'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-center text-base text-gray-500 mt-6" },
});
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
(__VLS_ctx.$t('auth.alreadyHaveAccount'));
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
[$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, handleRegister, form, form, form, form, error, error, authStore, authStore,];
var __VLS_13;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 flex flex-col justify-center items-center px-8 py-12 md:pr-8 md:pl-0 md:border-r-2 border-black order-2 md:order-1" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:border-r-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black']} */ ;
/** @type {__VLS_StyleScopedClasses['order-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:order-1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-sm text-center" },
});
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "hidden md:block text-xs font-bold tracking-widest uppercase text-gray-400 mb-4" },
});
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('auth.appName'));
const __VLS_16 = Typewrite;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    texts: (['Shopping.', 'Packing for trips.', 'Shared with family.']),
    ...{ class: "text-3xl font-bold mb-6" },
}));
const __VLS_18 = __VLS_17({
    texts: (['Shopping.', 'Packing for trips.', 'Shared with family.']),
    ...{ class: "text-3xl font-bold mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
const __VLS_21 = HandDrawnDivider;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ class: "mb-6" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
    ...{ class: "space-y-3 text-left text-base" },
});
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
    ...{ class: "flex items-start gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mt-0.5" },
});
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('auth.features.realtime'));
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
    ...{ class: "flex items-start gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mt-0.5" },
});
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('auth.features.versatile'));
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
    ...{ class: "flex items-start gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mt-0.5" },
});
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('auth.features.privacy'));
// @ts-ignore
[$t, $t, $t, $t,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
