import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { applyLocale } from '@/plugins/i18n';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';
import locales from '@/locales/locales.json';
export function useLocale() {
    const { locale } = useI18n();
    const authStore = useAuthStore();
    const currentLocale = computed(() => locale.value);
    const availableLocales = locales;
    async function setLocale(code) {
        applyLocale(code);
        if (authStore.isAuthenticated) {
            try {
                const res = await authService.updateProfile({ locale: code });
                if (authStore.user)
                    authStore.user.locale = res.user.locale ?? null;
            }
            catch (e) {
                console.error('Failed to save locale preference:', e);
            }
        }
    }
    return { currentLocale, availableLocales, setLocale };
}
