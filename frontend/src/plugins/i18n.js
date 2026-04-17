import { createI18n } from 'vue-i18n';
import localesConfig from '../locales/locales.json';
import { getCookie, setCookie } from '@/utils/cookie';
// Eagerly import all message files from locales/messages/*.json
// Adding a new language = create the file + add entry to locales/locales.json
const messageFiles = import.meta.glob('../locales/messages/*.json', {
    eager: true,
    import: 'default',
});
export const SUPPORTED_LOCALES = localesConfig.map((l) => l.code);
export const LOCALE_COOKIE = 'app_locale';
const messages = Object.fromEntries(localesConfig.map((loc) => [
    loc.code,
    messageFiles[`../locales/messages/${loc.code}.json`] ?? {},
]));
export function detectLocale() {
    const cookie = getCookie(LOCALE_COOKIE);
    if (cookie && SUPPORTED_LOCALES.includes(cookie))
        return cookie;
    const browser = navigator.language.split('-')[0] ?? 'en';
    if (SUPPORTED_LOCALES.includes(browser))
        return browser;
    return 'en';
}
export const i18n = createI18n({
    legacy: false,
    locale: detectLocale(),
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    messages,
});
export function applyLocale(code) {
    const locale = SUPPORTED_LOCALES.includes(code) ? code : 'en';
    i18n.global.locale.value = locale;
    setCookie(LOCALE_COOKIE, locale);
}
