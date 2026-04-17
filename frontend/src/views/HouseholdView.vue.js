import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { householdService } from '@/services/householdService';
import { useAuthStore } from '@/stores/auth';
import { useConfirm } from '@/composables/useConfirm';
import AlertMessage from '@/components/elements/AlertMessage.vue';
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue';
const { t } = useI18n();
const authStore = useAuthStore();
const { confirm } = useConfirm();
const loading = ref(true);
const data = ref(null);
const householdName = ref('');
const currentUserId = authStore.user?.id;
// Name
const nameSaving = ref(false);
const nameError = ref('');
const nameSuccess = ref('');
// Invite
const inviteEmail = ref('');
const inviteLoading = ref(false);
const inviteError = ref('');
const inviteSuccess = ref('');
// Leave
const leaveErrorMsg = ref('');
// Remove member
const removingMemberId = ref(null);
const removeMemberError = ref('');
const removeMemberSuccess = ref('');
onMounted(async () => {
    try {
        data.value = await householdService.getHousehold();
        householdName.value = data.value.ownHousehold.name;
    }
    finally {
        loading.value = false;
    }
});
async function saveHousehold() {
    nameError.value = '';
    nameSuccess.value = '';
    nameSaving.value = true;
    try {
        await householdService.updateHousehold(householdName.value);
        if (data.value)
            data.value.ownHousehold.name = householdName.value;
        nameSuccess.value = t('household.nameSaved');
    }
    catch (e) {
        const err = e;
        nameError.value = err.message ?? t('household.errors.nameSaveFailed');
    }
    finally {
        nameSaving.value = false;
    }
}
async function sendInvite() {
    inviteError.value = '';
    inviteSuccess.value = '';
    inviteLoading.value = true;
    try {
        await householdService.sendInvitation(inviteEmail.value);
        inviteSuccess.value = t('household.inviteSent', { email: inviteEmail.value });
        inviteEmail.value = '';
    }
    catch (e) {
        const err = e;
        inviteError.value = err.message ?? t('household.errors.inviteFailed');
    }
    finally {
        inviteLoading.value = false;
    }
}
async function leave(id) {
    if (!await confirm(t('household.leaveConfirm')))
        return;
    leaveErrorMsg.value = '';
    try {
        await householdService.leaveHousehold(id);
        if (data.value) {
            data.value.joinedHouseholds = data.value.joinedHouseholds.filter((h) => h.id !== id);
        }
    }
    catch (e) {
        const err = e;
        leaveErrorMsg.value = err.message ?? t('household.errors.leaveFailed');
    }
}
async function removeMember(memberId, memberName) {
    if (!await confirm(t('household.removeMemberConfirm', { name: memberName })))
        return;
    removeMemberError.value = '';
    removeMemberSuccess.value = '';
    removingMemberId.value = memberId;
    try {
        await householdService.removeMember(memberId);
        if (data.value) {
            data.value.ownHousehold.members = data.value.ownHousehold.members.filter((m) => m.id !== memberId);
        }
        removeMemberSuccess.value = t('household.memberRemoved', { name: memberName });
    }
    catch (e) {
        const err = e;
        removeMemberError.value = err.message ?? t('household.errors.removeMemberFailed');
    }
    finally {
        removingMemberId.value = null;
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
(__VLS_ctx.$t('household.title'));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm text-gray-500" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    (__VLS_ctx.$t('common.loading'));
}
else if (__VLS_ctx.data) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-xl font-semibold mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (__VLS_ctx.$t('household.settings'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.saveHousehold) },
        ...{ class: "space-y-4 mb-6" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-baseline gap-3 text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 shrink-0" },
        for: "householdName",
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    (__VLS_ctx.$t('household.householdName'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "householdName",
        value: (__VLS_ctx.householdName),
        placeholder: (__VLS_ctx.$t('household.householdNamePlaceholder')),
        type: "text",
        required: true,
        ...{ class: "flex-1 p-2 focus:outline-none focus:border-gray-600 text-gray-900" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-gray-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    if (__VLS_ctx.nameError) {
        const __VLS_0 = AlertMessage;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            type: "error",
            message: (__VLS_ctx.nameError),
        }));
        const __VLS_2 = __VLS_1({
            type: "error",
            message: (__VLS_ctx.nameError),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    if (__VLS_ctx.nameSuccess) {
        const __VLS_5 = AlertMessage;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            type: "success",
            message: (__VLS_ctx.nameSuccess),
        }));
        const __VLS_7 = __VLS_6({
            type: "success",
            message: (__VLS_ctx.nameSuccess),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        disabled: (__VLS_ctx.nameSaving),
        ...{ class: "btn-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.nameSaving ? __VLS_ctx.$t('common.saving') : __VLS_ctx.$t('household.saveNameBtn'));
    const __VLS_10 = HandDrawnDivider;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ class: "my-6" },
    }));
    const __VLS_12 = __VLS_11({
        ...{ class: "my-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    /** @type {__VLS_StyleScopedClasses['my-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-xl font-bold mb-3 flex items-center gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    (__VLS_ctx.$t('household.inviteMember'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-xs bg-black text-white px-1.5 py-0.5 rounded font-medium" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    (__VLS_ctx.$t('household.pro'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.sendInvite) },
        ...{ class: "flex items-baseline gap-3 text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 shrink-0" },
        for: "inviteEmail",
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    (__VLS_ctx.$t('household.inviteEmail'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "inviteEmail",
        type: "email",
        placeholder: (__VLS_ctx.$t('household.inviteEmailPlaceholder')),
        ...{ class: "flex-1 p-2 focus:outline-none focus:border-gray-600 text-gray-900" },
    });
    (__VLS_ctx.inviteEmail);
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-gray-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        disabled: (__VLS_ctx.inviteLoading),
        ...{ class: "btn-primary whitespace-nowrap shrink-0" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    (__VLS_ctx.inviteLoading ? '...' : __VLS_ctx.$t('household.invite'));
    if (__VLS_ctx.inviteError) {
        const __VLS_15 = AlertMessage;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
            type: "error",
            message: (__VLS_ctx.inviteError),
            ...{ class: "mt-2" },
        }));
        const __VLS_17 = __VLS_16({
            type: "error",
            message: (__VLS_ctx.inviteError),
            ...{ class: "mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    }
    if (__VLS_ctx.inviteSuccess) {
        const __VLS_20 = AlertMessage;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            type: "success",
            message: (__VLS_ctx.inviteSuccess),
            ...{ class: "mt-2" },
        }));
        const __VLS_22 = __VLS_21({
            type: "success",
            message: (__VLS_ctx.inviteSuccess),
            ...{ class: "mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    }
    const __VLS_25 = HandDrawnDivider;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ class: "my-6" },
    }));
    const __VLS_27 = __VLS_26({
        ...{ class: "my-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    /** @type {__VLS_StyleScopedClasses['my-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-xl font-bold mb-3" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    (__VLS_ctx.$t('household.members'));
    if (__VLS_ctx.removeMemberError) {
        const __VLS_30 = AlertMessage;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            type: "error",
            message: (__VLS_ctx.removeMemberError),
            ...{ class: "mb-3" },
        }));
        const __VLS_32 = __VLS_31({
            type: "error",
            message: (__VLS_ctx.removeMemberError),
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    }
    if (__VLS_ctx.removeMemberSuccess) {
        const __VLS_35 = AlertMessage;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            type: "success",
            message: (__VLS_ctx.removeMemberSuccess),
            ...{ class: "mb-3" },
        }));
        const __VLS_37 = __VLS_36({
            type: "success",
            message: (__VLS_ctx.removeMemberSuccess),
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "space-y-3" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
    for (const [member] of __VLS_vFor((__VLS_ctx.data.ownHousehold.members))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (member.id),
            ...{ class: "flex items-center justify-between text-xl" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (member.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-gray-400 text-base" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
        (member.email);
        if (member.id === __VLS_ctx.currentUserId) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-gray-400 text-sm ml-1" },
            });
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
            (__VLS_ctx.$t('household.you'));
        }
        if (member.role === 'owner') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-base text-gray-400 capitalize" },
            });
            /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['capitalize']} */ ;
            (__VLS_ctx.$t('lists.owner'));
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.data))
                            return;
                        if (!!(member.role === 'owner'))
                            return;
                        __VLS_ctx.removeMember(member.id, member.name);
                        // @ts-ignore
                        [$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, loading, data, data, saveHousehold, householdName, nameError, nameError, nameSuccess, nameSuccess, nameSaving, nameSaving, sendInvite, inviteEmail, inviteLoading, inviteLoading, inviteError, inviteError, inviteSuccess, inviteSuccess, removeMemberError, removeMemberError, removeMemberSuccess, removeMemberSuccess, currentUserId, removeMember,];
                    } },
                disabled: (__VLS_ctx.removingMemberId === member.id),
                ...{ class: "text-base text-red-500 hover:text-red-700 transition cursor-pointer disabled:opacity-40" },
            });
            /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            /** @type {__VLS_StyleScopedClasses['disabled:opacity-40']} */ ;
            (__VLS_ctx.removingMemberId === member.id ? '...' : __VLS_ctx.$t('household.removeMember'));
        }
        // @ts-ignore
        [$t, removingMemberId, removingMemberId,];
    }
    if (__VLS_ctx.data.joinedHouseholds.length > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
        const __VLS_40 = HandDrawnDivider;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
            ...{ class: "my-6" },
        }));
        const __VLS_42 = __VLS_41({
            ...{ class: "my-6" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        /** @type {__VLS_StyleScopedClasses['my-6']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "text-xl font-semibold mb-4" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        (__VLS_ctx.$t('household.joinedHouseholds'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
            ...{ class: "space-y-3" },
        });
        /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
        for (const [household] of __VLS_vFor((__VLS_ctx.data.joinedHouseholds))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: (household.id),
                ...{ class: "flex items-center justify-between text-xl" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "font-medium" },
            });
            /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
            (household.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.data))
                            return;
                        if (!(__VLS_ctx.data.joinedHouseholds.length > 0))
                            return;
                        __VLS_ctx.leave(household.id);
                        // @ts-ignore
                        [$t, data, data, leave,];
                    } },
                ...{ class: "text-red-600 hover:text-red-800 cursor-pointer" },
            });
            /** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:text-red-800']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            (__VLS_ctx.$t('household.leave'));
            // @ts-ignore
            [$t,];
        }
        if (__VLS_ctx.leaveErrorMsg) {
            const __VLS_45 = AlertMessage;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
                type: "error",
                message: (__VLS_ctx.leaveErrorMsg),
                ...{ class: "mt-3" },
            }));
            const __VLS_47 = __VLS_46({
                type: "error",
                message: (__VLS_ctx.leaveErrorMsg),
                ...{ class: "mt-3" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
            /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
        }
    }
}
// @ts-ignore
[leaveErrorMsg, leaveErrorMsg,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
