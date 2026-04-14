<template>
  <div class="py-4 space-y-10">
    <h1 class="text-2xl font-bold text-center">{{ $t('household.title') }}</h1>

    <div v-if="loading" class="text-sm text-gray-500">{{ $t('common.loading') }}</div>
    <template v-else-if="data">

      <!-- Own household -->
      <section>
        <h2 class="text-xl font-semibold mb-4">{{ $t('household.settings') }}</h2>

        <!-- Name -->
        <form @submit.prevent="saveHousehold" class="space-y-4 mb-6">
          <div class="flex items-baseline gap-3 text-xl">
            <label class="text-gray-900 shrink-0" for="householdName">{{ $t('household.householdName') }}</label>
            <input id="householdName" v-model="householdName" :placeholder="$t('household.householdNamePlaceholder')" type="text" required class="flex-1 p-2 focus:outline-none focus:border-gray-600 text-gray-900" />
          </div>
          <AlertMessage v-if="nameError" type="error" :message="nameError" />
          <AlertMessage v-if="nameSuccess" type="success" :message="nameSuccess" />
          <button type="submit" :disabled="nameSaving" class="btn-primary">
            {{ nameSaving ? $t('common.saving') : $t('household.saveNameBtn') }}
          </button>
        </form>

        <HandDrawnDivider class="my-6" />

        <!-- Invite -->
        <div class="mb-6">
          <p class="text-xl font-bold mb-3 flex items-center gap-2">
            {{ $t('household.inviteMember') }}
            <span class="text-xs bg-black text-white px-1.5 py-0.5 rounded font-medium">{{ $t('household.pro') }}</span>
          </p>
          <form @submit.prevent="sendInvite" class="flex items-baseline gap-3 text-xl">
            <label class="text-gray-900 shrink-0" for="inviteEmail">{{ $t('household.inviteEmail') }}</label>
            <input
              id="inviteEmail"
              v-model="inviteEmail"
              type="email"
              :placeholder="$t('household.inviteEmailPlaceholder')"
              class="flex-1 p-2 focus:outline-none focus:border-gray-600 text-gray-900"
            />
            <button type="submit" :disabled="inviteLoading" class="btn-primary whitespace-nowrap shrink-0">
              {{ inviteLoading ? '...' : $t('household.invite') }}
            </button>
          </form>
          <AlertMessage v-if="inviteError" type="error" :message="inviteError" class="mt-2" />
          <AlertMessage v-if="inviteSuccess" type="success" :message="inviteSuccess" class="mt-2" />
        </div>

        <HandDrawnDivider class="my-6" />

        <!-- Members -->
        <div>
          <p class="text-xl font-bold mb-3">{{ $t('household.members') }}</p>
          <ul class="space-y-3">
            <li
              v-for="member in data.ownHousehold.members"
              :key="member.id"
              class="flex items-center justify-between text-xl"
            >
              <span>{{ member.name }} <span class="text-gray-400 text-base">({{ member.email }})</span></span>
              <span class="text-base text-gray-400 capitalize">{{ member.role === 'owner' ? $t('lists.owner') : $t('lists.member') }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Joined households -->
      <section v-if="data.joinedHouseholds.length > 0">
        <HandDrawnDivider class="my-6" />
        <h2 class="text-xl font-semibold mb-4">{{ $t('household.joinedHouseholds') }}</h2>

        <ul class="space-y-3">
          <li
            v-for="household in data.joinedHouseholds"
            :key="household.id"
            class="flex items-center justify-between text-xl"
          >
            <span class="font-medium">{{ household.name }}</span>
            <button @click="leave(household.id)" class="text-red-600 underline hover:text-red-800 cursor-pointer">
              {{ $t('household.leave') }}
            </button>
          </li>
        </ul>
        <AlertMessage v-if="leaveErrorMsg" type="error" :message="leaveErrorMsg" class="mt-3" />
      </section>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { householdService } from '@/services/householdService'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import type { iHouseholdOverview } from '@/types'

const { t } = useI18n()

const loading = ref(true)
const data = ref<iHouseholdOverview | null>(null)
const householdName = ref('')

// Name
const nameSaving = ref(false)
const nameError = ref('')
const nameSuccess = ref('')

// Invite
const inviteEmail = ref('')
const inviteLoading = ref(false)
const inviteError = ref('')
const inviteSuccess = ref('')

// Leave
const leaveErrorMsg = ref('')

onMounted(async () => {
  try {
    data.value = await householdService.getHousehold()
    householdName.value = data.value.ownHousehold.name
  } finally {
    loading.value = false
  }
})

async function saveHousehold() {
  nameError.value = ''
  nameSuccess.value = ''
  nameSaving.value = true
  try {
    await householdService.updateHousehold(householdName.value)
    if (data.value) data.value.ownHousehold.name = householdName.value
    nameSuccess.value = t('household.nameSaved')
  } catch (e: unknown) {
    const err = e as { message?: string }
    nameError.value = err.message ?? t('household.errors.nameSaveFailed')
  } finally {
    nameSaving.value = false
  }
}

async function sendInvite() {
  inviteError.value = ''
  inviteSuccess.value = ''
  inviteLoading.value = true
  try {
    await householdService.sendInvitation(inviteEmail.value)
    inviteSuccess.value = t('household.inviteSent', { email: inviteEmail.value })
    inviteEmail.value = ''
  } catch (e: unknown) {
    const err = e as { message?: string }
    inviteError.value = err.message ?? t('household.errors.inviteFailed')
  } finally {
    inviteLoading.value = false
  }
}

async function leave(id: number) {
  if (!confirm(t('household.leaveConfirm'))) return
  leaveErrorMsg.value = ''
  try {
    await householdService.leaveHousehold(id)
    if (data.value) {
      data.value.joinedHouseholds = data.value.joinedHouseholds.filter((h) => h.id !== id)
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    leaveErrorMsg.value = err.message ?? t('household.errors.leaveFailed')
  }
}
</script>
