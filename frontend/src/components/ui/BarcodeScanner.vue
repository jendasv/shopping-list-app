<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 bg-black flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4">
        <button
          v-if="state !== 'scanning'"
          type="button"
          class="text-white/60 text-sm flex items-center gap-1"
          @click="scanAgain"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {{ $t('barcode.scanning') }}
        </button>
        <span v-else class="text-white text-lg font-medium">{{ $t('barcode.scanning') }}</span>
        <button
          type="button"
          class="text-white text-2xl leading-none w-10 h-10 flex items-center justify-center"
          @click="close"
        >✕</button>
      </div>

      <!-- Unsupported browser (iOS Chrome) -->
      <div v-if="unsupportedBrowser" class="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p class="text-white text-base font-medium">{{ $t('barcode.unsupportedTitle') }}</p>
        <p class="text-white/60 text-sm leading-relaxed">{{ $t('barcode.unsupportedHint') }}</p>
        <p v-if="isDev" class="text-yellow-400 text-xs font-mono mt-2">{{ debugStatus }}</p>
      </div>

      <!-- Permission denied -->
      <div v-else-if="permissionDenied" class="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
        </svg>
        <p class="text-white text-base font-medium">{{ $t('barcode.permissionDeniedTitle') }}</p>
        <p class="text-white/60 text-sm leading-relaxed">{{ $t('barcode.permissionDeniedHint') }}</p>
        <button
          type="button"
          class="mt-2 px-6 py-3 bg-white text-black rounded-lg font-medium text-sm"
          @click="retryPermission"
        >
          {{ $t('barcode.retryPermission') }}
        </button>
      </div>

      <!-- Searching -->
      <div v-else-if="state === 'searching'" class="flex-1 flex flex-col items-center justify-center gap-5">
        <div class="w-10 h-10 border-2 border-white/20 border-t-white rounded-full spinner" />
        <p class="text-white text-base">{{ $t('barcode.searching') }}</p>
        <p class="text-white/40 text-xs font-mono">{{ detectedBarcode }}</p>
        <p v-if="isDev" class="text-yellow-400 text-xs font-mono mt-2">{{ debugStatus }}</p>
      </div>

      <!-- Not found -->
      <div v-else-if="state === 'notFound'" class="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2v16H3V4zm4 0h1v16H7V4zm3 0h2v16h-2V4zm4 0h1v16h-1V4zm3 0h1v16h-1V4zM2 3h4v2H2V3zm0 16h4v2H2v-2zm14-16h4v2h-4V3zm0 16h4v2h-4v-2z" />
        </svg>
        <div class="flex flex-col gap-1">
          <p class="text-white text-base font-medium">{{ $t('barcode.notFoundTitle') }}</p>
          <p class="text-white/40 text-xs font-mono">{{ detectedBarcode }}</p>
        </div>
        <div class="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            class="px-6 py-3 bg-white text-black rounded-lg font-medium text-sm"
            @click="scanAgain"
          >{{ $t('barcode.scanAgain') }}</button>
          <button
            type="button"
            class="px-6 py-3 border border-white/30 text-white rounded-lg font-medium text-sm"
            @click="goManualInput"
          >{{ $t('barcode.enterManually') }}</button>
          <button
            type="button"
            class="px-4 py-2 text-white/50 text-sm"
            @click="continueWithBarcode"
          >{{ $t('barcode.continueWithBarcode') }}</button>
        </div>
      </div>

      <!-- Manual input -->
      <div v-else-if="state === 'manualInput'" class="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <p class="text-white text-base font-medium text-center">{{ $t('barcode.manualInputTitle') }}</p>
        <input
          ref="manualInputRef"
          v-model="manualBarcodeInput"
          type="text"
          inputmode="numeric"
          :placeholder="$t('barcode.manualInputPlaceholder')"
          class="w-full max-w-xs px-4 py-3 bg-white/10 text-white rounded-lg text-center font-mono text-lg focus:outline-none border border-white/20 focus:border-white/50 placeholder-white/30"
          @keydown.enter="searchManual"
        />
        <div class="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            class="px-6 py-3 bg-white text-black rounded-lg font-medium text-sm disabled:opacity-40"
            :disabled="!manualBarcodeInput.trim()"
            @click="searchManual"
          >{{ $t('barcode.search') }}</button>
          <button
            type="button"
            class="px-4 py-2 text-white/50 text-sm"
            @click="scanAgain"
          >{{ $t('barcode.scanAgain') }}</button>
        </div>
      </div>

      <!-- Camera viewport (scanning state) -->
      <template v-else>
        <div class="flex-1 relative overflow-hidden">
          <video
            ref="videoRef"
            class="absolute inset-0 w-full h-full object-cover"
            playsinline
            autoplay
            muted
          />

          <!-- Overlay with cutout -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50" />
            <div class="relative w-72 h-40 rounded-lg border-2 border-white z-10">
              <span class="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-md" />
              <span class="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-md" />
              <span class="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-md" />
              <span class="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-md" />
              <div class="absolute inset-x-2 top-1/2 h-0.5 bg-red-500 scan-line" />
            </div>
          </div>
        </div>

        <div class="p-6 text-center">
          <p class="text-white/70 text-sm">{{ $t('barcode.pointCamera') }}</p>
          <button
            type="button"
            class="mt-3 text-white/40 text-xs underline"
            @click="goManualInputFromScan"
          >{{ $t('barcode.enterManually') }}</button>
          <p v-if="isDev" class="text-yellow-400 text-xs font-mono mt-2">{{ debugStatus }}</p>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { searchByBarcode } from '@/services/globalProductService'
import type { iGlobalProduct } from '@/types'

type ScannerState = 'scanning' | 'searching' | 'notFound' | 'manualInput'

const emit = defineEmits<{
  (e: 'productFound', product: iGlobalProduct): void
  (e: 'barcodeOnly', barcode: string): void
  (e: 'close'): void
}>()

useI18n()
const isDev = import.meta.env.DEV

const videoRef = ref<HTMLVideoElement | null>(null)
const manualInputRef = ref<HTMLInputElement | null>(null)
const permissionDenied = ref(false)
const unsupportedBrowser = ref(false)
const debugStatus = ref('')

const state = ref<ScannerState>('scanning')
const detectedBarcode = ref('')
const manualBarcodeInput = ref('')

let controls: { stop: () => void } | null = null
let activeStream: MediaStream | null = null

onMounted(() => startScanner())
onUnmounted(() => stopAll())

watch(state, async (val) => {
  if (val === 'scanning') {
    await nextTick()
    startScanner()
  } else if (val === 'manualInput') {
    await nextTick()
    manualInputRef.value?.focus()
  }
})

function stopAll() {
  controls?.stop()
  controls = null
  activeStream?.getTracks().forEach(t => t.stop())
  activeStream = null
}

async function startScanner() {
  permissionDenied.value = false
  await nextTick()
  if (!videoRef.value) return

  if (isDev) {
    debugStatus.value = `mediaDevices: ${!!navigator.mediaDevices} | getUserMedia: ${!!navigator.mediaDevices?.getUserMedia} | protocol: ${location.protocol}`
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    unsupportedBrowser.value = true
    return
  }

  try {
    if (isDev) debugStatus.value = 'Requesting camera...'
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    })

    activeStream = stream
    const video = videoRef.value
    video.srcObject = stream

    if (isDev) debugStatus.value = 'Starting playback...'
    await video.play()

    if (isDev) debugStatus.value = 'Starting decoder...'
    const reader = new BrowserMultiFormatReader()
    controls = await reader.decodeFromVideoElement(video, (result) => {
      if (!controls || !result) return
      const barcode = result.getText()
      stopAll()
      handleBarcode(barcode)
    })

    if (isDev) debugStatus.value = 'Scanning...'
  } catch (e) {
    const err = e as Error
    if (isDev) debugStatus.value = `Error: ${err.name} — ${err.message}`
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'NotFoundError') {
      permissionDenied.value = true
    }
  }
}

async function handleBarcode(barcode: string) {
  state.value = 'searching'
  detectedBarcode.value = barcode
  try {
    const product = await searchByBarcode(barcode)
    if (product) {
      emit('productFound', product)
    } else {
      state.value = 'notFound'
    }
  } catch {
    state.value = 'notFound'
  }
}

async function searchManual() {
  const barcode = manualBarcodeInput.value.trim()
  if (!barcode) return
  await handleBarcode(barcode)
}

function scanAgain() {
  manualBarcodeInput.value = ''
  detectedBarcode.value = ''
  state.value = 'scanning'
}

function goManualInput() {
  state.value = 'manualInput'
}

function goManualInputFromScan() {
  stopAll()
  state.value = 'manualInput'
}

function continueWithBarcode() {
  emit('barcodeOnly', detectedBarcode.value)
}

async function retryPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach(t => t.stop())
  } catch {
    // still denied
  }
  startScanner()
}

function close() {
  emit('close')
}
</script>

<style scoped>
.scan-line {
  animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { transform: translateY(-20px); opacity: 0.8; }
  50% { transform: translateY(20px); opacity: 1; }
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
