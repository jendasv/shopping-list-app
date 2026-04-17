import { reactive } from 'vue';
// Singleton state — shared across all useConfirm() calls
const state = reactive({
    isOpen: false,
    message: '',
    title: '',
    resolve: null,
});
export function useConfirm() {
    function confirm(message, title = '') {
        return new Promise((resolve) => {
            state.isOpen = true;
            state.message = message;
            state.title = title;
            state.resolve = resolve;
        });
    }
    function accept() {
        state.isOpen = false;
        state.resolve?.(true);
        state.resolve = null;
    }
    function cancel() {
        state.isOpen = false;
        state.resolve?.(false);
        state.resolve = null;
    }
    return { confirm, accept, cancel, state };
}
