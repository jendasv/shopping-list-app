<template>
  <div class="min-h-screen flex items-center justify-center px-8 py-12">
    <div class="w-full max-w-sm text-center">
      <h1 class="text-2xl font-bold mb-2">Email verified</h1>
      <p class="text-gray-500 text-sm mb-8">
        Your account is active. You can now sign in.
      </p>
      <RouterLink :to="{ name: 'login' }" class="btn-primary inline-block">
        Sign in
      </RouterLink>
    </div>
  </div>
</template>

