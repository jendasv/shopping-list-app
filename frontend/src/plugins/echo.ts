import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

function getXsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

// In dev, Reverb is exposed directly on port 6001.
// In production, nginx proxies wss://domain/app → reverb:6001 (port 443).
const isDev = import.meta.env.DEV

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY as string,
  wsHost: window.location.hostname,
  wsPort: isDev ? 6001 : 443,
  wssPort: isDev ? 6001 : 443,
  forceTLS: !isDev,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  authorizer: (channel: { name: string }) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorize: (socketId: string, callback: (error: Error | null, data: any) => void) => {
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
        .then((data) => callback(null, data as object))
        .catch((err: unknown) => callback(err instanceof Error ? err : new Error(String(err)), null))
    },
  }),
})

export default echo
