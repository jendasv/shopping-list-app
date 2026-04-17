import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
function getXsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : '';
}
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: window.location.hostname,
    wsPort: 6001,
    wssPort: 6001,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    authorizer: (channel) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authorize: (socketId, callback) => {
            fetch('/broadcasting/auth', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getXsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
            })
                .then((r) => r.json())
                .then((data) => callback(null, data))
                .catch((err) => callback(err instanceof Error ? err : new Error(String(err)), null));
        },
    }),
});
export default echo;
