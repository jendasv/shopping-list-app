import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { searchProducts } from '@/services/productService';
import { fetchUnits } from '@/services/unitService';
const { t } = useI18n();
const props = defineProps();
const emit = defineEmits();
// --- State ---
const nameInputRef = ref(null);
const inputName = ref('');
const selectedProduct = ref(null);
const form = ref({
    quantity: null,
    unit_id: null,
});
const error = ref('');
const shaking = ref(false);
// Autocomplete
const suggestions = ref([]);
const searching = ref(false);
const showDropdown = ref(false);
const focusedIndex = ref(-1);
let debounceTimer = null;
// Units
const unitGroups = ref({});
onMounted(async () => {
    if (props.listType === 'todo')
        return;
    try {
        unitGroups.value = await fetchUnits();
    }
    catch {
        // units not critical — form works without them
    }
});
// Reset form when closed
watch(() => props.showAddForm, (val) => {
    if (!val)
        resetForm();
});
// --- Autocomplete ---
function onNameInput() {
    error.value = '';
    selectedProduct.value = null;
    const q = inputName.value.trim();
    if (q.length < 2) {
        closeSuggestions();
        return;
    }
    if (debounceTimer)
        clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doSearch(q), 300);
}
async function doSearch(q) {
    searching.value = true;
    showDropdown.value = true;
    try {
        suggestions.value = await searchProducts(q);
    }
    catch {
        suggestions.value = [];
    }
    finally {
        searching.value = false;
    }
}
function onFocus() {
    if (inputName.value.trim().length >= 2 && (suggestions.value.length > 0 || searching.value)) {
        showDropdown.value = true;
    }
}
function onBlur() {
    setTimeout(() => { showDropdown.value = false; focusedIndex.value = -1; }, 150);
}
function closeSuggestions() {
    showDropdown.value = false;
    focusedIndex.value = -1;
}
function moveFocus(dir) {
    if (!showDropdown.value)
        return;
    const max = suggestions.value.length;
    focusedIndex.value = Math.max(-1, Math.min(max, focusedIndex.value + dir));
}
function confirmFocused() {
    if (focusedIndex.value >= 0 && focusedIndex.value < suggestions.value.length) {
        const product = suggestions.value[focusedIndex.value];
        if (product)
            selectProduct(product);
    }
    else if (focusedIndex.value === suggestions.value.length) {
        addAsFreeText();
    }
    else {
        onSubmit();
    }
}
function selectProduct(product) {
    selectedProduct.value = product;
    if (product.preferred_quantity && product.unit) {
        inputName.value = `${product.name} ${product.preferred_quantity} ${product.unit.symbol}`;
        form.value.quantity = 1;
        form.value.unit_id = null;
    }
    else {
        inputName.value = product.name;
        form.value.quantity = null;
        form.value.unit_id = product.preferred_unit_id ?? null;
    }
    closeSuggestions();
}
function addAsFreeText() {
    selectedProduct.value = null;
    closeSuggestions();
}
// --- Validation & submit ---
function triggerShake() {
    shaking.value = true;
    setTimeout(() => { shaking.value = false; }, 500);
}
function onSubmit() {
    const name = inputName.value.trim();
    if (!name && !selectedProduct.value) {
        error.value = t('items.errors.nameRequired');
        triggerShake();
        return;
    }
    const qty = form.value.quantity;
    if (props.listType !== 'todo' && qty !== null && qty <= 0) {
        error.value = t('items.errors.quantityInvalid');
        triggerShake();
        return;
    }
    emit('add', {
        name: name || selectedProduct.value.name,
        product_id: selectedProduct.value?.id ?? null,
        quantity: props.listType === 'todo' ? null : (qty ?? null),
        unit_id: props.listType === 'todo' ? null : (form.value.unit_id ?? null),
        notes: null,
        isCompleted: false,
    });
    resetForm();
}
function resetForm() {
    inputName.value = '';
    selectedProduct.value = null;
    form.value = { quantity: null, unit_id: null };
    error.value = '';
    closeSuggestions();
}
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
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "unroll",
}));
const __VLS_2 = __VLS_1({
    name: "unroll",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.showAddForm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-2 border-black rounded-lg p-4 mb-4 relative" },
    });
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.emit('update:showAddForm', false);
                // @ts-ignore
                [showAddForm, emit,];
            } },
        type: "button",
        ...{ class: "absolute top-3 right-3 text-gray-400 hover:text-black transition text-xl leading-none" },
        title: (__VLS_ctx.$t('items.closeForm')),
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.onSubmit) },
        ...{ class: "flex flex-col gap-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative flex flex-col text-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "text-gray-900 mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.$t('items.name'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ onInput: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' ? __VLS_ctx.onNameInput() : (__VLS_ctx.error = '');
                // @ts-ignore
                [$t, $t, onSubmit, listType, onNameInput, error,];
            } },
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' && __VLS_ctx.closeSuggestions();
                // @ts-ignore
                [listType, closeSuggestions,];
            } },
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' && __VLS_ctx.moveFocus(1);
                // @ts-ignore
                [listType, moveFocus,];
            } },
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' && __VLS_ctx.moveFocus(-1);
                // @ts-ignore
                [listType, moveFocus,];
            } },
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' ? __VLS_ctx.confirmFocused() : __VLS_ctx.onSubmit();
                // @ts-ignore
                [onSubmit, listType, confirmFocused,];
            } },
        ...{ onBlur: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' && __VLS_ctx.onBlur();
                // @ts-ignore
                [listType, onBlur,];
            } },
        ...{ onFocus: (...[$event]) => {
                if (!(__VLS_ctx.showAddForm))
                    return;
                __VLS_ctx.listType !== 'todo' && __VLS_ctx.onFocus();
                // @ts-ignore
                [listType, onFocus,];
            } },
        ref: "nameInputRef",
        value: (__VLS_ctx.inputName),
        type: "text",
        placeholder: (__VLS_ctx.$t('items.namePlaceholder')),
        ...{ class: "px-2 pt-2 focus:outline-none focus:border-gray-600 text-gray-900 w-full" },
        autocomplete: "off",
    });
    /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-gray-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.listType !== 'todo' && __VLS_ctx.showDropdown) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "absolute top-full left-0 right-0 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50 max-h-60 overflow-y-auto" },
        });
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['top-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['left-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['right-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
        /** @type {__VLS_StyleScopedClasses['max-h-60']} */ ;
        /** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
        for (const [product, i] of __VLS_vFor((__VLS_ctx.suggestions))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onMousedown: (...[$event]) => {
                        if (!(__VLS_ctx.showAddForm))
                            return;
                        if (!(__VLS_ctx.listType !== 'todo' && __VLS_ctx.showDropdown))
                            return;
                        __VLS_ctx.selectProduct(product);
                        // @ts-ignore
                        [$t, listType, inputName, showDropdown, suggestions, selectProduct,];
                    } },
                key: (product.id),
                type: "button",
                ...{ class: "w-full px-4 py-3 text-left flex items-center justify-between transition-colors" },
                ...{ class: (__VLS_ctx.focusedIndex === i ? 'bg-gray-100' : 'hover:bg-gray-50') },
            });
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "font-medium" },
            });
            /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
            (product.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-sm text-gray-400 ml-2 shrink-0" },
            });
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
            (product.category?.name ?? '');
            if (product.preferred_quantity && product.unit) {
                (product.preferred_quantity);
                (product.unit.symbol);
            }
            // @ts-ignore
            [focusedIndex,];
        }
        if (__VLS_ctx.inputName.trim().length >= 2) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onMousedown: (__VLS_ctx.addAsFreeText) },
                type: "button",
                ...{ class: "w-full px-4 py-3 text-left text-gray-500 hover:bg-gray-50 transition-colors" },
                ...{ class: (__VLS_ctx.suggestions.length > 0 ? 'border-t border-gray-100' : '') },
            });
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            (__VLS_ctx.$t('items.addNew'));
            (__VLS_ctx.inputName.trim());
        }
        if (__VLS_ctx.searching) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "px-4 py-3 text-sm text-gray-400" },
            });
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            (__VLS_ctx.$t('common.loading'));
        }
        else if (__VLS_ctx.suggestions.length === 0 && __VLS_ctx.inputName.trim().length >= 2 && !__VLS_ctx.searching) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "px-4 py-3 text-sm text-gray-400" },
            });
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            (__VLS_ctx.$t('items.noSuggestions'));
        }
    }
    if (__VLS_ctx.listType !== 'todo') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-6 items-end" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col text-xl" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            ...{ class: "text-gray-900 mb-1" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
        (__VLS_ctx.$t('items.quantity'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            ...{ onInput: (...[$event]) => {
                    if (!(__VLS_ctx.showAddForm))
                        return;
                    if (!(__VLS_ctx.listType !== 'todo'))
                        return;
                    __VLS_ctx.error = '';
                    // @ts-ignore
                    [$t, $t, $t, $t, listType, error, inputName, inputName, inputName, suggestions, suggestions, addAsFreeText, searching, searching,];
                } },
            type: "number",
            min: "0.01",
            step: "0.01",
            placeholder: "—",
            ...{ class: "w-20 p-2 text-gray-900 focus:outline-none" },
        });
        (__VLS_ctx.form.quantity);
        /** @type {__VLS_StyleScopedClasses['w-20']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col text-xl" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            ...{ class: "text-gray-900 mb-1" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
        (__VLS_ctx.$t('items.unit'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
            value: (__VLS_ctx.form.unit_id),
            ...{ class: "p-2 text-gray-900 focus:outline-none bg-transparent" },
        });
        /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            value: (null),
        });
        for (const [units, groupType] of __VLS_vFor((__VLS_ctx.unitGroups))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
                label: (__VLS_ctx.$t('units.types.' + groupType)),
                key: (groupType),
            });
            for (const [unit] of __VLS_vFor((units))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                    key: (unit.id),
                    value: (unit.id),
                });
                (unit.name);
                // @ts-ignore
                [$t, $t, form, form, unitGroups,];
            }
            // @ts-ignore
            [];
        }
    }
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-red-500 text-base" },
        });
        /** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
        (__VLS_ctx.error);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        ...{ class: "mt-2 ml-auto text-gray-900 hover:text-gray-600 text-2xl flex items-center gap-2 cursor-pointer transition duration-200 hover:scale-105" },
        ...{ class: ({ shake: __VLS_ctx.shaking }) },
    });
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
    /** @type {__VLS_StyleScopedClasses['shake']} */ ;
    (__VLS_ctx.$t('items.addItem'));
}
// @ts-ignore
[$t, error, error, shaking,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
