const __VLS_props = defineProps();
const emit = defineEmits();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col gap-3 mb-6" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.emit('update:search', $event.target.value);
            // @ts-ignore
            [emit,];
        } },
    value: (__VLS_ctx.search),
    type: "text",
    placeholder: (__VLS_ctx.$t('search.placeholder')),
    ...{ class: "w-full border-b-2 border-gray-300 focus:border-black px-1 py-1 text-base outline-none bg-transparent placeholder-gray-400 transition-colors" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-black']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between gap-3" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
if (__VLS_ctx.filterOptions.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex gap-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    for (const [opt] of __VLS_vFor((__VLS_ctx.filterOptions))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.filterOptions.length))
                        return;
                    __VLS_ctx.emit('update:filter', opt.value);
                    // @ts-ignore
                    [emit, search, $t, filterOptions, filterOptions,];
                } },
            key: (opt.value),
            ...{ class: "px-3 py-1 text-sm border-b-2 transition-colors" },
            ...{ class: (__VLS_ctx.filter === opt.value
                    ? 'border-black font-semibold text-black'
                    : 'border-transparent text-gray-400 hover:text-black') },
        });
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        (opt.label);
        // @ts-ignore
        [filter,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "flex-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
}
if (__VLS_ctx.sortOptions.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
        ...{ onChange: (...[$event]) => {
                if (!(__VLS_ctx.sortOptions.length))
                    return;
                __VLS_ctx.emit('update:sort', $event.target.value);
                // @ts-ignore
                [emit, sortOptions,];
            } },
        value: (__VLS_ctx.sort),
        ...{ class: "text-sm border-b-2 border-gray-300 focus:border-black bg-transparent outline-none cursor-pointer py-1 pl-1 pr-6 transition-colors" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['pl-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['pr-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    for (const [opt] of __VLS_vFor((__VLS_ctx.sortOptions))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (opt.value),
            value: (opt.value),
        });
        (opt.label);
        // @ts-ignore
        [sortOptions, sort,];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
