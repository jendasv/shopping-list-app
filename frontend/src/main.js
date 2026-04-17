import './style.css';
import './assets/main.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { i18n } from '@/plugins/i18n';
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.directive('focus-end', {
    mounted(el) {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
    },
});
app.mount('#app');
