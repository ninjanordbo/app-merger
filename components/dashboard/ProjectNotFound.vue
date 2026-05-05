<template>
  <div class="flex h-screen w-full flex-col items-center justify-center gap-3">
    <div class="text-primary-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8v3a1 1 0 0 0 1 1h3m0-4v8m10-8v3a1 1 0 0 0 1 1h3m0-4v8m-11-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0"
        />
      </svg>
    </div>
    <p class="text-xl font-medium">Fant ikke prosjektet</p>

    <div class="flex gap-2">
      <NuxtLink
        class="flex items-center justify-between gap-2 rounded-md border-2 border-neutral-600 bg-white py-1 pl-2 pr-3 duration-200 hover:scale-105"
        to="/dashboard"
      >
        <LucideFileStack :size="20" />
        Velg prosjekt
      </NuxtLink>
    </div>
  </div>
</template>
